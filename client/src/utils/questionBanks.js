// Multi-Certification Question Banks Loader & Utilities
// Supports Digital Accessibility IAAP Certifications: CPACC (Core Competencies), WAS (Web Accessibility Specialist), and upcoming ADS (Accessible Document Specialist)
// Seamlessly normalizes both legacy arcade format and new structured quiz-bank schema
// Supports granular Section-level and Subject-level filtering with question count audit

import cpaccRaw from '../data/questions.json';
import wasRaw from '../data/questions_was.json';
import cpaccBankRaw from '../data/quiz-bank/cpacc.json';
import wasBankRaw from '../data/quiz-bank/was.json';
import adsBankRaw from '../data/quiz-bank/ads.json';
import taxonomyRaw from '../data/quiz-bank/taxonomy.json';

export const CERTIFICATION_TAXONOMY = taxonomyRaw;

export const CERTIFICATION_TRACKS = [
  {
    id: 'all',
    code: 'ALL',
    name: 'Digital Accessibility IAAP Suite (CPACC · WAS · ADS)',
    badge: '🌟 IAAP CERTIFICATIONS',
    desc: 'Comprehensive curriculum covering CPACC foundational concepts, WAS technical code remediation, and ADS document accessibility.',
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.15)'
  },
  {
    id: 'cpacc',
    code: 'CPACC',
    name: 'CPACC: Core Competencies',
    badge: '📘 IAAP CPACC',
    desc: 'Disabilities & assistive tech, universal design, accessibility laws, and management strategies.',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.15)'
  },
  {
    id: 'was',
    code: 'WAS',
    name: 'WAS: Web Accessibility Specialist',
    badge: '💻 IAAP WAS',
    desc: 'Technical WCAG 2.1/2.2 AA success criteria, WAI-ARIA 1.2, screen reader testing, and code remediation.',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'ads',
    code: 'ADS',
    name: 'ADS: Accessible Document Specialist',
    badge: '📄 IAAP ADS',
    desc: 'Electronic documents, authoring accessible content, PDF/UA & Office remediation, document auditing, and advocacy.',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    comingSoon: false
  }
];

export const CERTIFICATION_DOMAINS = {
  cpacc: [
    { id: 'all', label: '🌟 All CPACC Domains (Mixed Core Competencies)' },
    { id: 1, label: 'Domain 1: Disabilities, Challenges & Assistive Tech (37.5%)' },
    { id: 2, label: 'Domain 2: Accessibility & Universal Design / WCAG (37.5%)' },
    { id: 3, label: 'Domain 3: Standards, Laws & Management Strategies (25.0%)' }
  ],
  was: [
    { id: 'all', label: '🌟 All WAS Domains (Technical Web Accessibility)' },
    { id: 1, label: 'Domain 1: Creating Accessible Web Solutions (WCAG, ARIA, HTML) (40%)' },
    { id: 2, label: 'Domain 2: Identifying Accessibility Issues & Auditing (40%)' },
    { id: 3, label: 'Domain 3: Offering Remediation & Accessibility Strategies (20%)' }
  ],
  ads: [
    { id: 'all', label: '🌟 All ADS Domains (Full Document Accessibility Suite)' },
    { id: 1, label: 'Domain 1: Creating Electronic Documents (25%)' },
    { id: 2, label: 'Domain 2: Remediating Electronic Documents (25%)' },
    { id: 3, label: 'Domain 3: Auditing & Testing Document Accessibility (25%)' },
    { id: 4, label: 'Domain 4: Document Accessibility Planning & Training (15%)' },
    { id: 5, label: 'Domain 5: Policy Promotion, Advocacy & Advising (10%)' }
  ],
  all: [
    { id: 'all', label: '🌟 All Domains (Full Digital Accessibility Certification Suite)' },
    { id: 1, label: 'Domain 1: Disabilities · Web Solutions · Document Creation' },
    { id: 2, label: 'Domain 2: Universal Design · Auditing · Document Remediation' },
    { id: 3, label: 'Domain 3: Standards & Laws · Remediation · Document Auditing' },
    { id: 4, label: 'Domain 4: Document Planning & Training (ADS)' },
    { id: 5, label: 'Domain 5: Policy Promotion, Advocacy & Advising (ADS)' }
  ]
};

