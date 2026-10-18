import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gameStorage } from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception in Server:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Maps legacy question IDs to appropriate taxonomy section IDs
function mapLegacySection(q) {
  if (q.section_id) return q.section_id;
  if (!q.id) return 'UNKNOWN';

  if (q.id.startsWith('cpacc-d1')) {
    const num = parseInt(q.id.replace('cpacc-d1-', ''), 10);
    if (num <= 5) return 'CPACC-D1-A'; // Theoretical Models
    if (num <= 10) return 'CPACC-D1-B'; // Disability Categories & Barriers
    return 'CPACC-D1-C'; // Assistive Tech
  } else if (q.id.startsWith('cpacc-d2')) {
    const num = parseInt(q.id.replace('cpacc-d2-', ''), 10);
    if (num <= 5) return 'CPACC-D2-E'; // Principles of Universal Design
    if (num <= 10) return 'CPACC-D2-F'; // UDL
    return 'CPACC-D2-C'; // WCAG Principles
  } else if (q.id.startsWith('cpacc-d3')) {
    const num = parseInt(q.id.replace('cpacc-d3-', ''), 10);
    if (num <= 5) return 'CPACC-D3-D'; // Laws & Regulations
    return 'CPACC-D3-F'; // Integrating ICT Accessibility
  } else if (q.id.startsWith('was-d1')) {
    return 'WAS-D1-B'; // Semantic HTML & Custom Controls
  } else if (q.id.startsWith('was-d2')) {
    return 'WAS-D2-B'; // Guidelines, Conformance & WCAG-EM
  } else if (q.id.startsWith('was-d3')) {
    return 'WAS-D3-A'; // Severity & Prioritization
  }
  return 'UNKNOWN';
}

// Universal Question Record Normalizer
function normalizeQuestion(raw, defaultCert = 'CPACC') {
  if (!raw) return null;

  const cert = raw.certification_id || (raw.id?.startsWith('was-') ? 'WAS' : defaultCert);
  const sectionId = mapLegacySection(raw);

  let domainNum = 1;
  if (typeof raw.domain === 'number') {
    domainNum = raw.domain;
  } else if (typeof raw.domain_id === 'string') {
    const match = raw.domain_id.match(/-D(\d)/i);
    if (match) domainNum = parseInt(match[1], 10);
  }

  // Tags / Subject derivation
  let tags = [];
  if (Array.isArray(raw.tags)) {
    tags = raw.tags;
  } else if (raw.topic) {
    tags = [raw.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')];
  }

  // Already normalized legacy arcade format
  if (raw.question && Array.isArray(raw.choices)) {
    return {
      ...raw,
      domain: domainNum,
      domain_id: raw.domain_id || `${cert}-D${domainNum}`,
      section_id: sectionId,
      concept_id: raw.concept_id || '',
      tags,
      certification: cert,
      citation: raw.citation || raw.cpaccRef || raw.wasRef || `${cert} Body of Knowledge`
    };
  }

  // Structured Quiz-Bank schema format
  const questionText = raw.stem || raw.question || 'Accessibility Question';

  const shapes = ['triangle', 'diamond', 'circle', 'square'];
  let choices = [];
  if (raw.type === 'true_false' || typeof raw.answer === 'boolean') {
    const isAnswerTrue = raw.answer === true || String(raw.answer).toLowerCase() === 'true';
    choices = [
      { id: 'A', text: 'True', shape: 'triangle', isCorrect: isAnswerTrue },
      { id: 'B', text: 'False', shape: 'diamond', isCorrect: !isAnswerTrue }
    ];
  } else if (Array.isArray(raw.options)) {
    choices = raw.options.map((opt, idx) => ({
      id: opt.id,
      text: opt.text,
      shape: shapes[idx % shapes.length],
      isCorrect: opt.id === raw.answer
    }));
  } else if (Array.isArray(raw.choices)) {
    choices = raw.choices.map((c, idx) => ({
      ...c,
      shape: c.shape || shapes[idx % shapes.length]
    }));
  }

  const citation = raw.source_refs?.[0]?.locator ||
                   raw.source_refs?.[0]?.source_id ||
                   raw.citation ||
                   raw.cpaccRef ||
                   raw.wasRef ||
                   `${cert} Body of Knowledge`;

  const topic = raw.topic ||
                (raw.concept_id ? raw.concept_id.replace(/^([a-z0-9]+-)+/i, '').replace(/-/g, ' ').toUpperCase() : '') ||
                raw.section_id ||
                'Accessibility Standard';

  const correctAnswer = typeof raw.answer === 'boolean'
    ? (raw.answer ? 'A' : 'B')
    : (raw.answer || choices.find(c => c.isCorrect)?.id || 'A');

  return {
    id: raw.id,
    question: questionText,
    domain: domainNum,
    domain_id: raw.domain_id || `${cert}-D${domainNum}`,
    section_id: sectionId,
    concept_id: raw.concept_id || '',
    tags,
    certification: cert,
    topic,
    difficulty: raw.difficulty || 'medium',
    choices,
    correctAnswer,
    explanation: raw.explanation || 'Refer to the official IAAP Body of Knowledge.',
    citation,
    funNote: raw.funNote || ''
  };
}

// Load Question Banks (CPACC & WAS)
let questionBank = [];
const cpaccPath = path.join(__dirname, '..', 'data', 'questions.json');
const cpaccAltPath = path.join(__dirname, '..', 'data', 'questions_cpacc.json');
const qbCpaccPath = path.join(__dirname, '..', 'data', 'quiz-bank', 'cpacc.json');
const wasPath = path.join(__dirname, '..', 'data', 'questions_was.json');
const qbWasPath = path.join(__dirname, '..', 'data', 'quiz-bank', 'was.json');

try {
  const bankMap = new Map();

  const loadAndIngest = (filePath, cert) => {
    if (fs.existsSync(filePath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(raw)) {
          raw.forEach(item => {
            const norm = normalizeQuestion(item, cert);
            if (norm && norm.id && !bankMap.has(norm.id)) {
              bankMap.set(norm.id, norm);
            }
          });
        }
      } catch (e) {
        console.error(`Error parsing ${filePath}:`, e.message);
      }
    }
  };

  // Load CPACC banks
  loadAndIngest(cpaccPath, 'CPACC');
  loadAndIngest(cpaccAltPath, 'CPACC');
  loadAndIngest(qbCpaccPath, 'CPACC');

  // Load WAS banks
  loadAndIngest(wasPath, 'WAS');
  loadAndIngest(qbWasPath, 'WAS');

  questionBank = Array.from(bankMap.values());
  const cpaccTotal = questionBank.filter(q => q.certification === 'CPACC').length;
  const wasTotal = questionBank.filter(q => q.certification === 'WAS').length;
  console.log(`Loaded ${questionBank.length} questions total (${cpaccTotal} CPACC, ${wasTotal} WAS).`);
} catch (err) {
  console.error('Failed to load question banks:', err.message);
}

// Load Policy Flaws Bank (Mode 7: Flaw Finder)
const flawsPath = path.join(__dirname, '..', 'data', 'policy_flaws.json');
let policyFlawsBank = [];
try {
  const data = fs.readFileSync(flawsPath, 'utf8');
  policyFlawsBank = JSON.parse(data);
  console.log(`Loaded ${policyFlawsBank.length} scenarios from policy flaws bank.`);
} catch (err) {
  console.error('Failed to load policy_flaws.json:', err.message);
}

// Load Boundary Cards Bank (Mode 4: Boundary Line Brawl)
const boundaryCardsPath = path.join(__dirname, '..', 'data', 'boundary_cards.json');
let boundaryCardsBank = [];
try {
  const data = fs.readFileSync(boundaryCardsPath, 'utf8');
  boundaryCardsBank = JSON.parse(data);
  console.log(`Loaded ${boundaryCardsBank.length} cards from boundary cards bank.`);
} catch (err) {
  console.error('Failed to load boundary_cards.json:', err.message);
}

// Load Boss Raids Bank (Mode 8: The Enterprise Boss Raid)
const bossRaidsPath = path.join(__dirname, '..', 'data', 'boss_raids.json');
let bossRaidsBank = [];
try {
  const data = fs.readFileSync(bossRaidsPath, 'utf8');
  bossRaidsBank = JSON.parse(data);
  console.log(`Loaded ${bossRaidsBank.length} boss raid scenarios from boss raids bank.`);
} catch (err) {
  console.error('Failed to load boss_raids.json:', err.message);
}

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/flaws', (req, res) => {
  res.json(policyFlawsBank);
});

app.get('/api/boundary-cards', (req, res) => {
  res.json(boundaryCardsBank);
});

app.get('/api/boss-raids', (req, res) => {
  res.json(bossRaidsBank);
});

