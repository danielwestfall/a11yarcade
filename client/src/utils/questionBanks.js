// Multi-Certification Question Banks Loader & Utilities
// Supports IAAP CPACC (Core Competencies) and IAAP WAS (Web Accessibility Specialist)
// Seamlessly normalizes both legacy arcade format and new structured quiz-bank schema

import cpaccRaw from '../data/questions.json';
import wasRaw from '../data/questions_was.json';
import cpaccBankRaw from '../data/quiz-bank/cpacc.json';
import wasBankRaw from '../data/quiz-bank/was.json';

export const CERTIFICATION_TRACKS = [
  {
    id: 'all',
    code: 'ALL',
    name: 'Dual Certification Pool',
    badge: '🌟 MIXED IAAP BOK',
    desc: 'Comprehensive mix of CPACC foundational concepts and WAS technical remediation questions.',
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
  all: [
    { id: 'all', label: '🌟 All Domains (Full Dual-Certification Pool)' },
    { id: 1, label: 'Domain 1: Disabilities / Creating Accessible Web Solutions' },
    { id: 2, label: 'Domain 2: Universal Design / Identifying Accessibility Issues' },
    { id: 3, label: 'Domain 3: Standards, Laws & Remediation Strategies' }
  ]
};

const SHAPES = ['triangle', 'diamond', 'circle', 'square'];

/**
 * Universal question record normalizer.
 * Supports legacy quiz format (question, choices) and structured quiz-bank schema (stem, options, answer).
 */
export function normalizeQuestion(raw, defaultCert = 'CPACC') {
  if (!raw) return null;

  // Already normalized legacy arcade format
  if (raw.question && Array.isArray(raw.choices)) {
    const cert = raw.certification || (raw.id?.startsWith('was-') ? 'WAS' : defaultCert);
    return {
      ...raw,
      certification: cert,
      citation: raw.citation || raw.cpaccRef || raw.wasRef || `${cert} Body of Knowledge`
    };
  }

  // Structured Quiz-Bank schema format
  const cert = raw.certification_id || (raw.id?.startsWith('was-') ? 'WAS' : defaultCert);
  const questionText = raw.stem || raw.question || 'Accessibility Question';

  let domainNum = 1;
  if (typeof raw.domain === 'number') {
    domainNum = raw.domain;
  } else if (typeof raw.domain_id === 'string') {
    const match = raw.domain_id.match(/-D(\d)/i);
    if (match) domainNum = parseInt(match[1], 10);
  }

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
export const COMBINED_QUESTIONS = [...CPACC_QUESTIONS, ...WAS_QUESTIONS];

/**
 * Returns questions filtered by track.
 * @param {'all' | 'cpacc' | 'was'} track 
 */
export function getQuestionsByTrack(track = 'all') {
  if (track === 'cpacc') return CPACC_QUESTIONS;
  if (track === 'was') return WAS_QUESTIONS;
  return COMBINED_QUESTIONS;
}

/**
 * Filter questions by multiple criteria.
 */
export function getFilteredQuestions({
  track = 'all',
  domain = 'all',
  difficulty = 'all',
  searchTerm = ''
}) {
  let pool = getQuestionsByTrack(track);

  if (domain !== 'all') {
    pool = pool.filter(q => q.domain === parseInt(domain, 10));
  }

  if (difficulty !== 'all') {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    pool = pool.filter(q => {
      const haystack = `${q.question} ${q.topic} ${q.explanation} ${q.citation || ''} ${q.funNote || ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }

  return pool;
}