const SHAPES = ['triangle', 'diamond', 'circle', 'square'];

/**
 * Maps legacy question IDs to appropriate taxonomy section IDs.
 */
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
  } else if (q.id.startsWith('ads-')) {
    return q.section_id || 'ADS-D1-A';
  }
  return 'UNKNOWN';
}

/**
 * Universal question record normalizer.
 * Supports legacy quiz format (question, choices) and structured quiz-bank schema (stem, options, answer).
 */
export function normalizeQuestion(raw, defaultCert = 'CPACC') {
  if (!raw) return null;

  const cert = raw.certification_id || (raw.id?.startsWith('was-') ? 'WAS' : raw.id?.startsWith('ads-') ? 'ADS' : defaultCert);
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
      citation: raw.citation || raw.cpaccRef || raw.wasRef || `${cert} Body of Knowledge`,
      citationUrl: raw.source_refs?.[0]?.url || raw.citationUrl || raw.url || null
    };
  }

  // Structured Quiz-Bank schema format
  const questionText = raw.stem || raw.question || 'Accessibility Question';

  let choices = [];
  if (raw.type === 'true_false' || typeof raw.answer === 'boolean') {
    const isAnswerTrue = raw.answer === true || String(raw.answer).toLowerCase() === 'true';
    choices = [
      { id: 'A', text: 'True', shape: 'triangle', isCorrect: isAnswerTrue },
      { id: 'B', text: 'False', shape: 'square', isCorrect: !isAnswerTrue }
    ];
  } else if (Array.isArray(raw.options)) {
    choices = raw.options.map((opt, idx) => ({
      id: opt.id,
      text: opt.text,
      shape: SHAPES[idx % SHAPES.length],
      isCorrect: opt.id === raw.answer
    }));
  } else if (Array.isArray(raw.choices)) {
    choices = raw.choices.map((c, idx) => ({
      ...c,
      shape: c.shape || SHAPES[idx % SHAPES.length]
    }));
  }

  const citation = raw.source_refs?.[0]?.locator ||
                   raw.source_refs?.[0]?.source_id ||
                   raw.citation ||
                   raw.cpaccRef ||
                   raw.wasRef ||
                   `${cert} Body of Knowledge`;

  const citationUrl = raw.source_refs?.[0]?.url || raw.citationUrl || raw.url || null;

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
    citationUrl,
    funNote: raw.funNote || ''
  };
}

// Build merged, deduplicated question banks
function buildBank(rawList, defaultCert) {
  const map = new Map();
  (Array.isArray(rawList) ? rawList : []).forEach(item => {
    const norm = normalizeQuestion(item, defaultCert);
    if (norm && norm.id && !map.has(norm.id)) {
      map.set(norm.id, norm);
    }
  });
  return Array.from(map.values());
}

export const CPACC_QUESTIONS = buildBank([...(Array.isArray(cpaccBankRaw) ? cpaccBankRaw : []), ...(Array.isArray(cpaccRaw) ? cpaccRaw : [])], 'CPACC');
export const WAS_QUESTIONS = buildBank([...(Array.isArray(wasBankRaw) ? wasBankRaw : []), ...(Array.isArray(wasRaw) ? wasRaw : [])], 'WAS');
export const ADS_QUESTIONS = buildBank(Array.isArray(adsBankRaw) ? adsBankRaw : [], 'ADS');
export const COMBINED_QUESTIONS = [...CPACC_QUESTIONS, ...WAS_QUESTIONS, ...ADS_QUESTIONS];

/**
 * Returns all taxonomy sections with real-time question counts and health status.
 * @param {'all' | 'cpacc' | 'was'} track 
 */