// Load Taxonomy for Sections & Domains
const taxonomyPath = path.join(__dirname, '..', 'data', 'quiz-bank', 'taxonomy.json');
let taxonomyData = null;
try {
  if (fs.existsSync(taxonomyPath)) {
    taxonomyData = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load taxonomy.json:', err.message);
}

// Taxonomy Endpoint (with real-time section question counts & health indicators)
app.get('/api/taxonomy', (req, res) => {
  const { track } = req.query;
  const targetTrack = (track || 'all').toLowerCase();

  const counts = {};
  questionBank.forEach(q => {
    if (q.section_id) {
      counts[q.section_id] = (counts[q.section_id] || 0) + 1;
    }
  });

  if (!taxonomyData || !Array.isArray(taxonomyData.certifications)) {
    return res.json({ certifications: [] });
  }

  const enrichedCerts = taxonomyData.certifications
    .filter(c => targetTrack === 'all' || c.id.toLowerCase() === targetTrack)
    .map(c => ({
      ...c,
      domains: (c.domains || []).map(d => ({
        ...d,
        sections: (d.sections || []).map(s => {
          const count = counts[s.id] || 0;
          let status = 'healthy';
          if (count < 5) status = 'critical';
          else if (count < 10) status = 'low';
          return {
            ...s,
            count,
            status,
            warning: count < 5 ? `Critical (< 5): only ${count} items` : count < 10 ? `Low (< 10): ${count} items` : null
          };
        })
      }))
    }));

  res.json({ certifications: enrichedCerts });
});

// Section Audit Endpoint (Reports sections with low or critical counts)
app.get('/api/sections/audit', (req, res) => {
  const counts = {};
  questionBank.forEach(q => {
    if (q.section_id) counts[q.section_id] = (counts[q.section_id] || 0) + 1;
  });

  const critical = [];
  const low = [];
  const healthy = [];

  if (taxonomyData && Array.isArray(taxonomyData.certifications)) {
    taxonomyData.certifications.forEach(c => {
      (c.domains || []).forEach(d => {
        (d.sections || []).forEach(s => {
          const count = counts[s.id] || 0;
          const entry = {
            id: s.id,
            label: s.label,
            certification: c.id,
            domainId: d.id,
            count
          };
          if (count < 5) critical.push(entry);
          else if (count < 10) low.push(entry);
          else healthy.push(entry);
        });
      });
    });
  }

  res.json({
    totalSections: critical.length + low.length + healthy.length,
    critical,
    low,
    healthy,
    summary: `Found ${critical.length} critical section(s) (< 5 items) and ${low.length} low section(s) (< 10 items).`
  });
});

// Subjects / Tags Endpoint
app.get('/api/subjects', (req, res) => {
  const { track } = req.query;
  const targetTrack = (track || 'all').toLowerCase();

  const subjectMap = {};
  questionBank.forEach(q => {
    if (targetTrack !== 'all' && q.certification?.toLowerCase() !== targetTrack) return;
    const tags = Array.isArray(q.tags) && q.tags.length > 0 ? q.tags : [q.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')];
    tags.forEach(t => {
      const clean = t.toLowerCase().trim();
      if (!clean) return;
      subjectMap[clean] = (subjectMap[clean] || 0) + 1;
    });
  });

  const subjects = Object.entries(subjectMap)
    .filter(([_, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({
      id,
      label: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count
    }));

  res.json(subjects);
});

app.get('/api/questions', (req, res) => {
  const { domain, difficulty, limit, track, cert, sections, section, subjects, subject } = req.query;
  const certTrack = (track || cert || 'all').toLowerCase();

  let filtered = [...questionBank];
  if (certTrack !== 'all') {
    filtered = filtered.filter(q => q.certification?.toLowerCase() === certTrack);
  }
  if (domain && domain !== 'all') {
    filtered = filtered.filter(q => q.domain === parseInt(domain, 10));
  }
  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }

  // Multi-section filter
  const rawSections = sections || section;
  if (rawSections) {
    const secList = (Array.isArray(rawSections) ? rawSections : String(rawSections).split(',')).map(s => s.trim()).filter(Boolean);
    if (secList.length > 0) {
      const secSet = new Set(secList);
      filtered = filtered.filter(q => q.section_id && secSet.has(q.section_id));
    }
  }

  // Multi-subject filter
  const rawSubjects = subjects || subject;
  if (rawSubjects) {
    const subList = (Array.isArray(rawSubjects) ? rawSubjects : String(rawSubjects).split(',')).map(s => s.trim().toLowerCase()).filter(Boolean);
    if (subList.length > 0) {
      const subSet = new Set(subList);
      filtered = filtered.filter(q => {
        const qTags = (q.tags || []).map(t => t.toLowerCase());
        const qTopic = (q.topic || '').toLowerCase();
        return qTags.some(t => subSet.has(t)) || subSet.has(qTopic);
      });
    }
  }

  if (limit) {
    const lim = parseInt(limit, 10);
    filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, lim);
  }
  res.json(filtered);
});

app.get('/api/domains', (req, res) => {
  const track = (req.query.track || req.query.cert || 'all').toLowerCase();
  if (track === 'was') {
    res.json([
      { id: 'all', name: 'All WAS Domains (Web Accessibility Specialist)' },
      { id: 1, name: 'Domain 1: Creating Accessible Web Solutions (WCAG/ARIA/HTML)' },
      { id: 2, name: 'Domain 2: Identifying Accessibility Issues & Auditing' },
      { id: 3, name: 'Domain 3: Offering Remediation & Accessibility Strategies' }
    ]);
  } else if (track === 'cpacc') {
    res.json([
      { id: 'all', name: 'All CPACC Domains (Core Competencies)' },
      { id: 1, name: 'Domain 1: Disabilities, Challenges & Assistive Tech' },
      { id: 2, name: 'Domain 2: Accessibility & Universal Design (WCAG)' },
      { id: 3, name: 'Domain 3: Standards, Laws & Management Strategies' }
    ]);
  } else {
    res.json([
      { id: 'all', name: 'All Domains (Dual CPACC & WAS Exam Pool)' },
      { id: 1, name: 'Domain 1: Disabilities / Creating Accessible Web Solutions' },
      { id: 2, name: 'Domain 2: Universal Design / Identifying Accessibility Issues' },
      { id: 3, name: 'Domain 3: Standards, Laws & Remediation Strategies' }
    ]);
  }
});

// Leaderboard & Study Endpoints
app.get('/api/leaderboard/weekly', (req, res) => {
  const leaderboard = gameStorage.getWeeklyLeaderboard();
  res.json({ leaderboard });
});

app.get('/api/leaderboard/all-time', (req, res) => {
  const leaderboard = gameStorage.getAllTimeLeaderboard();
  res.json({ leaderboard });
});

app.get('/api/study/missed', (req, res) => {
  const nickname = req.query.nickname || 'all';
  const missed = gameStorage.getMissedQuestions(nickname);
  res.json({ missed });
});

// Option B: 4-digit PIN Authentication & Profiles
app.post('/api/user/auth', (req, res) => {
  const { nickname, pin, avatar } = req.body || {};
  const result = gameStorage.registerOrVerifyUser({ nickname, pin, avatar });
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.get('/api/user/profile', (req, res) => {
  const { nickname, pin } = req.query || {};
  const profile = gameStorage.getUserProfile(nickname, pin);
  if (!profile) {
    return res.status(404).json({ success: false, error: 'User profile not found or PIN incorrect.' });
  }
  res.json({ success: true, profile });
});

// Game Rooms State Management
const rooms = new Map();

function generatePin() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pin = '';
  for (let i = 0; i < 4; i++) {
    pin += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return rooms.has(pin) ? generatePin() : pin;
}

function sanitizeQuestionForPlayers(q) {
  return {
    id: q.id,
    domain: q.domain,
    domainName: q.domainName,
    topic: q.topic,
    type: q.type,
    difficulty: q.difficulty,
    question: q.question,
    choices: q.choices.map(c => ({
      id: c.id,
      text: c.text,
      shape: c.shape
    }))
  };
}

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // ==========================================
  // 1. Room Creation (Multi-Mode)
  // ==========================================
  socket.on('create-room', (settings = {}, callback) => {
    const pin = generatePin();
    const gameMode = settings.gameMode || 'CLASSIC'; // 'CLASSIC' | 'HOT_POTATO' | 'GRAND_PRIX'
    const timeLimit = typeof settings.timeLimit === 'number' ? settings.timeLimit : (gameMode === 'HOT_POTATO' ? 20 : 20);
    const questionCount = settings.questionCount || 10;
    const selectedDomain = settings.domain || 'all';
    const certTrack = (settings.certTrack || settings.track || 'all').toLowerCase();

    // Multi-section and Multi-subject extraction
    const rawSections = settings.sections || settings.section;
    const selectedSections = rawSections
      ? (Array.isArray(rawSections) ? rawSections : String(rawSections).split(',')).map(s => s.trim()).filter(Boolean)
      : [];

    const rawSubjects = settings.subjects || settings.subject;
    const selectedSubjects = rawSubjects
      ? (Array.isArray(rawSubjects) ? rawSubjects : String(rawSubjects).split(',')).map(s => s.trim().toLowerCase()).filter(Boolean)
      : [];

    let pool = [...questionBank];
    if (certTrack !== 'all') {
      pool = pool.filter(q => q.certification?.toLowerCase() === certTrack);
    }
    if (selectedDomain !== 'all') {
      pool = pool.filter(q => q.domain === parseInt(selectedDomain, 10));
    }
    if (selectedSections.length > 0) {
      const secSet = new Set(selectedSections);
      pool = pool.filter(q => q.section_id && secSet.has(q.section_id));
    }
    if (selectedSubjects.length > 0) {
      const subSet = new Set(selectedSubjects);
      pool = pool.filter(q => {
        const qTags = (q.tags || []).map(t => t.toLowerCase());
        const qTopic = (q.topic || '').toLowerCase();
        return qTags.some(t => subSet.has(t)) || subSet.has(qTopic);
      });
    }

    let poolWarning = null;
    let chosenQuestions = [];
    if (pool.length === 0) {
      poolWarning = 'No questions matched the selected section/subject filter. Falling back to active track pool.';
      let fallbackPool = questionBank.filter(q => certTrack === 'all' || q.certification?.toLowerCase() === certTrack);
      chosenQuestions = fallbackPool.sort(() => 0.5 - Math.random()).slice(0, questionCount);
    } else {
      if (pool.length < questionCount) {
        poolWarning = `Selected section(s)/subject(s) only contain ${pool.length} question(s). Round size adjusted to ${pool.length}.`;
      }
      chosenQuestions = pool.sort(() => 0.5 - Math.random()).slice(0, questionCount);
    }

    const hostParticipates = Boolean(settings.hostParticipates);

    const room = {
      pin,
      hostSocketId: socket.id,
      gameMode,
      settings: {
        gameMode,
        certTrack,
        timeLimit,
        questionCount: chosenQuestions.length,
        domain: selectedDomain,
        sections: selectedSections,
        subjects: selectedSubjects,
        poolWarning,
        blunderPenalty: settings.blunderPenalty !== false, // for Hot Potato
        targetDistance: settings.targetDistance || 100,    // for Grand Prix
        hostParticipates
      },
      status: 'LOBBY',
      players: new Map(),
      disconnectedPlayers: new Map(),
      questions: chosenQuestions,
      currentQuestionIndex: -1,
      timer: null,
      timeLeft: timeLimit,
      answersThisRound: new Map(),

      // Hot Potato State
      hotPotato: {
        hotSeatIndex: 0,
        hotSeatPlayer: null,
        delegates: [],
        action: null, // 'TAKE' | 'PASS'
        submissions: new Map(),
        jackpotPot: 0
      },

      // Grand Prix State
      grandPrix: {
        targetDistance: settings.targetDistance || 100,
        questionPool: pool,
        finishedCount: 0,
        podium: []
      },

      // High-Roller Gauntlet State
      highRoller: {
        currentQuestionIndex: 0,
        wagers: new Map(),
        submissions: new Map(),
        stage: 'HR_TEASER',
        underdogTriggered: false
      },

      // Flaw Finder State
      flawFinder: {
        currentScenarioIndex: 0,
        scenarios: (function() {
          let pool = [...policyFlawsBank];
          if (selectedDomain !== 'all') {
            const filtered = pool.filter(f => f.domain === parseInt(selectedDomain, 10));
            if (filtered.length > 0) pool = filtered;
          }
          return pool.sort(() => 0.5 - Math.random()).slice(0, Math.min(pool.length, questionCount || 5));
        })(),
        submissions: new Map(),
        stage: 'FF_SNIPING'
      },

      // Saboteur in the Server Room State
      saboteur: {
        compliancePercent: 0,
        serverTimeLeft: typeof settings.timeLimit === 'number' && settings.timeLimit > 30 ? settings.timeLimit : 180,
        totalTime: typeof settings.timeLimit === 'number' && settings.timeLimit > 30 ? settings.timeLimit : 180,
        saboteurId: null,
        activeStandup: null,
        terminalLogs: [],
        questionPool: pool,
        subsystems: [
          { id: 'auth', name: 'Authentication & SSO (WCAG 3.3.8)', progress: 0 },
          { id: 'nav', name: 'Keyboard Landmarks & Focus (WCAG 2.4.7)', progress: 0 },
          { id: 'forms', name: 'Form Labels & Error Prevention (WCAG 3.3.2)', progress: 0 },
          { id: 'contrast', name: 'Color Contrast & Semantics (WCAG 1.4.3)', progress: 0 }
        ]
      },

      // Boundary Line Brawl State
      boundaryBrawl: {
        stage: 'BB_SCRAMBLE', // 'BB_SCRAMBLE' | 'BB_CHALLENGE' | 'BB_PODIUM'
        timeLeft: typeof settings.timeLimit === 'number' && settings.timeLimit > 20 ? settings.timeLimit : 75,
        totalTime: typeof settings.timeLimit === 'number' && settings.timeLimit > 20 ? settings.timeLimit : 75,
        cards: (function() {
          let pool = [...boundaryCardsBank];
          if (selectedDomain !== 'all') {
            const filtered = pool.filter(c => c.domain === parseInt(selectedDomain, 10));
            if (filtered.length > 0) pool = filtered;
          }
          return pool.sort(() => 0.5 - Math.random()).slice(0, Math.min(pool.length, questionCount || 6));
        })(),
        placements: new Map(),
        activeChallenge: null,
        settledChallenges: []
      },

      // Boss Raid State (Mode 8: The Enterprise Boss Raid)
      bossRaid: {
        stage: 'TECH_TREE',
        scenario: bossRaidsBank[0] || null,
        bossHp: bossRaidsBank[0] ? bossRaidsBank[0].maxHp : 500,
        maxBossHp: bossRaidsBank[0] ? bossRaidsBank[0].maxHp : 500,
        teamHp: bossRaidsBank[0] ? bossRaidsBank[0].maxTeamHp : 200,
        maxTeamHp: bossRaidsBank[0] ? bossRaidsBank[0].maxTeamHp : 200,
        shields: bossRaidsBank[0] ? (function() {
          const s = {};
          Object.keys(bossRaidsBank[0].shields).forEach(k => {
            s[k] = { ...bossRaidsBank[0].shields[k], hp: bossRaidsBank[0].shields[k].maxHp };
          });
          return s;
        })() : {},
        completedNodeIds: new Set(),
        activeBuffs: [],
        activeNode: null,
        activeQuestion: null,
        combatSubmissions: new Map(),
        combatTimeLeft: 45,
        turnNumber: 0,
        logs: []
      }
    };

    if (hostParticipates) {
      const hostPlayer = {
        id: socket.id,
        nickname: (settings.hostNickname || 'Host (Player)').trim().slice(0, 18),
        avatar: settings.hostAvatar || '👑',
        score: 0,
        streak: 0,
        answers: {},
        chips: 1000,
        currentWager: 100,
        distance: 0,
        gear: 1,
        inPit: false,
        pitTimeLeft: 0,
        pitTimer: null,
        questionsAnswered: 0,
        answeredQuestionIds: [],
        currentQuestion: null,
        currentGear: 1,
        finished: false,
        finishRank: null,
        ap: 0,
        isSaboteur: false,
        isFrozen: false,
        patchesApplied: 0,
        recentAnswers: [],
        currentSabQuestion: null,
        cardsPlaced: 0,
        challengesInitiated: 0,
        challengesWon: 0,
        damageDealt: 0,
        nodesCompleted: 0
      };
      room.players.set(socket.id, hostPlayer);
      socket.data.isPlayer = true;
    }

    rooms.set(pin, room);
    socket.join(pin);
    socket.data.isHost = true;
    socket.data.roomPin = pin;

    console.log(`Room created: ${pin} (Mode: ${gameMode}, HostPlaying: ${hostParticipates}) by host ${socket.id}`);

    if (hostParticipates) {
      io.to(pin).emit('player-list-update', Array.from(room.players.values()));
    }

    if (callback) {
      callback({
        success: true,
        pin,
        gameMode,
        questionCount: chosenQuestions.length,
        settings: room.settings,
        players: Array.from(room.players.values())
      });
    }
  });

  // ==========================================
  // 2. Player Join
  // ==========================================
  socket.on('join-room', ({ pin, nickname, avatar, userPin }, callback) => {
    const cleanPin = (pin || '').trim().toUpperCase();
    const room = rooms.get(cleanPin);

    if (!room) {
      return callback && callback({ success: false, error: 'Room not found. Check the PIN code!' });
    }

    const cleanNick = (nickname || 'Anonymous Player').trim().slice(0, 18);

    // Finding 2: If nickname is registered in DB, require valid userPin
    const isRegistered = gameStorage.isUserRegistered(cleanNick);
    if (isRegistered && !userPin) {
      return callback && callback({ success: false, error: `Nickname '${cleanNick}' is registered. 4-digit PIN required.` });
    }

    // Option B: Check Passcode verification if userPin provided
    if (userPin) {
      const authResult = gameStorage.registerOrVerifyUser({ nickname: cleanNick, pin: userPin, avatar });
      if (!authResult.success) {
        return callback && callback({ success: false, error: authResult.error });
      }
    }

    // Finding 1: Check if player is reconnecting with an existing session in this active room
    const reconnectedEntry = room.disconnectedPlayers?.get(cleanNick.toLowerCase());
    const isReconnecting = userPin && reconnectedEntry;

    if (room.status !== 'LOBBY' && !isReconnecting) {
      return callback && callback({ success: false, error: 'Game is already in progress!' });
    }

    if (isReconnecting) {
      const restoredPlayer = reconnectedEntry.player;
      restoredPlayer.id = socket.id;
      if (avatar) restoredPlayer.avatar = avatar;

      room.players.set(socket.id, restoredPlayer);
      room.disconnectedPlayers.delete(cleanNick.toLowerCase());

      socket.join(cleanPin);
      socket.data.isPlayer = true;
      socket.data.roomPin = cleanPin;

      console.log(`Player ${cleanNick} reconnected to room ${cleanPin} (Mode: ${room.gameMode})`);

      io.to(cleanPin).emit('player-list-update', Array.from(room.players.values()));

      if (callback) {
        callback({
          success: true,
          pin: cleanPin,
          reconnected: true,
          gameMode: room.gameMode,
          status: room.status,
          player: restoredPlayer,
          players: Array.from(room.players.values())
        });
      }

      // Re-emit active question if in classic mode
      if (room.gameMode === 'CLASSIC' && room.status === 'QUESTION') {
        const q = room.questions[room.currentQuestionIndex];
        if (q) {
          socket.emit('question-started', {
            questionIndex: room.currentQuestionIndex,
            totalQuestions: room.questions.length,
            question: sanitizeQuestionForPlayers(q),
            timeLimit: room.timeLeft,
            answeredCount: room.answersThisRound.size,
            totalPlayers: room.players.size
          });
        }
      } else if (room.gameMode === 'BOSS_RAID' && room.bossRaid) {
        const tree = getSanitizedBossTree(room);
        socket.emit('boss-stage-tech-tree', {
          tree,
          message: 'Reconnected to active Boss Raid!'
        });
        if (room.bossRaid.stage === 'NODE_COMBAT' && room.bossRaid.activeNode && room.bossRaid.activeQuestion) {
          const sanitizedChoices = room.bossRaid.activeQuestion.choices.map(c => ({
            id: c.id,
            text: c.text,
            shape: c.shape
          }));
          socket.emit('boss-node-activated', {
            node: {
              id: room.bossRaid.activeNode.id,
              tier: room.bossRaid.activeNode.tier,
              title: room.bossRaid.activeNode.title,
              damage: room.bossRaid.activeNode.damage,
              buff: room.bossRaid.activeNode.buff,
              branchName: room.bossRaid.activeNode.branchName
            },
            question: {
              stem: room.bossRaid.activeQuestion.stem,
              choices: sanitizedChoices
            },
            timeLeft: room.bossRaid.combatTimeLeft || 45
          });
        }
      }
      return;
    }

    let finalNick = cleanNick;
    let count = 2;
    const existingNicks = Array.from(room.players.values()).map(p => p.nickname.toLowerCase());
    while (existingNicks.includes(finalNick.toLowerCase())) {
      finalNick = `${cleanNick} (${count++})`;
    }

    const player = {
      id: socket.id,
      nickname: finalNick,
      avatar: avatar || '🐱',
      score: 0,
      streak: 0,
      answers: {},
      chips: 1000,
      currentWager: 100,

      // Grand Prix properties
      distance: 0,
      gear: 1,
      inPit: false,
      pitTimeLeft: 0,
      pitTimer: null,
      questionsAnswered: 0,
      answeredQuestionIds: [],
      currentQuestion: null,
      currentGear: 1,
      finished: false,
      finishRank: null,

      // Saboteur properties
      ap: 0,
      isSaboteur: false,
      isFrozen: false,
      patchesApplied: 0,
      recentAnswers: [],
      currentSabQuestion: null,

      // Boundary Brawl properties
      cardsPlaced: 0,
      challengesInitiated: 0,
      challengesWon: 0,

      // Boss Raid properties
      damageDealt: 0,
      nodesCompleted: 0
    };

    room.players.set(socket.id, player);
    socket.join(cleanPin);
    socket.data.isPlayer = true;
    socket.data.roomPin = cleanPin;

    console.log(`Player ${finalNick} joined room ${cleanPin} (${room.gameMode})`);

    if (callback) {
      callback({
        success: true,
        player,
        gameMode: room.gameMode,
        roomSettings: room.settings
      });
    }

    // Broadcast updated player list
    io.to(cleanPin).emit('player-list-update', Array.from(room.players.values()));
  });

  // Change Game Mode (Host switches arcade cabinet in Lobby)
  socket.on('change-game-mode', ({ gameMode }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id || room.status !== 'LOBBY') return;
    room.gameMode = gameMode;
    room.settings.gameMode = gameMode;
    io.to(pin).emit('game-mode-changed', { gameMode });
    console.log(`Host changed room ${pin} game mode to ${gameMode}`);
    if (callback) callback({ success: true, gameMode });
  });

  // ==========================================
  // 3. Start Game (Routes based on Game Mode)
  // ==========================================
  socket.on('start-game', () => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    if (room.gameMode === 'HOT_POTATO') {
      room.currentQuestionIndex = 0;
      room.hotPotato.hotSeatIndex = 0;
      startHotPotatoRound(room);
    } else if (room.gameMode === 'GRAND_PRIX') {
      startGrandPrixRace(room);
    } else if (room.gameMode === 'HIGH_ROLLER') {
      room.currentQuestionIndex = 0;
      room.highRoller.currentQuestionIndex = 0;
      startHighRollerTeaser(room);
    } else if (room.gameMode === 'FLAW_FINDER') {
      room.currentQuestionIndex = 0;
      room.flawFinder.currentScenarioIndex = 0;
      startFlawFinderRound(room);
    } else if (room.gameMode === 'SABOTEUR') {
      startSaboteurGame(room);
    } else if (room.gameMode === 'BOUNDARY_BRAWL') {
      startBoundaryBrawlGame(room);
    } else if (room.gameMode === 'BOSS_RAID') {
      startBossRaidGame(room);
    } else {
      // Classic Mode
      room.currentQuestionIndex = 0;
      startQuestionRound(room);
    }
  });

  // ========================================================
  // ================= CLASSIC MODE ENGINE ==================
  // ========================================================

  function startQuestionRound(room) {
    if (room.timer) clearInterval(room.timer);

    const q = room.questions[room.currentQuestionIndex];
    if (!q) {
      finishGame(room);
      return;
    }

    room.status = 'QUESTION';
    room.answersThisRound.clear();
    room.timeLeft = room.settings.timeLimit;

    io.to(room.pin).emit('question-started', {
      questionIndex: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
      question: sanitizeQuestionForPlayers(q),
      timeLimit: room.settings.timeLimit,
      answeredCount: 0,
      totalPlayers: room.players.size
    });

    if (room.settings.timeLimit > 0) {
      room.timer = setInterval(() => {
        room.timeLeft -= 1;
        io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });

        if (room.timeLeft <= 0) {
          clearInterval(room.timer);
          revealRoundResults(room);
        }
      }, 1000);
    }
  }

  socket.on('submit-answer', ({ choiceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'QUESTION') {
      return callback && callback({ success: false, error: 'Not currently accepting answers' });
    }

    const player = room.players.get(socket.id);
    if (!player) return;
    if (room.answersThisRound.has(socket.id)) {
      return callback && callback({ success: false, error: 'Already answered this round!' });
    }

    const q = room.questions[room.currentQuestionIndex];
    const correctChoice = q.choices.find(c => c.isCorrect);
    const isCorrect = correctChoice && correctChoice.id === choiceId;

    let points = 0;
    if (isCorrect) {
      const timeLimit = room.settings.timeLimit || 20;
      const timeSpentRatio = timeLimit > 0 ? (timeLimit - room.timeLeft) / timeLimit : 0.5;
      const speedScore = Math.round(500 * (1 - (timeSpentRatio / 2)));
      const baseScore = 500;
      const streakBonus = Math.min(player.streak * 50, 250);
      points = baseScore + speedScore + streakBonus;

      player.streak += 1;
      player.score += points;
    } else {
      player.streak = 0;
      gameStorage.recordMissedQuestion({
        nickname: player.nickname,
        questionId: q.id,
        questionText: q.question,
        topic: q.topic,
        domain: q.domain,
        domainName: q.domainName,
        selectedChoiceId: choiceId,
        correctChoiceId: correctChoice ? correctChoice.id : null,
        explanation: q.explanation,
        funNote: q.funNote,
        cpaccRef: q.cpaccRef
      });
    }

    const answerRecord = {
      choiceId,
      isCorrect,
      points,
      streak: player.streak,
      timeRemaining: room.timeLeft
    };

    room.answersThisRound.set(socket.id, answerRecord);
    player.answers[q.id] = answerRecord;

    if (callback) {
      callback({ success: true, recorded: true });
    }

    io.to(room.pin).emit('answer-submitted-count', {
      answeredCount: room.answersThisRound.size,
      totalPlayers: room.players.size
    });

    if (room.answersThisRound.size >= room.players.size && room.players.size > 0) {
      if (room.timer) clearInterval(room.timer);
      revealRoundResults(room);
    }
  });

  function revealRoundResults(room) {
    room.status = 'REVEAL';
    const q = room.questions[room.currentQuestionIndex];
    const correctChoice = q.choices.find(c => c.isCorrect);

    const distribution = { A: 0, B: 0, C: 0, D: 0 };
    for (const ans of room.answersThisRound.values()) {
      if (distribution[ans.choiceId] !== undefined) {
        distribution[ans.choiceId] += 1;
      }
    }

    const rankedPlayers = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        streak: p.streak,
        rank: idx + 1,
        roundPoints: room.answersThisRound.get(p.id)?.points || 0,
        roundCorrect: room.answersThisRound.get(p.id)?.isCorrect || false,
        chosen: room.answersThisRound.get(p.id)?.choiceId || null
      }));

    io.to(room.pin).emit('round-revealed', {
      question: q,
      correctChoiceId: correctChoice ? correctChoice.id : null,
      distribution,
      leaderboard: rankedPlayers
    });
  }

  // ========================================================
  // ============== HOT POTATO SYNDICATE ENGINE =============
  // ========================================================

  function startHotPotatoRound(room) {
    if (room.timer) clearInterval(room.timer);

    const q = room.questions[room.currentQuestionIndex];
    if (!q) {
      finishGame(room);
      return;
    }

    const playerList = Array.from(room.players.values());
    if (playerList.length === 0) return;

    // Determine Hot Seat player
    const activePlayer = playerList[room.hotPotato.hotSeatIndex % playerList.length];
    room.hotPotato.hotSeatPlayer = activePlayer;
    room.hotPotato.delegates = [];
    room.hotPotato.action = null;
    room.hotPotato.submissions.clear();
    room.status = 'HP_TEASER';
    room.timeLeft = 20;

    // Emit Teaser
    io.to(room.pin).emit('hp-teaser', {
      roundIndex: room.currentQuestionIndex,
      totalRounds: room.questions.length,
      activePlayer: {
        id: activePlayer.id,
        nickname: activePlayer.nickname,
        avatar: activePlayer.avatar,
        score: activePlayer.score
      },
      conceptHeader: q.topic || q.domainName,
      domainName: q.domainName,
      baseValue: 100,
      decisionTimeLimit: 20,
      jackpotPot: room.hotPotato.jackpotPot
    });

    // Start 20s Teaser countdown
    room.timer = setInterval(() => {
      room.timeLeft -= 1;
      io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });

      if (room.timeLeft <= 0) {
        clearInterval(room.timer);
        // Default to PASS if active player ran out of time
        handleHotPotatoAction(room, activePlayer.id, 'PASS');
      }
    }, 1000);
  }

  socket.on('hp-choose-action', ({ action }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'HP_TEASER') return;
    if (room.hotPotato.hotSeatPlayer?.id !== socket.id) {
      return callback && callback({ success: false, error: 'Only the active player can choose Take or Pass!' });
    }

    if (room.timer) clearInterval(room.timer);
    handleHotPotatoAction(room, socket.id, action);
    if (callback) callback({ success: true, action });
  });

  function handleHotPotatoAction(room, activePlayerId, action) {
    room.hotPotato.action = action;
    const q = room.questions[room.currentQuestionIndex];

    if (action === 'TAKE') {
      // Active player answers alone
      room.status = 'HP_SOLO';
      room.timeLeft = 30;

      io.to(room.pin).emit('hp-solo-started', {
        activePlayerId,
        question: sanitizeQuestionForPlayers(q),
        timeLimit: 30
      });

      room.timer = setInterval(() => {
        room.timeLeft -= 1;
        io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });
        if (room.timeLeft <= 0) {
          clearInterval(room.timer);
          settleHotPotatoRound(room);
        }
      }, 1000);
    } else {
      // PASS: Draft two delegates from other players
      room.status = 'HP_DELEGATES';
      room.timeLeft = 45;

      const candidates = Array.from(room.players.values()).filter(p => p.id !== activePlayerId);
      const shuffled = [...candidates].sort(() => 0.5 - Math.random());
      const delegateA = shuffled[0] || (room.players.get(activePlayerId) ? room.hotPotato.hotSeatPlayer : null);
      const delegateB = shuffled[1] || null;

      room.hotPotato.delegates = [delegateA, delegateB].filter(Boolean);

      if (room.hotPotato.delegates.length === 0) {
        if (room.timer) clearInterval(room.timer);
        settleHotPotatoRound(room);
        return;
      }

      io.to(room.pin).emit('hp-delegates-drafted', {
        delegateA: { id: delegateA.id, nickname: delegateA.nickname, avatar: delegateA.avatar },
        delegateB: delegateB ? { id: delegateB.id, nickname: delegateB.nickname, avatar: delegateB.avatar } : null,
        question: sanitizeQuestionForPlayers(q),
        timeLimit: 45
      });

      room.timer = setInterval(() => {
        room.timeLeft -= 1;
        io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });
        if (room.timeLeft <= 0) {
          clearInterval(room.timer);
          settleHotPotatoRound(room);
        }
      }, 1000);
    }
  }

  const handleHpSubmitAnswer = (socket, choiceId, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || (room.status !== 'HP_SOLO' && room.status !== 'HP_DELEGATES')) {
      return callback && callback({ success: false, error: 'Not currently accepting Hot Potato answers!' });
    }

    const q = room.questions[room.currentQuestionIndex];
    const correctChoice = q.choices.find(c => c.isCorrect);
    const isCorrect = correctChoice && correctChoice.id === choiceId;

    if (room.status === 'HP_SOLO') {
      if (socket.id !== room.hotPotato.hotSeatPlayer?.id) {
        return callback && callback({ success: false, error: 'Only the active player can answer in Solo mode.' });
      }
      if (room.hotPotato.submissions.has(socket.id)) {
        return callback && callback({ success: false, error: 'You have already submitted an answer!' });
      }
      room.hotPotato.submissions.set(socket.id, { choiceId, isCorrect, submittedAt: room.timeLeft });
      if (callback) callback({ success: true });
      if (room.timer) clearInterval(room.timer);
      settleHotPotatoRound(room);
    } else if (room.status === 'HP_DELEGATES') {
      const isDelegate = room.hotPotato.delegates.some(d => d.id === socket.id);
      if (!isDelegate) {
        return callback && callback({ success: false, error: 'You are not a drafted delegate this round!' });
      }
      if (room.hotPotato.submissions.has(socket.id)) {
        return callback && callback({ success: false, error: 'You have already submitted an answer!' });
      }

      room.hotPotato.submissions.set(socket.id, { choiceId, isCorrect, submittedAt: room.timeLeft });
      if (callback) callback({ success: true });

      // If all delegates submitted, settle immediately
      if (room.hotPotato.submissions.size >= room.hotPotato.delegates.length) {
        if (room.timer) clearInterval(room.timer);
        settleHotPotatoRound(room);
      }
    }
  };

  socket.on('hp-submit-answer', ({ choiceId }, callback) => {
    handleHpSubmitAnswer(socket, choiceId, callback);
  });

  socket.on('hp-submit-delegate-answer', ({ choiceId }, callback) => {
    handleHpSubmitAnswer(socket, choiceId, callback);
  });

  function settleHotPotatoRound(room) {
    room.status = 'HP_SETTLEMENT';
    const q = room.questions[room.currentQuestionIndex];
    const action = room.hotPotato.action;
    const activePlayer = room.players.get(room.hotPotato.hotSeatPlayer?.id) || room.hotPotato.hotSeatPlayer || { id: 'unknown', nickname: 'HotSeat', avatar: '🥔', score: 0 };
    const delegates = room.hotPotato.delegates.map(d => room.players.get(d.id) || d).filter(Boolean);
    const pointDeltas = {};
    const submissions = {};

    for (const [id, sub] of room.hotPotato.submissions.entries()) {
      submissions[id] = sub;
    }

    let outcomeType = '';
    let dividendPerSpectator = 0;

    if (action === 'TAKE') {
      const sub = room.hotPotato.submissions.get(activePlayer.id);
      const isCorrect = sub && sub.isCorrect;
      if (isCorrect) {
        outcomeType = 'SOLO_CORRECT';
        pointDeltas[activePlayer.id] = 100;
        if (activePlayer) activePlayer.score = (activePlayer.score || 0) + 100;
      } else {
        outcomeType = 'SOLO_WRONG';
        const penalty = room.settings.blunderPenalty ? -50 : 0;
        pointDeltas[activePlayer.id] = penalty;
        if (activePlayer) activePlayer.score = Math.max(0, (activePlayer.score || 0) + penalty);
      }
    } else {
      // PASS: Evaluate delegates
      const correctDelegates = delegates.filter(d => room.hotPotato.submissions.get(d.id)?.isCorrect);
      const correctCount = correctDelegates.length;

      if (correctCount >= 2 || (delegates.length === 1 && correctCount === 1)) {
        // Both Correct (Best Case for Active Player)
        outcomeType = 'BOTH_CORRECT';
        pointDeltas[activePlayer.id] = 100;
        if (activePlayer) activePlayer.score = (activePlayer.score || 0) + 100;
        delegates.forEach(d => {
          pointDeltas[d.id] = 50;
          d.score += 50;
        });
      } else if (correctCount === 1 && delegates.length > 1) {
        // Only 1 Correct (Muddled)
        outcomeType = 'ONE_CORRECT';
        pointDeltas[activePlayer.id] = 50;
        if (activePlayer) activePlayer.score = (activePlayer.score || 0) + 50;
        delegates.forEach(d => {
          const correct = room.hotPotato.submissions.get(d.id)?.isCorrect;
          pointDeltas[d.id] = correct ? 50 : 0;
          if (correct) d.score += 50;
        });
      } else {
        // Neither Correct (TOTAL BACKFIRE -> SOCIAL DIVIDEND!)
        outcomeType = 'NEITHER_CORRECT';
        const blunderFee = room.settings.blunderPenalty ? -20 : 0;
        pointDeltas[activePlayer.id] = blunderFee;
        if (activePlayer) activePlayer.score = Math.max(0, (activePlayer.score || 0) + blunderFee);

        delegates.forEach(d => {
          pointDeltas[d.id] = 0;
        });

        // Dividend Payout to Spectators
        const activeAndDelIds = new Set([activePlayer.id, ...delegates.map(d => d.id)]);
        const spectators = Array.from(room.players.values()).filter(p => !activeAndDelIds.has(p.id));

        if (spectators.length > 0) {
          const totalPot = 100 + room.hotPotato.jackpotPot;
          dividendPerSpectator = Math.floor(totalPot / spectators.length);
          spectators.forEach(s => {
            pointDeltas[s.id] = dividendPerSpectator;
            s.score += dividendPerSpectator;
          });
          room.hotPotato.jackpotPot = 0; // cleared pot
        } else {
          // No spectators (room too small): Rollover 100 to jackpot pot
          room.hotPotato.jackpotPot += 100;
        }
      }
    }

    const rankedPlayers = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        rank: idx + 1,
        delta: pointDeltas[p.id] || 0
      }));

    io.to(room.pin).emit('hp-round-settlement', {
      question: q,
      actionTaken: action,
      activePlayer: { id: activePlayer.id, nickname: activePlayer.nickname, avatar: activePlayer.avatar },
      delegates: delegates.map(d => ({ id: d.id, nickname: d.nickname, avatar: d.avatar })),
      submissions,
      outcomeType,
      pointDeltas,
      dividendPerSpectator,
      jackpotPot: room.hotPotato.jackpotPot,
      leaderboard: rankedPlayers
    });
  }

  // ========================================================
  // ============ GRAND PRIX: APEX GAMBLER ENGINE ===========
  // ========================================================

  function startGrandPrixRace(room) {
    room.status = 'GP_RACING';
    room.grandPrix.finishedCount = 0;
    room.grandPrix.podium = [];

    // Reset player distances and stats
    for (const p of room.players.values()) {
      p.distance = 0;
      p.gear = 1;
      p.streak = 0;
      p.inPit = false;
      p.pitTimeLeft = 0;
      if (p.pitTimer) clearInterval(p.pitTimer);
      p.questionsAnswered = 0;
      p.answeredQuestionIds = [];
      p.currentQuestion = null;
      p.finished = false;
      p.finishRank = null;
    }

    io.to(room.pin).emit('gp-race-started', {
      targetDistance: room.settings.targetDistance || 100,
      totalQuestions: room.settings.questionCount || 10,
      hazards: [
        { atMeter: 25, type: 'HAIRPIN', name: 'Hairpin Turn', rule: '3rd Gear Locked' },
        { atMeter: 50, type: 'SLIPSTREAM', name: 'Slipstream Zone', rule: '1.5x Reward within 15m of leader' },
        { atMeter: 80, type: 'FINAL_STRETCH', name: 'Final Straightaway', rule: 'Pit Stop Disabled' }
      ]
    });

    broadcastGrandPrixTelemetry(room, '🚦 The green flag has dropped! Choose your starting Gear!');
  }

  socket.on('gp-select-gear', ({ gear }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'GP_RACING') return;

    const player = room.players.get(socket.id);
    if (!player || player.finished) return;

    if (player.inPit) {
      return callback && callback({ success: false, error: `In Pit Stop! Wait ${player.pitTimeLeft}s` });
    }

    // Check Hairpin Turn (Meter 25 to 35): 3rd Gear is locked
    if (player.distance >= 25 && player.distance < 35 && gear === 3) {
      return callback && callback({ success: false, error: '⚠️ Hairpin Turn! 3rd Gear is locked out (Max 2nd Gear).' });
    }

    const gearNum = Math.min(3, Math.max(1, parseInt(gear, 10) || 1));
    const difficultyTarget = gearNum === 1 ? 'easy' : gearNum === 2 ? 'medium' : 'hard';

    // Find question matching difficulty not yet answered by this player
    let candidateQuestions = room.grandPrix.questionPool.filter(
      q => q.difficulty === difficultyTarget && !player.answeredQuestionIds.includes(q.id)
    );

    // Fallback if difficulty exhausted
    if (candidateQuestions.length === 0) {
      candidateQuestions = room.grandPrix.questionPool.filter(
        q => !player.answeredQuestionIds.includes(q.id)
      );
    }
    // Loop over if all exhausted
    if (candidateQuestions.length === 0) {
      candidateQuestions = room.grandPrix.questionPool;
    }

    const chosenQuestion = candidateQuestions[Math.floor(Math.random() * candidateQuestions.length)];
    player.currentQuestion = chosenQuestion;
    player.currentGear = gearNum;

    if (callback) {
      callback({ success: true, gear: gearNum });
    }

    socket.emit('gp-question-served', {
      question: sanitizeQuestionForPlayers(chosenQuestion),
      gear: gearNum,
      timeLimit: 60,
      allowPitStop: player.distance < 80 // Meter 80+ disables Pit Stop
    });
  });

  socket.on('gp-submit-answer', ({ choiceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'GP_RACING') return;

    const player = room.players.get(socket.id);
    if (!player || player.finished || !player.currentQuestion) return;

    const q = player.currentQuestion;
    const correctChoice = q.choices.find(c => c.isCorrect);
    const isCorrect = correctChoice && correctChoice.id === choiceId;

    // Gear distance matrix:
    // Gear 1: +10 / -10
    // Gear 2: +25 / -25
    // Gear 3: +50 / -50
    const baseReward = player.currentGear === 1 ? 10 : player.currentGear === 2 ? 25 : 50;
    let delta = isCorrect ? baseReward : -baseReward;

    // Slipstream Bonus: at Meter 50+, if within 15m of leader
    const currentLeaderDist = Math.max(...Array.from(room.players.values()).map(p => p.distance));
    let slipstreamTriggered = false;
    if (isCorrect && player.distance >= 50 && (currentLeaderDist - player.distance <= 15) && (currentLeaderDist - player.distance > 0)) {
      delta = Math.round(delta * 1.5);
      slipstreamTriggered = true;
    }

    // Drift Streak: 3 consecutive correct = +10m Drafting Boost
    let driftTriggered = false;
    if (isCorrect) {
      player.streak += 1;
      if (player.streak % 3 === 0) {
        delta += 10;
        driftTriggered = true;
      }
    } else {
      player.streak = 0;
      gameStorage.recordMissedQuestion({
        nickname: player.nickname,
        questionId: q.id,
        questionText: q.question,
        topic: q.topic,
        domain: q.domain,
        domainName: q.domainName,
        selectedChoiceId: choiceId,
        correctChoiceId: correctChoice ? correctChoice.id : null,
        explanation: q.explanation,
        funNote: q.funNote,
        cpaccRef: q.cpaccRef
      });
    }

    player.distance = Math.max(0, player.distance + delta);
    player.questionsAnswered += 1;
    player.answeredQuestionIds.push(q.id);
    player.currentQuestion = null;

    // Build ticker commentary
    let commentary = '';
    if (isCorrect) {
      commentary = `🏎️ ${player.nickname} hit ${player.currentGear}st/nd/rd Gear (+${delta}m)!`;
      if (slipstreamTriggered) commentary += ` 🌪️ Slipstream boost applied!`;
      if (driftTriggered) commentary += ` ⚡ +10m Drift streak boost!`;
    } else {
      commentary = `💥 ${player.nickname} spun out in Gear ${player.currentGear} (${delta}m)!`;
    }

    // Check race completion for this player
    const targetDist = room.settings.targetDistance || 100;
    const maxQ = room.settings.questionCount || 10;
    if (player.distance >= targetDist || player.questionsAnswered >= maxQ) {
      player.finished = true;
      room.grandPrix.finishedCount += 1;
      player.finishRank = room.grandPrix.finishedCount;
      room.grandPrix.podium.push({
        id: player.id,
        nickname: player.nickname,
        avatar: player.avatar,
        distance: player.distance,
        rank: player.finishRank
      });
      commentary = `🏁 ${player.nickname} crossed the finish line in P${player.finishRank}!`;
    }

    if (callback) {
      callback({
        success: true,
        isCorrect,
        delta,
        newDistance: player.distance,
        streak: player.streak,
        explanation: q.explanation,
        funNote: q.funNote,
        correctChoiceId: correctChoice.id,
        finished: player.finished
      });
    }

    broadcastGrandPrixTelemetry(room, commentary);

    // If all players finished or top 3 finished in larger rooms
    if (room.grandPrix.finishedCount >= room.players.size && room.players.size > 0) {
      finishGrandPrixRace(room);
    }
  });

  socket.on('gp-pit-stop', (data, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'GP_RACING') return;

    const player = room.players.get(socket.id);
    if (!player || player.finished) return;

    if (player.distance >= 80) {
      return callback && callback({ success: false, error: 'Pit Lane is closed on the Final Straightaway (80m+)!' });
    }

    // Freeze times: Gear 1 = 5s, Gear 2 = 10s, Gear 3 = 20s
    const freezeTime = player.currentGear === 1 ? 5 : player.currentGear === 2 ? 10 : 20;
    player.inPit = true;
    player.pitTimeLeft = freezeTime;
    player.currentQuestion = null;

    if (player.pitTimer) clearInterval(player.pitTimer);
    player.pitTimer = setInterval(() => {
      player.pitTimeLeft -= 1;
      socket.emit('gp-pit-tick', { pitTimeLeft: player.pitTimeLeft });

      if (player.pitTimeLeft <= 0) {
        clearInterval(player.pitTimer);
        player.inPit = false;
        player.pitTimer = null;
        socket.emit('gp-pit-complete');
        broadcastGrandPrixTelemetry(room, `🔧 ${player.nickname} exited the Pit Lane and is back on track!`);
      }
    }, 1000);

    if (callback) {
      callback({ success: true, freezeTime });
    }

    broadcastGrandPrixTelemetry(room, `🔧 ${player.nickname} pulled into the Pit Lane (Frozen for ${freezeTime}s)!`);
  });

  function broadcastGrandPrixTelemetry(room, commentary = '') {
    const playersList = Array.from(room.players.values())
      .sort((a, b) => b.distance - a.distance)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        distance: p.distance,
        rank: idx + 1,
        gear: p.currentGear,
        streak: p.streak,
        inPit: p.inPit,
        pitTimeLeft: p.pitTimeLeft,
        finished: p.finished,
        questionsAnswered: p.questionsAnswered
      }));

    io.to(room.pin).emit('gp-telemetry-update', {
      players: playersList,
      raceLeaderId: playersList[0]?.id || null,
      commentary,
      allFinished: room.grandPrix.finishedCount >= room.players.size
    });
  }

  function finishGrandPrixRace(room) {
    room.status = 'GP_PODIUM';
    const ranked = Array.from(room.players.values())
      .sort((a, b) => {
        if (a.finishRank && b.finishRank) return a.finishRank - b.finishRank;
        if (a.finishRank) return -1;
        if (b.finishRank) return 1;
        return b.distance - a.distance;
      })
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        distance: p.distance,
        rank: idx + 1,
        questionsAnswered: p.questionsAnswered
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.settings.questionCount || 10
    });

    io.to(room.pin).emit('gp-race-finished', {
      podium: ranked.slice(0, 3),
      allPlayers: ranked
    });
  }

  // ========================================================
  // ============= HIGH-ROLLER GAUNTLET ENGINE ==============
  // ========================================================

  function startHighRollerTeaser(room) {
    if (room.timer) clearInterval(room.timer);

    const q = room.questions[room.currentQuestionIndex];
    if (!q) {
      finishHighRollerGame(room);
      return;
    }

    room.status = 'HR_TEASER';
    room.highRoller.wagers.clear();
    room.highRoller.submissions.clear();
    room.highRoller.underdogTriggered = false;
    room.timeLeft = 15;

    // Ensure players have at least 100 chips to wager
    room.players.forEach(p => {
      if (typeof p.chips !== 'number' || p.chips <= 0) {
        p.chips = 1000;
      }
      p.currentWager = Math.min(p.chips, 100);
    });

    const teaserData = {
      questionIndex: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
      domain: q.domain,
      domainName: q.domainName,
      topic: q.topic || 'Accessibility Concept',
      difficulty: q.difficulty || 'medium',
      timeLimit: 15,
      players: Array.from(room.players.values()).map(p => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        chips: p.chips
      }))
    };

    io.to(room.pin).emit('hr-teaser', teaserData);

    room.timer = setInterval(() => {
      room.timeLeft -= 1;
      io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });

      if (room.timeLeft <= 0) {
        clearInterval(room.timer);
        revealHighRollerQuestion(room);
      }
    }, 1000);
  }

  socket.on('hr-submit-wager', ({ wager }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'HIGH_ROLLER' || room.status !== 'HR_TEASER') return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const maxBet = player.chips || 1000;
    const bet = Math.max(10, Math.min(maxBet, parseInt(wager, 10) || 100));
    player.currentWager = bet;
    room.highRoller.wagers.set(socket.id, bet);

    if (callback) callback({ success: true, wager: bet, remainingChips: player.chips });

    io.to(room.pin).emit('hr-wager-update', {
      playerId: socket.id,
      wagerSubmitted: true,
      totalWagersPlaced: room.highRoller.wagers.size,
      totalPlayers: room.players.size
    });

    // If all players wagered, advance immediately without waiting out the teaser clock
    if (room.highRoller.wagers.size >= room.players.size && room.players.size > 0) {
      if (room.timer) clearInterval(room.timer);
      revealHighRollerQuestion(room);
    }
  });

  function revealHighRollerQuestion(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'HR_QUESTION';

    // Auto-fill default wager for any player who didn't submit
    room.players.forEach(p => {
      if (!room.highRoller.wagers.has(p.id)) {
        const fallbackBet = Math.min(p.chips, 100);
        p.currentWager = fallbackBet;
        room.highRoller.wagers.set(p.id, fallbackBet);
      }
    });

    const q = room.questions[room.currentQuestionIndex];
    const timeLimit = room.settings.timeLimit > 0 ? room.settings.timeLimit : 30;
    room.timeLeft = timeLimit;

    io.to(room.pin).emit('hr-question-started', {
      questionIndex: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
      question: sanitizeQuestionForPlayers(q),
      timeLimit,
      totalPlayers: room.players.size,
      players: Array.from(room.players.values()).map(p => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        chips: p.chips,
        wager: room.highRoller.wagers.get(p.id)
      }))
    });

    if (timeLimit > 0) {
      room.timer = setInterval(() => {
        room.timeLeft -= 1;
        io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });

        if (room.timeLeft <= 0) {
          clearInterval(room.timer);
          settleHighRollerRound(room);
        }
      }, 1000);
    }
  }

  socket.on('hr-submit-answer', ({ choiceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'HIGH_ROLLER' || room.status !== 'HR_QUESTION') return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const q = room.questions[room.currentQuestionIndex];
    const choice = q.choices.find(c => c.id === choiceId);
    const isCorrect = choice ? choice.isCorrect : false;

    room.highRoller.submissions.set(socket.id, {
      choiceId,
      isCorrect,
      submittedAt: Date.now()
    });

    if (callback) callback({ success: true, choiceId });

    io.to(room.pin).emit('answer-submitted-count', {
      answeredCount: room.highRoller.submissions.size,
      totalPlayers: room.players.size
    });

    if (room.highRoller.submissions.size >= room.players.size && room.players.size > 0) {
      if (room.timer) clearInterval(room.timer);
      settleHighRollerRound(room);
    }
  });

  function settleHighRollerRound(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'HR_REVEAL';

    const q = room.questions[room.currentQuestionIndex];
    const correctChoice = q.choices.find(c => c.isCorrect);

    // Distribution
    const distribution = { A: 0, B: 0, C: 0, D: 0 };
    room.highRoller.submissions.forEach(sub => {
      if (distribution[sub.choiceId] !== undefined) {
        distribution[sub.choiceId] += 1;
      }
    });

    // Trap Card Underdog Multiplier:
    // If >= 50% of the room chose a wrong distractor option
    const totalSubs = room.highRoller.submissions.size;
    const correctSubs = Array.from(room.highRoller.submissions.values()).filter(s => s.isCorrect).length;
    const wrongSubs = totalSubs - correctSubs;

    const underdogTriggered = (totalSubs >= 2 && (wrongSubs / totalSubs) >= 0.50);
    room.highRoller.underdogTriggered = underdogTriggered;

    const results = [];
    room.players.forEach(p => {
      const wager = room.highRoller.wagers.get(p.id) || 100;
      const sub = room.highRoller.submissions.get(p.id);
      const isCorrect = sub ? sub.isCorrect : false;

      let chipDelta = 0;
      let bailoutAwarded = false;

      if (isCorrect) {
        chipDelta = underdogTriggered ? Math.round(wager * 1.5) : wager;
        p.chips += chipDelta;
        p.score = p.chips;
      } else {
        chipDelta = -wager;
        p.chips = Math.max(0, p.chips - wager);
        if (p.chips <= 0) {
          p.chips = 250; // Bailout safety loan (250 chips)
          bailoutAwarded = true;
        }
        p.score = p.chips;

        // Log missed question
        gameStorage.recordMissedQuestion({
          nickname: p.nickname,
          questionId: q.id,
          questionText: q.question,
          topic: q.topic,
          domain: q.domain,
          domainName: q.domainName,
          selectedChoiceId: sub ? sub.choiceId : 'NONE',
          correctChoiceId: correctChoice?.id,
          explanation: q.explanation,
          funNote: q.funNote,
          cpaccRef: q.cpaccRef
        });
      }

      results.push({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        wager,
        isCorrect,
        choiceId: sub?.choiceId || null,
        chipDelta,
        chips: p.chips,
        bailoutAwarded
      });
    });

    const ranked = Array.from(room.players.values())
      .sort((a, b) => b.chips - a.chips)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        chips: p.chips,
        score: p.chips,
        rank: idx + 1
      }));

    io.to(room.pin).emit('hr-round-settlement', {
      question: q,
      correctChoiceId: correctChoice?.id,
      underdogTriggered,
      distribution,
      results,
      leaderboard: ranked,
      isLastQuestion: room.currentQuestionIndex >= room.questions.length - 1
    });
  }

  function finishHighRollerGame(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'HR_PODIUM';

    const ranked = Array.from(room.players.values())
      .sort((a, b) => b.chips - a.chips)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.chips,
        chips: p.chips,
        rank: idx + 1
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.questions.length
    });

    io.to(room.pin).emit('hr-game-finished', {
      podium: ranked.slice(0, 3),
      allPlayers: ranked
    });
  }

  // ========================================================
  // ============== FLAW FINDER ENGINE (HEATMAP) ============
  // ========================================================

  function startFlawFinderRound(room) {
    if (room.timer) clearInterval(room.timer);

    const s = room.flawFinder.scenarios[room.flawFinder.currentScenarioIndex];
    if (!s) {
      finishFlawFinderGame(room);
      return;
    }

    room.status = 'FF_SNIPING';
    room.flawFinder.stage = 'FF_SNIPING';
    room.flawFinder.submissions.clear();
    const timeLimit = room.settings.timeLimit > 0 ? room.settings.timeLimit : 30;
    room.timeLeft = timeLimit;

    // Sanitize scenario to hide isFlaw & explanation
    const sanitized = {
      id: s.id,
      title: s.title,
      domain: s.domain,
      domainName: s.domainName,
      topic: s.topic,
      context: s.context,
      sentences: s.sentences.map(sent => ({
        id: sent.id,
        text: sent.text
      }))
    };

    io.to(room.pin).emit('ff-round-started', {
      scenarioIndex: room.flawFinder.currentScenarioIndex,
      totalScenarios: room.flawFinder.scenarios.length,
      scenario: sanitized,
      timeLimit,
      totalPlayers: room.players.size,
      snipesLocked: 0
    });

    if (timeLimit > 0) {
      room.timer = setInterval(() => {
        room.timeLeft -= 1;
        io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });

        if (room.timeLeft <= 0) {
          clearInterval(room.timer);
          revealFlawFinderHeatmap(room);
        }
      }, 1000);
    }
  }

  socket.on('ff-submit-snipe', ({ sentenceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'FLAW_FINDER' || room.status !== 'FF_SNIPING') return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const s = room.flawFinder.scenarios[room.flawFinder.currentScenarioIndex];
    if (!s) return;

    const targetSentence = s.sentences.find(sent => sent.id === sentenceId);
    if (!targetSentence) {
      return callback && callback({ success: false, error: 'Invalid sentence ID' });
    }

    const isFlaw = !!targetSentence.isFlaw;
    room.flawFinder.submissions.set(socket.id, {
      sentenceId,
      isFlaw,
      timeRemaining: room.timeLeft
    });

    if (callback) {
      callback({ success: true, sentenceId, isFlaw });
    }

    io.to(room.pin).emit('ff-snipe-count', {
      snipesLocked: room.flawFinder.submissions.size,
      totalPlayers: room.players.size
    });

    // Advance when all players locked in
    if (room.flawFinder.submissions.size >= room.players.size && room.players.size > 0) {
      if (room.timer) clearInterval(room.timer);
      revealFlawFinderHeatmap(room);
    }
  });

  function revealFlawFinderHeatmap(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'FF_HEATMAP';
    room.flawFinder.stage = 'FF_HEATMAP';

    const s = room.flawFinder.scenarios[room.flawFinder.currentScenarioIndex];
    const totalSubmissions = room.flawFinder.submissions.size;
    const correctCount = Array.from(room.flawFinder.submissions.values()).filter(sub => sub.isFlaw).length;

    // Deadshot Bonus: if <= 40% of the room correctly spotted the flaw (and room has >= 2 players)
    const deadshotTriggered = totalSubmissions >= 2 && (correctCount / totalSubmissions) <= 0.40;

    // Compute sentence heatmap votes and percentages
    const sentenceVotes = {};
    s.sentences.forEach(sent => {
      sentenceVotes[sent.id] = 0;
    });
    room.flawFinder.submissions.forEach(sub => {
      if (sentenceVotes[sub.sentenceId] !== undefined) {
        sentenceVotes[sub.sentenceId] += 1;
      }
    });

    const heatmap = s.sentences.map(sent => {
      const votes = sentenceVotes[sent.id] || 0;
      const percentage = totalSubmissions > 0 ? Math.round((votes / totalSubmissions) * 100) : 0;
      return {
        id: sent.id,
        text: sent.text,
        isFlaw: sent.isFlaw,
        explanation: sent.explanation,
        votes,
        percentage
      };
    });

    // Settle points and record missed questions
    const results = [];
    room.players.forEach(p => {
      const sub = room.flawFinder.submissions.get(p.id);
      const isCorrect = sub ? sub.isFlaw : false;
      const targetedId = sub ? sub.sentenceId : null;

      let roundPoints = 0;
      if (isCorrect) {
        roundPoints = deadshotTriggered ? 300 : 200;
        p.score += roundPoints;
        p.streak += 1;
      } else {
        p.streak = 0;
        // Log missed question / scenario
        const flawSentence = s.sentences.find(sent => sent.isFlaw);
        gameStorage.recordMissedQuestion({
          nickname: p.nickname,
          questionId: `${s.id}-${s.domain}`,
          questionText: s.title + ': ' + s.context,
          topic: s.topic,
          domain: s.domain,
          domainName: s.domainName,
          selectedChoiceId: targetedId || 'TIMEOUT',
          correctChoiceId: flawSentence?.id,
          explanation: s.flawSummary,
          funNote: `Targeted Sentence: "${s.sentences.find(sent => sent.id === targetedId)?.text.slice(0, 50) || 'None'}..."`,
          cpaccRef: s.cpaccRef
        });
      }

      results.push({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        targetedId,
        isCorrect,
        roundPoints,
        totalScore: p.score,
        deadshotAwarded: isCorrect && deadshotTriggered
      });
    });

    const rankedPlayers = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        streak: p.streak,
        rank: idx + 1
      }));

    io.to(room.pin).emit('ff-heatmap-reveal', {
      scenario: s,
      flawedSentenceId: s.sentences.find(sent => sent.isFlaw)?.id,
      heatmap,
      deadshotTriggered,
      results,
      leaderboard: rankedPlayers,
      isLastScenario: room.flawFinder.currentScenarioIndex >= room.flawFinder.scenarios.length - 1
    });
  }

  function finishFlawFinderGame(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'FF_PODIUM';

    const ranked = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        rank: idx + 1
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.flawFinder.scenarios.length
    });

    io.to(room.pin).emit('ff-game-finished', {
      podium: ranked.slice(0, 3),
      allPlayers: ranked
    });
  }

  // ========================================================
  // ========= SABOTEUR IN THE SERVER ROOM ENGINE ===========
  // ========================================================

  function getSaboteurPublicTelemetry(room) {
    return {
      compliancePercent: room.saboteur.compliancePercent,
      serverTimeLeft: room.saboteur.serverTimeLeft,
      totalTime: room.saboteur.totalTime,
      subsystems: room.saboteur.subsystems,
      terminalLogs: room.saboteur.terminalLogs.slice(-10),
      players: Array.from(room.players.values()).map(p => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        patchesApplied: p.patchesApplied,
        isFrozen: p.isFrozen
      }))
    };
  }

  function startSaboteurGame(room) {
    if (room.timer) clearInterval(room.timer);

    const playerList = Array.from(room.players.values());
    if (playerList.length === 0) return;

    // Secret role assignment: exactly 1 Saboteur
    const sabIndex = Math.floor(Math.random() * playerList.length);
    const sabPlayer = playerList[sabIndex];
    room.saboteur.saboteurId = sabPlayer.id;

    room.players.forEach(p => {
      p.isSaboteur = (p.id === sabPlayer.id);
      p.ap = 0;
      p.isFrozen = false;
      p.patchesApplied = 0;
      p.recentAnswers = [];
      p.currentSabQuestion = null;

      io.to(p.id).emit('sab-role-assigned', {
        isSaboteur: p.isSaboteur,
        saboteurName: p.isSaboteur ? p.nickname : null
      });
    });

    room.status = 'SAB_DRILL';
    room.saboteur.compliancePercent = 0;
    room.saboteur.serverTimeLeft = room.settings.timeLimit > 30 ? room.settings.timeLimit : 180;
    room.saboteur.totalTime = room.saboteur.serverTimeLeft;
    room.saboteur.terminalLogs = [
      { text: '🖥️ System Boot: Corporate Accessibility Subsystems Online.', type: 'info', timestamp: Date.now() },
      { text: '⚠️ Threat Warning: Saboteur detected on internal network.', type: 'alarm', timestamp: Date.now() }
    ];

    io.to(room.pin).emit('sab-game-started', getSaboteurPublicTelemetry(room));

    // Master server countdown clock
    room.timer = setInterval(() => {
      if (room.status === 'SAB_STANDUP') return; // Standup has its own timer

      room.saboteur.serverTimeLeft -= 1;
      io.to(room.pin).emit('sab-timer-tick', {
        timeLeft: room.saboteur.serverTimeLeft,
        compliancePercent: room.saboteur.compliancePercent
      });

      if (room.saboteur.serverTimeLeft <= 0) {
        clearInterval(room.timer);
        finishSaboteurGame(room, 'SABOTEUR_TIMEOUT', 'The server deadline expired before 100% compliance was reached! The Saboteur wins.');
      }
    }, 1000);
  }

  socket.on('sab-request-question', (callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'SABOTEUR' || room.status !== 'SAB_DRILL') return;

    const player = room.players.get(socket.id);
    if (!player || player.isFrozen) return;

    const pool = room.saboteur.questionPool || questionBank;
    const randomQ = pool[Math.floor(Math.random() * pool.length)];
    player.currentSabQuestion = randomQ;

    const apReward = randomQ.difficulty === 'hard' ? 3 : randomQ.difficulty === 'medium' ? 2 : 1;

    const payload = {
      question: sanitizeQuestionForPlayers(randomQ),
      apReward,
      currentAP: player.ap
    };

    if (callback) callback(payload);
    socket.emit('sab-question-served', payload);
  });

  socket.on('sab-submit-answer', ({ choiceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'SABOTEUR' || room.status !== 'SAB_DRILL') return;

    const player = room.players.get(socket.id);
    if (!player || player.isFrozen || !player.currentSabQuestion) return;

    const q = player.currentSabQuestion;
    const correctChoice = q.choices.find(c => c.isCorrect);
    const isCorrect = (correctChoice && correctChoice.id === choiceId);

    const apReward = q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1;
    const points = q.difficulty === 'hard' ? 250 : q.difficulty === 'medium' ? 150 : 100;

    if (isCorrect) {
      player.ap += apReward;
      player.score += points;
      player.streak += 1;
    } else {
      player.streak = 0;
    }

    player.recentAnswers.push({ isCorrect, timestamp: Date.now() });
    if (player.recentAnswers.length > 5) player.recentAnswers.shift();
    player.currentSabQuestion = null;

    const res = {
      success: true,
      isCorrect,
      correctChoiceId: correctChoice?.id,
      explanation: q.explanation,
      apEarned: isCorrect ? apReward : 0,
      currentAP: player.ap,
      score: player.score
    };

    if (callback) callback(res);
  });

  socket.on('sab-apply-patch', ({ subsystemId, isSabotage }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'SABOTEUR' || room.status !== 'SAB_DRILL') return;

    const player = room.players.get(socket.id);
    if (!player || player.isFrozen) return;

    if (player.ap < 2) {
      return callback && callback({ success: false, error: 'Insufficient AP! Need 2 AP to apply a patch.' });
    }

    player.ap -= 2;
    const subsystem = room.saboteur.subsystems.find(s => s.id === subsystemId) || room.saboteur.subsystems[0];

    if (isSabotage && player.isSaboteur) {
      // Sabotage Glitch Exploit
      room.saboteur.compliancePercent = Math.max(0, room.saboteur.compliancePercent - 5);
      if (subsystem) subsystem.progress = Math.max(0, subsystem.progress - 5);

      room.saboteur.terminalLogs.push({
        text: `⚠️ [INTEGRITY CORRUPTED] Critical glitch injected into ${subsystem?.name || 'Subsystem'} (-5% Compliance)`,
        type: 'glitch',
        timestamp: Date.now()
      });

      if (callback) callback({ success: true, action: 'SABOTAGE', remainingAP: player.ap });
    } else {
      // Legitimate Patch
      player.patchesApplied += 1;
      player.score += 75;
      room.saboteur.compliancePercent = Math.min(100, room.saboteur.compliancePercent + 5);
      if (subsystem) subsystem.progress = Math.min(100, subsystem.progress + 20);

      room.saboteur.terminalLogs.push({
        text: `✓ ${player.nickname} patched ${subsystem?.name || 'Subsystem'} (+5% Compliance)`,
        type: 'patch',
        timestamp: Date.now()
      });

      if (callback) callback({ success: true, action: 'PATCH', remainingAP: player.ap });
    }

    io.to(room.pin).emit('sab-telemetry-update', getSaboteurPublicTelemetry(room));

    // Check 100% compliance win condition
    if (room.saboteur.compliancePercent >= 100) {
      finishSaboteurGame(room, 'AUDITORS_COMPLIANCE', '100% Subsystem Compliance Achieved! The Auditors secured the infrastructure!');
    }
  });

  socket.on('sab-run-audit-ping', ({ targetPlayerId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'SABOTEUR' || room.status !== 'SAB_DRILL') return;

    const player = room.players.get(socket.id);
    if (!player || player.isFrozen) return;

    if (player.ap < 3) {
      return callback && callback({ success: false, error: 'Insufficient AP! Need 3 AP to run Audit Ping.' });
    }

    const target = room.players.get(targetPlayerId);
    if (!target) {
      return callback && callback({ success: false, error: 'Target player not found.' });
    }

    player.ap -= 3;
    const recent = target.recentAnswers || [];
    const correctCount = recent.filter(a => a.isCorrect).length;
    const accuracy = recent.length > 0 ? Math.round((correctCount / recent.length) * 100) : 100;

    let suspicion = 'LOW';
    if (recent.length >= 2) {
      if (accuracy <= 33) suspicion = 'HIGH';
      else if (accuracy <= 66) suspicion = 'MEDIUM';
    }

    room.saboteur.terminalLogs.push({
      text: `📡 Audit Ping pinged ${target.nickname}: Accuracy Log ${accuracy}% (${suspicion} Suspicion)`,
      type: 'audit',
      timestamp: Date.now()
    });

    if (callback) {
      callback({
        success: true,
        targetNickname: target.nickname,
        targetAvatar: target.avatar,
        answersCount: recent.length,
        accuracy,
        suspicion,
        remainingAP: player.ap
      });
    }

    io.to(room.pin).emit('sab-telemetry-update', getSaboteurPublicTelemetry(room));
  });

  socket.on('sab-call-standup', (callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'SABOTEUR' || room.status !== 'SAB_DRILL') return;

    const player = room.players.get(socket.id);
    if (!player || player.isFrozen) return;

    if (player.ap < 4) {
      return callback && callback({ success: false, error: 'Insufficient AP! Need 4 AP to call Emergency Standup.' });
    }

    player.ap -= 4;
    room.status = 'SAB_STANDUP';

    room.saboteur.activeStandup = {
      initiatorId: player.id,
      initiatorNickname: player.nickname,
      timeLeft: 45,
      votes: new Map()
    };

    room.saboteur.terminalLogs.push({
      text: `🚨 ${player.nickname} TRIGGERED AN EMERGENCY COMPLIANCE STANDUP!`,
      type: 'alarm',
      timestamp: Date.now()
    });

    io.to(room.pin).emit('sab-emergency-standup', {
      initiatorNickname: player.nickname,
      timeLeft: 45,
      players: Array.from(room.players.values()).filter(p => !p.isFrozen).map(p => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        patchesApplied: p.patchesApplied
      }))
    });

    if (callback) callback({ success: true, remainingAP: player.ap });

    // Standup 45s countdown timer
    if (room.saboteur.standupTimer) clearInterval(room.saboteur.standupTimer);
    room.saboteur.standupTimer = setInterval(() => {
      if (!room.saboteur.activeStandup) {
        clearInterval(room.saboteur.standupTimer);
        return;
      }

      room.saboteur.activeStandup.timeLeft -= 1;
      io.to(room.pin).emit('sab-standup-tick', { timeLeft: room.saboteur.activeStandup.timeLeft });

      if (room.saboteur.activeStandup.timeLeft <= 0) {
        clearInterval(room.saboteur.standupTimer);
        settleEmergencyStandup(room);
      }
    }, 1000);
  });

  socket.on('sab-cast-vote', ({ suspectId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'SAB_STANDUP' || !room.saboteur.activeStandup) return;

    const player = room.players.get(socket.id);
    if (!player || player.isFrozen) return;

    room.saboteur.activeStandup.votes.set(socket.id, suspectId);
    if (callback) callback({ success: true });

    io.to(room.pin).emit('sab-standup-vote-update', {
      votesCast: room.saboteur.activeStandup.votes.size,
      totalVoters: Array.from(room.players.values()).filter(p => !p.isFrozen).length
    });

    // Check if all non-frozen players have voted
    const activeCount = Array.from(room.players.values()).filter(p => !p.isFrozen).length;
    if (room.saboteur.activeStandup.votes.size >= activeCount) {
      settleEmergencyStandup(room);
    }
  });

  function settleEmergencyStandup(room) {
    if (room.saboteur.standupTimer) clearInterval(room.saboteur.standupTimer);
    if (!room.saboteur.activeStandup) return;

    const votes = room.saboteur.activeStandup.votes;
    const voteCounts = {};
    votes.forEach(suspectId => {
      if (suspectId && suspectId !== 'SKIP') {
        voteCounts[suspectId] = (voteCounts[suspectId] || 0) + 1;
      }
    });

    let topSuspectId = null;
    let maxVotes = 0;
    let isTie = false;

    Object.entries(voteCounts).forEach(([suspectId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        topSuspectId = suspectId;
        isTie = false;
      } else if (count === maxVotes) {
        isTie = true;
      }
    });

    const ejectedPlayer = (!isTie && topSuspectId) ? room.players.get(topSuspectId) : null;

    if (ejectedPlayer) {
      ejectedPlayer.isFrozen = true;
      const wasSaboteur = !!ejectedPlayer.isSaboteur;

      if (wasSaboteur) {
        finishSaboteurGame(room, 'AUDITORS_VOTED_SABOTEUR', `The Auditors successfully identified and ejected the Saboteur (${ejectedPlayer.nickname})!`);
        return;
      } else {
        room.saboteur.terminalLogs.push({
          text: `❌ ${ejectedPlayer.nickname} was ejected, but was an INNOCENT AUDITOR!`,
          type: 'alarm',
          timestamp: Date.now()
        });

        io.to(room.pin).emit('sab-standup-settled', {
          ejectedNickname: ejectedPlayer.nickname,
          ejectedAvatar: ejectedPlayer.avatar,
          wasSaboteur: false,
          message: `${ejectedPlayer.nickname} was ejected, but was an innocent compliance auditor! The Saboteur remains active.`
        });
      }
    } else {
      io.to(room.pin).emit('sab-standup-settled', {
        ejectedNickname: null,
        wasSaboteur: false,
        message: 'No consensus reached. No player was ejected from the server room.'
      });
    }

    room.saboteur.activeStandup = null;
    room.status = 'SAB_DRILL';

    setTimeout(() => {
      if (room.status === 'SAB_DRILL') {
        io.to(room.pin).emit('sab-resume-drill', getSaboteurPublicTelemetry(room));
      }
    }, 4000);
  }

  function finishSaboteurGame(room, outcome, reason) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'SAB_PODIUM';

    const sabPlayer = Array.from(room.players.values()).find(p => p.isSaboteur);

    const ranked = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        patchesApplied: p.patchesApplied,
        isSaboteur: p.isSaboteur,
        rank: idx + 1
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.saboteur.compliancePercent
    });

    io.to(room.pin).emit('sab-game-finished', {
      outcome,
      reason,
      saboteurNickname: sabPlayer?.nickname,
      saboteurAvatar: sabPlayer?.avatar,
      allPlayers: ranked
    });
  }

  // ========================================================
  // ========= THE BOUNDARY LINE BRAWL ENGINE ===============
  // ========================================================

  function startBoundaryBrawlGame(room) {
    if (room.timer) clearInterval(room.timer);

    room.status = 'BB_SCRAMBLE';
    room.boundaryBrawl.stage = 'BB_SCRAMBLE';
    room.boundaryBrawl.timeLeft = typeof room.settings.timeLimit === 'number' && room.settings.timeLimit > 20
      ? room.settings.timeLimit
      : 75;

    const sanitizedCards = room.boundaryBrawl.cards.map(c => ({
      id: c.id,
      title: c.title,
      domain: c.domain,
      domainName: c.domainName,
      description: c.description
    }));

    io.to(room.pin).emit('bb-game-started', {
      cards: sanitizedCards,
      placements: Array.from(room.boundaryBrawl.placements.values()),
      timeLeft: room.boundaryBrawl.timeLeft,
      totalTime: room.boundaryBrawl.totalTime
    });

    room.timer = setInterval(() => {
      room.boundaryBrawl.timeLeft -= 1;
      io.to(room.pin).emit('bb-timer-tick', { timeLeft: room.boundaryBrawl.timeLeft });

      if (room.boundaryBrawl.timeLeft <= 0) {
        clearInterval(room.timer);
        transitionToBoundaryChallengeStage(room);
      }
    }, 1000);
  }

  function transitionToBoundaryChallengeStage(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'BB_CHALLENGE';
    room.boundaryBrawl.stage = 'BB_CHALLENGE';

    io.to(room.pin).emit('bb-scramble-ended', {
      placements: Array.from(room.boundaryBrawl.placements.values()),
      message: 'Placement scramble concluded! The Brawl begins. Slap a Challenge on any card to start a CPACC debate!'
    });
  }

  socket.on('bb-place-card', ({ cardId, quadrant, x, y }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'BOUNDARY_BRAWL') return;

    if (room.boundaryBrawl.activeChallenge && room.boundaryBrawl.activeChallenge.cardId === cardId) {
      return callback && callback({ success: false, error: 'Card is currently locked in an active challenge debate!' });
    }

    const player = room.players.get(socket.id);
    if (!player) return;

    const card = room.boundaryBrawl.cards.find(c => c.id === cardId) || boundaryCardsBank.find(c => c.id === cardId);
    if (!card) return;

    const clampedX = typeof x === 'number' ? Math.max(5, Math.min(95, Math.round(x))) : 50;
    const clampedY = typeof y === 'number' ? Math.max(5, Math.min(95, Math.round(y))) : 50;

    const isFirstPlacement = !room.boundaryBrawl.placements.has(cardId);
    if (isFirstPlacement) {
      player.cardsPlaced = (player.cardsPlaced || 0) + 1;
      player.score += 50; // Placement reward
    }

    const placement = {
      cardId,
      title: card.title,
      description: card.description,
      domain: card.domain,
      domainName: card.domainName,
      quadrant: quadrant || 'Q1',
      x: clampedX,
      y: clampedY,
      placedBy: {
        id: player.id,
        nickname: player.nickname,
        avatar: player.avatar
      },
      isVerified: false,
      timestamp: Date.now()
    };

    room.boundaryBrawl.placements.set(cardId, placement);

    io.to(room.pin).emit('bb-card-moved', {
      placement,
      placements: Array.from(room.boundaryBrawl.placements.values()),
      playerScores: Array.from(room.players.values()).map(p => ({ id: p.id, nickname: p.nickname, score: p.score }))
    });

    if (callback) callback({ success: true, placement });
  });

  socket.on('bb-challenge-card', ({ cardId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'BOUNDARY_BRAWL') return;

    if (room.boundaryBrawl.activeChallenge) {
      return callback && callback({ success: false, error: 'A debate challenge is already active in the arena!' });
    }

    const placement = room.boundaryBrawl.placements.get(cardId);
    if (!placement) {
      return callback && callback({ success: false, error: 'This card has not been placed on the matrix yet!' });
    }

    const challenger = room.players.get(socket.id);
    if (!challenger) return;

    if (placement.placedBy.id === challenger.id) {
      return callback && callback({ success: false, error: 'You cannot challenge your own card placement!' });
    }

    const card = room.boundaryBrawl.cards.find(c => c.id === cardId) || boundaryCardsBank.find(c => c.id === cardId);
    if (!card) return;

    challenger.challengesInitiated = (challenger.challengesInitiated || 0) + 1;

    const challenge = {
      cardId,
      cardTitle: card.title,
      cardDescription: card.description,
      currentQuadrant: placement.quadrant,
      challenger: {
        id: challenger.id,
        nickname: challenger.nickname,
        avatar: challenger.avatar
      },
      defender: placement.placedBy,
      thumbsUp: new Set(),   // Defend placement
      thumbsDown: new Set(), // Overthrow placement
      timeLeft: 20
    };

    room.boundaryBrawl.activeChallenge = challenge;

    io.to(room.pin).emit('bb-challenge-started', {
      challenge: {
        cardId: challenge.cardId,
        cardTitle: challenge.cardTitle,
        cardDescription: challenge.cardDescription,
        currentQuadrant: challenge.currentQuadrant,
        challenger: challenge.challenger,
        defender: challenge.defender,
        timeLeft: 20,
        thumbsUpCount: 0,
        thumbsDownCount: 0
      }
    });

    if (callback) callback({ success: true });

    challenge.timer = setInterval(() => {
      challenge.timeLeft -= 1;
      io.to(room.pin).emit('bb-challenge-tick', { timeLeft: challenge.timeLeft });

      if (challenge.timeLeft <= 0) {
        clearInterval(challenge.timer);
        settleBoundaryChallenge(room);
      }
    }, 1000);
  });

  socket.on('bb-cast-emoji-vote', ({ vote }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'BOUNDARY_BRAWL') return;

    const challenge = room.boundaryBrawl.activeChallenge;
    if (!challenge) {
      return callback && callback({ success: false, error: 'No active challenge debate right now.' });
    }

    if (vote === 'UP') {
      challenge.thumbsUp.add(socket.id);
      challenge.thumbsDown.delete(socket.id);
    } else if (vote === 'DOWN') {
      challenge.thumbsDown.add(socket.id);
      challenge.thumbsUp.delete(socket.id);
    }

    io.to(room.pin).emit('bb-vote-update', {
      thumbsUpCount: challenge.thumbsUp.size,
      thumbsDownCount: challenge.thumbsDown.size
    });

    if (callback) callback({ success: true, vote });
  });

  function settleBoundaryChallenge(room) {
    const challenge = room.boundaryBrawl.activeChallenge;
    if (!challenge) return;

    const card = room.boundaryBrawl.cards.find(c => c.id === challenge.cardId) || boundaryCardsBank.find(c => c.id === challenge.cardId);
    const placement = room.boundaryBrawl.placements.get(challenge.cardId);

    const upCount = challenge.thumbsUp.size;
    const downCount = challenge.thumbsDown.size;
    const roomOverthrew = downCount > upCount;

    if (roomOverthrew) {
      const challengerPlayer = room.players.get(challenge.challenger.id);
      if (challengerPlayer) {
        challengerPlayer.score += 150;
        challengerPlayer.challengesWon = (challengerPlayer.challengesWon || 0) + 1;
      }
      for (const vid of challenge.thumbsDown) {
        const v = room.players.get(vid);
        if (v) v.score += 50;
      }

      if (placement && card) {
        placement.quadrant = card.quadrant;
        placement.x = card.xPlacement;
        placement.y = card.yPlacement;
        placement.isVerified = true;
        placement.placedBy = challenge.challenger; // Claimed by challenger!
      }
    } else {
      const defenderPlayer = room.players.get(challenge.defender.id);
      if (defenderPlayer) {
        defenderPlayer.score += 200;
      }
      for (const vid of challenge.thumbsUp) {
        const v = room.players.get(vid);
        if (v) v.score += 50;
      }
      if (placement) {
        placement.isVerified = true;
      }
    }

    io.to(room.pin).emit('bb-challenge-settled', {
      winner: roomOverthrew ? 'CHALLENGER' : 'DEFENDER',
      cardId: challenge.cardId,
      cardTitle: challenge.cardTitle,
      challenger: challenge.challenger,
      defender: challenge.defender,
      thumbsUpCount: upCount,
      thumbsDownCount: downCount,
      correctQuadrant: card?.quadrant,
      correctQuadrantName: card?.quadrantName,
      officialX: card?.xPlacement,
      officialY: card?.yPlacement,
      rationale: card?.rationale,
      cpaccRef: card?.cpaccRef,
      updatedPlacements: Array.from(room.boundaryBrawl.placements.values()),
      playerScores: Array.from(room.players.values()).map(p => ({ id: p.id, nickname: p.nickname, score: p.score }))
    });

    room.boundaryBrawl.settledChallenges.push({
      cardId: challenge.cardId,
      winner: roomOverthrew ? 'CHALLENGER' : 'DEFENDER',
      timestamp: Date.now()
    });

    room.boundaryBrawl.activeChallenge = null;
  }

  function finishBoundaryBrawlGame(room) {
    if (room.timer) clearInterval(room.timer);
    if (room.boundaryBrawl.activeChallenge?.timer) {
      clearInterval(room.boundaryBrawl.activeChallenge.timer);
    }
    room.status = 'BB_PODIUM';
    room.boundaryBrawl.stage = 'BB_PODIUM';

    const ranked = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        cardsPlaced: p.cardsPlaced || 0,
        challengesWon: p.challengesWon || 0,
        rank: idx + 1
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.boundaryBrawl.cards.length
    });

    io.to(room.pin).emit('bb-game-finished', {
      podium: ranked.slice(0, 3),
      allPlayers: ranked,
      finalPlacements: Array.from(room.boundaryBrawl.placements.values())
    });
  }

  // ========================================================
  // ============ THE ENTERPRISE BOSS RAID ENGINE ===========
  // ========================================================

  function getSanitizedBossTree(room) {
    const br = room.bossRaid;
    const scenario = br.scenario;
    if (!scenario) return null;

    const allShieldsBroken = Object.values(br.shields).every(s => s.hp <= 0);

    const branches = scenario.branches.map(b => {
      const targetShield = br.shields[b.shieldTarget];
      return {
        id: b.id,
        name: b.name,
        domain: b.domain,
        color: b.color,
        shieldTarget: b.shieldTarget,
        shieldHp: targetShield ? targetShield.hp : 0,
        shieldMaxHp: targetShield ? targetShield.maxHp : 100,
        nodes: b.nodes.map(n => {
          const isCompleted = br.completedNodeIds.has(n.id);
          let isAvailable = !isCompleted;
          if (n.tier > 1) {
            const prevNode = b.nodes.find(pn => pn.tier === n.tier - 1);
            if (prevNode && !br.completedNodeIds.has(prevNode.id)) {
              isAvailable = false;
            }
          }
          return {
            id: n.id,
            tier: n.tier,
            title: n.title,
            concept: n.concept,
            damage: n.damage,
            buff: n.buff,
            isCompleted,
            isAvailable
          };
        })
      };
    });

    return {
      name: scenario.name,
      title: scenario.title,
      avatar: scenario.avatar,
      description: scenario.description,
      bossHp: br.bossHp,
      maxBossHp: br.maxBossHp,
      teamHp: br.teamHp,
      maxTeamHp: br.maxTeamHp,
      shields: br.shields,
      allShieldsBroken,
      branches,
      activeBuffs: br.activeBuffs,
      stage: br.stage,
      capstoneUnlocked: allShieldsBroken,
      capstone: allShieldsBroken ? {
        id: scenario.capstone.id,
        title: scenario.capstone.title,
        damage: scenario.capstone.damage
      } : null
    };
  }

  function startBossRaidGame(room) {
    if (room.timer) clearInterval(room.timer);

    room.status = 'BOSS_TECH_TREE';
    room.bossRaid.stage = 'TECH_TREE';

    io.to(room.pin).emit('boss-game-started', {
      tree: getSanitizedBossTree(room),
      message: 'The Enterprise Boss Raid has begun! Select an available node to begin dismantling the Monolith.'
    });
  }

  function transitionToBossTechTree(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'BOSS_TECH_TREE';
    room.bossRaid.stage = 'TECH_TREE';
    room.bossRaid.activeNode = null;
    room.bossRaid.activeQuestion = null;

    const tree = getSanitizedBossTree(room);

    io.to(room.pin).emit('boss-stage-tech-tree', {
      tree,
      message: tree.allShieldsBroken
        ? '⚠️ ALL 3 ELEMENTAL SHIELDS SHATTERED! The Capstone Strike is unlocked!'
        : 'Select the next tech tree node to research and attack!'
    });
  }

  socket.on('boss-get-tree', () => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'BOSS_RAID' || !room.bossRaid) return;
    const tree = getSanitizedBossTree(room);
    socket.emit('boss-stage-tech-tree', {
      tree,
      message: 'Active tech tree synchronized.'
    });
  });

  socket.on('boss-select-node', ({ nodeId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'BOSS_RAID') return;

    if (room.bossRaid.stage !== 'TECH_TREE') {
      return callback && callback({ success: false, error: 'A node combat round is already active!' });
    }

    const br = room.bossRaid;
    let foundNode = null;
    let foundBranch = null;

    for (const b of br.scenario.branches) {
      const n = b.nodes.find(item => item.id === nodeId);
      if (n) {
        foundNode = n;
        foundBranch = b;
        break;
      }
    }

    if (!foundNode) {
      return callback && callback({ success: false, error: 'Node not found in tech tree!' });
    }

    if (br.completedNodeIds.has(foundNode.id)) {
      return callback && callback({ success: false, error: 'This node has already been accredited and cleared!' });
    }

    if (foundNode.tier > 1) {
      const prevNode = foundBranch.nodes.find(pn => pn.tier === foundNode.tier - 1);
      if (prevNode && !br.completedNodeIds.has(prevNode.id)) {
        return callback && callback({ success: false, error: `Prerequisite ${prevNode.title} must be solved first!` });
      }
    }

    br.activeNode = foundNode;
    br.activeQuestion = foundNode;
    br.stage = 'NODE_COMBAT';
    br.combatSubmissions.clear();
    br.combatTimeLeft = 45;

    const sanitizedChoices = foundNode.choices.map(c => ({
      id: c.id,
      text: c.text,
      shape: c.shape
    }));

    const hasDistractorPurge = br.activeBuffs.some(b => b.id === 'buff-distractor-purge');
    if (hasDistractorPurge) {
      const wrongChoice = sanitizedChoices.find(c => {
        const full = foundNode.choices.find(fc => fc.id === c.id);
        return full && !full.isCorrect;
      });
      if (wrongChoice) wrongChoice.isPurged = true;
    }

    io.to(room.pin).emit('boss-node-activated', {
      node: {
        id: foundNode.id,
        title: foundNode.title,
        concept: foundNode.concept,
        tier: foundNode.tier,
        branchName: foundBranch.name,
        color: foundBranch.color,
        damage: foundNode.damage,
        buff: foundNode.buff
      },
      question: {
        stem: foundNode.question,
        choices: sanitizedChoices
      },
      timeLeft: br.combatTimeLeft
    });

    if (callback) callback({ success: true });
  });

  socket.on('boss-submit-answer', ({ choiceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'BOSS_RAID') return;

    const br = room.bossRaid;
    if (br.stage !== 'NODE_COMBAT' || !br.activeNode) {
      return callback && callback({ success: false, error: 'No node is currently in combat!' });
    }

    const player = room.players.get(socket.id);
    if (!player) return;

    br.combatSubmissions.set(socket.id, choiceId);

    const activeNode = br.activeNode;
    const correctChoice = activeNode.choices.find(c => c.isCorrect);
    const isCorrect = correctChoice && correctChoice.id === choiceId;

    let dmgDealt = 0;
    let counterDmgTaken = 0;
    let shieldShattered = false;
    let buffUnlocked = null;
    let aegisAbsorbed = false;

    if (isCorrect) {
      dmgDealt = activeNode.damage || 50;

      if (br.activeBuffs.some(b => b.id === 'buff-legal-pierce')) {
        dmgDealt = Math.round(dmgDealt * 1.25);
      }

      const shieldKey = Object.keys(br.shields).find(k => {
        const branch = br.scenario.branches.find(b => b.shieldTarget === k);
        return branch && branch.nodes.some(n => n.id === activeNode.id);
      }) || 'procurement';

      if (br.shields[shieldKey] && br.shields[shieldKey].hp > 0) {
        const remainingShieldHp = br.shields[shieldKey].hp;
        const overflowDmg = Math.max(0, dmgDealt - remainingShieldHp);
        br.shields[shieldKey].hp = Math.max(0, br.shields[shieldKey].hp - dmgDealt);
        if (br.shields[shieldKey].hp === 0) {
          shieldShattered = true;
          if (overflowDmg > 0) {
            br.bossHp = Math.max(0, br.bossHp - overflowDmg);
          }
        }
      } else {
        br.bossHp = Math.max(0, br.bossHp - dmgDealt);
      }

      if (br.activeBuffs.some(b => b.id === 'buff-team-surge')) {
        br.teamHp = Math.min(br.maxTeamHp, br.teamHp + 25);
      }

      if (activeNode.buff && !br.activeBuffs.some(b => b.id === activeNode.buff.id)) {
        br.activeBuffs.push(activeNode.buff);
        buffUnlocked = activeNode.buff;

        if (activeNode.buff.id === 'buff-combo-strike') {
          br.bossHp = Math.max(0, br.bossHp - 50);
          dmgDealt += 50;
        }
      }

      br.completedNodeIds.add(activeNode.id);
      player.score = (player.score || 0) + 100;
      player.damageDealt = (player.damageDealt || 0) + dmgDealt;
      player.nodesCompleted = (player.nodesCompleted || 0) + 1;
    } else {
      counterDmgTaken = 25;

      const aegisIdx = br.activeBuffs.findIndex(b => b.id === 'buff-aegis-shield');
      if (aegisIdx >= 0) {
        aegisAbsorbed = true;
        counterDmgTaken = 0;
        br.activeBuffs.splice(aegisIdx, 1);
      } else {
        br.teamHp = Math.max(0, br.teamHp - counterDmgTaken);
      }
    }

    br.stage = 'NODE_DEBRIEF';

    io.to(room.pin).emit('boss-combat-resolved', {
      isCorrect,
      chosenId: choiceId,
      correctId: correctChoice ? correctChoice.id : 'A',
      damageDealt: dmgDealt,
      counterDmgTaken,
      aegisAbsorbed,
      shieldShattered,
      buffUnlocked,
      newBossHp: br.bossHp,
      maxBossHp: br.maxBossHp,
      newTeamHp: br.teamHp,
      maxTeamHp: br.maxTeamHp,
      shields: br.shields,
      explanation: activeNode.explanation,
      cpaccRef: activeNode.cpaccRef,
      playerScores: Array.from(room.players.values()).map(p => ({
        id: p.id,
        nickname: p.nickname,
        score: p.score,
        damageDealt: p.damageDealt || 0
      }))
    });

    if (br.teamHp <= 0) {
      finishBossRaidGame(room, false);
    }

    if (callback) callback({ success: true, isCorrect, damageDealt: dmgDealt });
  });

  socket.on('boss-start-capstone', (callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'BOSS_RAID') return;

    const br = room.bossRaid;
    const allShieldsBroken = Object.values(br.shields).every(s => s.hp <= 0);
    if (!allShieldsBroken) {
      return callback && callback({ success: false, error: 'All 3 shields must be broken before striking the Capstone!' });
    }

    br.stage = 'CAPSTONE';
    br.activeNode = null;
    br.activeQuestion = br.scenario.capstone;

    const sanitizedChoices = br.scenario.capstone.choices.map(c => ({
      id: c.id,
      text: c.text,
      shape: c.shape
    }));

    io.to(room.pin).emit('boss-capstone-activated', {
      title: br.scenario.capstone.title,
      question: {
        stem: br.scenario.capstone.question,
        choices: sanitizedChoices
      },
      bossHp: br.bossHp,
      teamHp: br.teamHp
    });

    if (callback) callback({ success: true });
  });

  socket.on('boss-submit-capstone', ({ choiceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'BOSS_RAID') return;

    const br = room.bossRaid;
    if (br.stage !== 'CAPSTONE' || !br.activeQuestion) return;

    const player = room.players.get(socket.id);
    const correctChoice = br.scenario.capstone.choices.find(c => c.isCorrect);
    const isCorrect = correctChoice && correctChoice.id === choiceId;

    if (isCorrect) {
      br.bossHp = 0;
      if (player) {
        player.score = (player.score || 0) + 300;
        player.damageDealt = (player.damageDealt || 0) + 200;
      }
      finishBossRaidGame(room, true);
    } else {
      br.teamHp = Math.max(0, br.teamHp - 40);
      io.to(room.pin).emit('boss-capstone-failed', {
        newTeamHp: br.teamHp,
        explanation: br.scenario.capstone.explanation,
        cpaccRef: br.scenario.capstone.cpaccRef
      });
      if (br.teamHp <= 0) {
        finishBossRaidGame(room, false);
      }
    }

    if (callback) callback({ success: true, isCorrect });
  });

  function finishBossRaidGame(room, won) {
    if (room.timer) clearInterval(room.timer);
    room.status = won ? 'BOSS_VICTORY' : 'BOSS_DEFEAT';
    room.bossRaid.stage = won ? 'VICTORY' : 'DEFEAT';

    const ranked = Array.from(room.players.values())
      .sort((a, b) => (b.damageDealt || 0) - (a.damageDealt || 0))
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        damageDealt: p.damageDealt || 0,
        nodesCompleted: p.nodesCompleted || 0,
        rank: idx + 1
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.bossRaid.completedNodeIds.size + (won ? 1 : 0)
    });

    io.to(room.pin).emit('boss-game-finished', {
      won,
      bossName: room.bossRaid.scenario.name,
      bossAvatar: room.bossRaid.scenario.avatar,
      remainingBossHp: room.bossRaid.bossHp,
      remainingTeamHp: room.bossRaid.teamHp,
      nodesCompletedCount: room.bossRaid.completedNodeIds.size,
      podium: ranked.slice(0, 3),
      allPlayers: ranked
    });
  }

  // ==========================================
  // 4. Host Advance / Next Stage
  // ==========================================
  socket.on('next-stage', () => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    if (room.gameMode === 'BOSS_RAID') {
      if (room.bossRaid.stage === 'NODE_DEBRIEF') {
        transitionToBossTechTree(room);
      } else if (room.bossRaid.stage === 'CAPSTONE_DEBRIEF') {
        finishBossRaidGame(room, room.bossRaid.bossHp <= 0);
      }
    } else if (room.gameMode === 'HOT_POTATO') {
      if (room.status === 'HP_SETTLEMENT') {
        room.currentQuestionIndex += 1;
        room.hotPotato.hotSeatIndex += 1;
        if (room.currentQuestionIndex >= room.questions.length) {
          finishGame(room);
        } else {
          startHotPotatoRound(room);
        }
      }
    } else if (room.gameMode === 'HIGH_ROLLER') {
      if (room.status === 'HR_TEASER') {
        revealHighRollerQuestion(room);
      } else if (room.status === 'HR_REVEAL') {
        room.currentQuestionIndex += 1;
        if (room.currentQuestionIndex >= room.questions.length) {
          finishHighRollerGame(room);
        } else {
          startHighRollerTeaser(room);
        }
      }
    } else if (room.gameMode === 'FLAW_FINDER') {
      if (room.status === 'FF_SNIPING') {
        revealFlawFinderHeatmap(room);
      } else if (room.status === 'FF_HEATMAP') {
        room.flawFinder.currentScenarioIndex += 1;
        if (room.flawFinder.currentScenarioIndex >= room.flawFinder.scenarios.length) {
          finishFlawFinderGame(room);
        } else {
          startFlawFinderRound(room);
        }
      }
    } else if (room.gameMode === 'BOUNDARY_BRAWL') {
      if (room.boundaryBrawl.stage === 'BB_SCRAMBLE') {
        if (room.timer) clearInterval(room.timer);
        transitionToBoundaryChallengeStage(room);
      } else {
        finishBoundaryBrawlGame(room);
      }
    } else if (room.gameMode === 'CLASSIC') {
      if (room.status === 'REVEAL') {
        room.status = 'LEADERBOARD';
        const ranked = Array.from(room.players.values())
          .sort((a, b) => b.score - a.score)
          .map((p, idx) => ({
            id: p.id,
            nickname: p.nickname,
            avatar: p.avatar,
            score: p.score,
            streak: p.streak,
            rank: idx + 1
          }));

        io.to(room.pin).emit('show-leaderboard', {
          leaderboard: ranked,
          isLastQuestion: room.currentQuestionIndex >= room.questions.length - 1
        });
      } else if (room.status === 'LEADERBOARD') {
        room.currentQuestionIndex += 1;
        if (room.currentQuestionIndex >= room.questions.length) {
          finishGame(room);
        } else {
          startQuestionRound(room);
        }
      }
    }
  });

  function finishGame(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'PODIUM';

    const ranked = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        streak: p.streak,
        rank: idx + 1
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.questions?.length || (room.settings.questionCount || 10)
    });

    io.to(room.pin).emit('game-finished', {
      podium: ranked.slice(0, 3),
      allPlayers: ranked
    });
  }

  // ==========================================
  // 4G. Live Taunts & Winner Celebration FX
  // ==========================================
  socket.on('send-taunt', ({ tauntText, soundFx }, callback) => {
    const pin = socket.data.roomPin;
    if (!pin) {
      if (callback) callback({ success: false, error: 'Not in a room' });
      return;
    }

    const room = rooms.get(pin);
    if (!room) {
      if (callback) callback({ success: false, error: 'Room not found' });
      return;
    }

    const player = room.players.get(socket.id);
    if (!player) {
      if (callback) callback({ success: false, error: 'Player not in room' });
      return;
    }

    const now = Date.now();
    if (player.lastTauntTime && (now - player.lastTauntTime < 2000)) {
      if (callback) callback({ success: false, error: 'Taunt cooldown active' });
      return;
    }
    player.lastTauntTime = now;

    const cleanTaunt = typeof tauntText === 'string' ? tauntText.substring(0, 160) : 'Skill Issue!';
    const validSounds = ['airhorn', 'fanfare', 'whistle', 'sad-trombone', 'boing', 'coins', 'boxing-bell', 'applause'];
    const chosenSound = validSounds.includes(soundFx) ? soundFx : 'boing';

    io.to(pin).emit('player-taunted', {
      senderId: socket.id,
      nickname: player.nickname,
      avatar: player.avatar || '🎮',
      tauntText: cleanTaunt,
      soundFx: chosenSound,
      timestamp: now
    });

    if (callback) callback({ success: true });
  });

  socket.on('send-celebration-fx', ({ soundId, soundName, icon }, callback) => {
    const pin = socket.data.roomPin;
    if (!pin) {
      if (callback) callback({ success: false, error: 'Not in a room' });
      return;
    }

    const room = rooms.get(pin);
    if (!room) {
      if (callback) callback({ success: false, error: 'Room not found' });
      return;
    }

    const player = room.players.get(socket.id);
    if (!player) {
      if (callback) callback({ success: false, error: 'Player not in room' });
      return;
    }

    const validSounds = ['airhorn', 'fanfare', 'whistle', 'sad-trombone', 'boing', 'coins', 'boxing-bell', 'applause'];
    const chosenSound = validSounds.includes(soundId) ? soundId : 'airhorn';

    const now = Date.now();
    if (player.lastCelebrationTime && (now - player.lastCelebrationTime < 1200)) {
      if (callback) callback({ success: false, error: 'Celebration cooldown' });
      return;
    }
    player.lastCelebrationTime = now;

    io.to(pin).emit('winner-celebration-fx', {
      senderId: socket.id,
      nickname: player.nickname,
      avatar: player.avatar || '🏆',
      soundId: chosenSound,
      soundName: typeof soundName === 'string' ? soundName.substring(0, 30) : 'Airhorn',
      icon: typeof icon === 'string' ? icon.substring(0, 5) : '🎺',
      timestamp: now
    });

    if (callback) callback({ success: true });
  });

  // ==========================================
  // 5. Disconnect Cleanup
  // ==========================================
  socket.on('disconnect', () => {
    const pin = socket.data.roomPin;
    if (!pin) return;
    const room = rooms.get(pin);
    if (!room) return;

    if (socket.data.isHost) {
      console.log(`Host disconnected from room ${pin}`);
      io.to(pin).emit('host-disconnected');
      if (room.timer) clearInterval(room.timer);
      if (room.saboteur?.standupTimer) clearInterval(room.saboteur.standupTimer);
      if (room.boundaryBrawl?.activeChallenge?.timer) clearInterval(room.boundaryBrawl.activeChallenge.timer);
      for (const p of room.players.values()) {
        if (p.pitTimer) clearInterval(p.pitTimer);
      }
      rooms.delete(pin);
    } else if (socket.data.isPlayer) {
      console.log(`Player ${socket.id} left room ${pin}`);
      const player = room.players.get(socket.id);
      if (player) {
        if (player.pitTimer) clearInterval(player.pitTimer);

        // Finding 1: Preserve session for reconnection if game is in progress
        if (room.status !== 'LOBBY') {
          if (!room.disconnectedPlayers) room.disconnectedPlayers = new Map();
          room.disconnectedPlayers.set(player.nickname.toLowerCase(), {
            player,
            disconnectTime: Date.now()
          });
        }
      }

      room.players.delete(socket.id);
      room.answersThisRound.delete(socket.id);
      io.to(pin).emit('player-list-update', Array.from(room.players.values()));

      if (room.gameMode === 'CLASSIC' && room.status === 'QUESTION') {
        if (room.answersThisRound.size >= room.players.size && room.players.size > 0) {
          if (room.timer) clearInterval(room.timer);
          revealRoundResults(room);
        }
      } else if (room.gameMode === 'GRAND_PRIX' && room.status === 'GP_RACING') {
        broadcastGrandPrixTelemetry(room, `Player left the race.`);
      } else if (room.gameMode === 'HOT_POTATO') {
        if (room.status === 'HP_TEASER' && room.hotPotato.hotSeatPlayer?.id === socket.id) {
          console.log(`Hot Seat player disconnected during teaser in room ${pin}. Defaulting to PASS.`);
          if (room.timer) clearInterval(room.timer);
          handleHotPotatoAction(room, socket.id, 'PASS');
        } else if (room.status === 'HP_SOLO' && room.hotPotato.hotSeatPlayer?.id === socket.id) {
          console.log(`Hot Seat player disconnected during solo in room ${pin}. Settling round.`);
          if (room.timer) clearInterval(room.timer);
          settleHotPotatoRound(room);
        } else if (room.status === 'HP_DELEGATES') {
          const isDelegate = room.hotPotato.delegates.some(d => d.id === socket.id);
          if (isDelegate) {
            console.log(`Delegate disconnected during delegates round in room ${pin}.`);
            room.hotPotato.delegates = room.hotPotato.delegates.filter(d => d.id !== socket.id);
            if (room.hotPotato.delegates.length === 0 || room.hotPotato.submissions.size >= room.hotPotato.delegates.length) {
              if (room.timer) clearInterval(room.timer);
              settleHotPotatoRound(room);
            }
          }
        }
      }
    }
  });
});

// Serve client dist in production
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🎮 A11y Arcade Server running on port ${PORT}`);
});