export function getAllSections(track = 'all') {
  const questions = getQuestionsByTrack(track);
  const counts = {};
  questions.forEach(q => {
    if (q.section_id) {
      counts[q.section_id] = (counts[q.section_id] || 0) + 1;
    }
  });

  const certs = (CERTIFICATION_TAXONOMY?.certifications || []).filter(c => {
    if (track === 'all') return true;
    return c.id.toLowerCase() === track.toLowerCase();
  });

  return certs.map(c => ({
    id: c.id,
    name: c.name,
    title: c.name || c.id,
    domains: (c.domains || []).map(d => ({
      id: d.id,
      label: d.label,
      title: d.label || d.id,
      sections: (d.sections || []).map(s => {
        const count = counts[s.id] || 0;
        let status = 'healthy';
        if (count < 5) status = 'critical';
        else if (count < 10) status = 'low';

        return {
          id: s.id,
          label: s.label,
          title: s.label,
          domain_id: d.id,
          domainLabel: d.label,
          certification_id: c.id,
          count,
          status, // 'healthy' (10+), 'low' (5-9), 'critical' (< 5)
          warningText: count < 5
            ? `Critical: only ${count} questions (cannot support a full 5- or 10-question round)`
            : count < 10
            ? `Low: ${count} questions (fewer than standard 10-question round)`
            : `${count} questions ready`
        };
      })
    }))
  }));
}

/**
 * Returns a flat array of all sections across certifications.
 */
export function getAllFlatSections(track = 'all') {
  const grouped = getAllSections(track);
  const flat = [];
  grouped.forEach(c => {
    (c.domains || []).forEach(d => {
      (d.sections || []).forEach(s => {
        flat.push(s);
      });
    });
  });
  return flat;
}

/**
 * Returns distinct subjects / tags with question counts.
 * @param {'all' | 'cpacc' | 'was'} track 
 */
export function getAllSubjects(track = 'all') {
  const questions = getQuestionsByTrack(track);
  const subjectMap = {};

  const SUBJECT_DISPLAY_NAMES = {
    'keyboard': { name: 'Keyboard Navigation & Focus', icon: '⌨️' },
    'procurement': { name: 'Procurement, VPAT & ACR', icon: '📜' },
    'wcag': { name: 'WCAG Conformance & Principles', icon: '🎯' },
    'testing': { name: 'Accessibility Testing & Audits', icon: '🧪' },
    'screen-reader': { name: 'Screen Reader Interaction', icon: '🔊' },
    'aria': { name: 'WAI-ARIA Roles & States', icon: '⚡' },
    'remediation': { name: 'Code Remediation Strategies', icon: '🛠️' },
    'end-user-impact': { name: 'End-User Experience & Impact', icon: '👥' },
    'prioritization': { name: 'Defect Severity & Backlog Prioritization', icon: '⚖️' },
    'assistive-technology': { name: 'Assistive Tech & Switch Access', icon: '🦽' },
    'low-vision': { name: 'Low Vision & Magnification', icon: '👁️' },
    'universal-design': { name: 'Universal Design & Accommodations', icon: '🌐' },
    'custom-controls': { name: 'Custom Widget & Dialog Semantics', icon: '🎛️' },
    'accessible-name': { name: 'Accessible Names & Descriptions', icon: '🏷️' },
    'focus': { name: 'Focus Order & Trap Prevention', icon: '🔍' },
    'forms': { name: 'Accessible Forms & Validation', icon: '📝' },
    'acr': { name: 'Accessibility Conformance Reports', icon: '📋' },
    'dynamic-content': { name: 'Dynamic Content & Live Regions', icon: '📡' },
    'wcag-em': { name: 'WCAG-EM Evaluation Methodology', icon: '📊' },
    'testing-tools': { name: 'Automated vs Manual Linters & Tools', icon: '⚙️' },
    'reporting': { name: 'Audit Documentation & Reporting', icon: '📑' },
    'qa': { name: 'Quality Assurance & CI/CD Gates', icon: '🛡️' },
    'conformance': { name: 'Conformance Levels (A, AA, AAA)', icon: '🏅' },
    'semantic-html': { name: 'Semantic HTML5 Elements', icon: '💻' },
    'automated-testing': { name: 'Automated Test Coverage Limits', icon: '🤖' },
    'severity': { name: 'Issue Severity Grading', icon: '🚨' },
    'captions': { name: 'Captions, Subtitles & Audio Description', icon: '💬' },
    'mitigation': { name: 'Third-Party Defect Mitigation', icon: '🩹' },
    'state': { name: 'ARIA State Management (expanded, pressed)', icon: '🔄' }
  };

  questions.forEach(q => {
    const qTags = Array.isArray(q.tags) && q.tags.length > 0 ? q.tags : [q.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')];
    qTags.forEach(rawTag => {
      const clean = rawTag.toLowerCase().trim();
      if (!clean) return;
      subjectMap[clean] = (subjectMap[clean] || 0) + 1;
    });
  });

  return Object.entries(subjectMap)
    .filter(([_, count]) => count >= 4) // Only show subjects with at least 4 items
    .sort((a, b) => b[1] - a[1])
    .map(([tagId, count]) => {
      const meta = SUBJECT_DISPLAY_NAMES[tagId] || {
        name: tagId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        icon: '🏷️'
      };
      return {
        id: tagId,
        key: tagId,
        label: meta.name,
        name: meta.name,
        icon: meta.icon,
        count
      };
    });
}

/**
 * Returns an audit report of sections with low question counts.
 */
export function getSectionAuditReport() {
  const allSections = getAllFlatSections('all');
  const critical = allSections.filter(s => s.status === 'critical');
  const low = allSections.filter(s => s.status === 'low');
  const healthy = allSections.filter(s => s.status === 'healthy');

  return {
    totalSections: allSections.length,
    critical,
    low,
    healthy,
    summaryText: `Found ${critical.length} critical section(s) (< 5 questions) and ${low.length} low section(s) (< 10 questions) out of ${allSections.length} syllabus sections.`
  };
}

/**
 * Returns questions filtered by track.
 * @param {'all' | 'cpacc' | 'was'} track 
 */
export function getQuestionsByTrack(track = 'all') {
  if (track === 'cpacc') return CPACC_QUESTIONS;
  if (track === 'was') return WAS_QUESTIONS;
  if (track === 'ads') return ADS_QUESTIONS;
  return COMBINED_QUESTIONS;
}

/**
 * Filter questions by multiple criteria:
 * - track ('all', 'cpacc', 'was')
 * - domain ('all', 1, 2, 3)
 * - sections (array of section IDs, or single string)
 * - subjects (array of subject/tag strings, or single string)
 * - difficulty ('all', 'easy', 'medium', 'hard')
 * - searchTerm (string)
 */
export function getFilteredQuestions({
  track = 'all',
  certTrack,
  domain = 'all',
  sections = [],
  subjects = [],
  difficulty = 'all',
  searchTerm = ''
}) {
  const activeTrack = certTrack || track;
  let pool = getQuestionsByTrack(activeTrack);

  // Filter by Domain
  if (domain !== 'all') {
    pool = pool.filter(q => q.domain === parseInt(domain, 10));
  }

  // Filter by Section(s) - single or multiple
  const activeSections = Array.isArray(sections)
    ? sections.filter(Boolean)
    : (sections ? [sections] : []);

  if (activeSections.length > 0) {
    const secSet = new Set(activeSections);
    pool = pool.filter(q => q.section_id && secSet.has(q.section_id));
  }

  // Filter by Subject(s) - single or multiple
  const activeSubjects = Array.isArray(subjects)
    ? subjects.filter(Boolean).map(s => s.toLowerCase())
    : (subjects ? [subjects.toLowerCase()] : []);

  if (activeSubjects.length > 0) {
    const subSet = new Set(activeSubjects);
    pool = pool.filter(q => {
      const qTags = (q.tags || []).map(t => t.toLowerCase());
      const qTopic = (q.topic || '').toLowerCase();
      return qTags.some(t => subSet.has(t)) || subSet.has(qTopic);
    });
  }

  // Filter by Difficulty
  if (difficulty !== 'all') {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  // Filter by Search Term
  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    pool = pool.filter(q => {
      const haystack = `${q.question} ${q.topic} ${q.explanation} ${q.citation || ''} ${q.funNote || ''} ${q.section_id || ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }

  return pool;
}
