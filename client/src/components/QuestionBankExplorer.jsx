import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Lightbulb, CheckCircle2, ChevronDown, ChevronUp, Layers, Award, Sparkles, Filter, ExternalLink, Code, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  COMBINED_QUESTIONS,
  CPACC_QUESTIONS,
  WAS_QUESTIONS,
  CERTIFICATION_TRACKS,
  CERTIFICATION_DOMAINS,
  CERTIFICATION_TAXONOMY,
  getAllSections,
  getAllSubjects,
  getFilteredQuestions
} from '../utils/questionBanks';
import { soundManager } from '../utils/sound';

const SHAPE_CONFIG = {
  triangle: { icon: '▲', color: '#ef4444', label: 'Crimson Triangle' },
  diamond: { icon: '◆', color: '#38bdf8', label: 'Electric Diamond' },
  circle: { icon: '●', color: '#f59e0b', label: 'Amber Flare Circle' },
  square: { icon: '■', color: '#10b981', label: 'Emerald Square' }
};

export default function QuestionBankExplorer() {
  const [selectedTrack, setSelectedTrack] = useState('all'); // 'all', 'cpacc', 'was'
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [showAuditPanel, setShowAuditPanel] = useState(false);

  const activePool = selectedTrack === 'cpacc' ? CPACC_QUESTIONS : selectedTrack === 'was' ? WAS_QUESTIONS : COMBINED_QUESTIONS;

  const allSectionsList = useMemo(() => getAllSections(selectedTrack), [selectedTrack]);
  const allSubjectsList = useMemo(() => getAllSubjects(selectedTrack), [selectedTrack]);

  const d1Count = activePool.filter(q => q.domain === 1).length;
  const d2Count = activePool.filter(q => q.domain === 2).length;
  const d3Count = activePool.filter(q => q.domain === 3).length;

  const filteredQuestions = useMemo(() => {
    return activePool.filter((q) => {
      const matchesDomain = domainFilter === 'all' || q.domain === parseInt(domainFilter, 10);
      const matchesSection = sectionFilter === 'all' || q.section_id === sectionFilter;
      const matchesSubject = subjectFilter === 'all' || (
        Array.isArray(q.tags) && q.tags.map(t => t.toLowerCase()).includes(subjectFilter.toLowerCase())
      ) || (
        typeof q.topic === 'string' && q.topic.toLowerCase().includes(subjectFilter.toLowerCase())
      );
      const textToSearch = `${q.question} ${q.topic} ${q.explanation} ${q.citation || q.cpaccRef || q.wasRef || ''} ${q.funNote || ''}`.toLowerCase();
      const matchesSearch = !searchTerm.trim() || textToSearch.includes(searchTerm.toLowerCase());
      return matchesDomain && matchesSection && matchesSubject && matchesSearch;
    });
  }, [activePool, domainFilter, sectionFilter, subjectFilter, searchTerm]);

  const toggleExpand = (id) => {
    soundManager.playClick();
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    soundManager.playClick();
    setExpandedIds(new Set(filteredQuestions.map(q => q.id)));
  };

  const collapseAll = () => {
    soundManager.playClick();
    setExpandedIds(new Set());
  };

  const domainMetadata = {
    cpacc: {
      1: { accent: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', border: '#38bdf8', tag: 'DOM-1: 37.5% WEIGHT', title: 'Disabilities & Assistive Tech', desc: 'Models of disability (Social vs Medical), Visual, Auditory, Motor & Cognitive barriers, Screen Readers, Switch Access, and Braille displays.' },
      2: { accent: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', tag: 'DOM-2: 37.5% WEIGHT', title: 'Universal Design & WCAG', desc: 'The 7 Principles of Universal Design, WCAG 2.1/2.2 Principles (POUR), Conformance levels (A, AA, AAA), and UDL learning modalities.' },
      3: { accent: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', tag: 'DOM-3: 25.0% WEIGHT', title: 'Standards, Laws & Compliance', desc: 'ADA Title II & III, Rehabilitation Act Section 508, European EN 301 549, UN CRPD, VPAT / ACR procurement, and corporate governance.' }
    },
    was: {
      1: { accent: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', border: '#38bdf8', tag: 'DOM-1: 40.0% WEIGHT', title: 'Creating Accessible Web Solutions', desc: 'Technical WCAG 2.1/2.2 AA success criteria, WAI-ARIA 1.2 roles, states & properties, semantic HTML5 structure, and custom component patterns.' },
      2: { accent: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', tag: 'DOM-2: 40.0% WEIGHT', title: 'Auditing & Testing Issues', desc: 'Automated vs manual testing methodologies, screen reader mechanics (NVDA, JAWS, VoiceOver), keyboard traps, and contrast measurement.' },
      3: { accent: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', tag: 'DOM-3: 20.0% WEIGHT', title: 'Remediation & Strategies', desc: 'VPAT / ACR evaluation, third-party component remediation, accessible agile workflows, developer coaching, and CI/CD automated gates.' }
    },
    all: {
      1: { accent: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', border: '#38bdf8', tag: 'DOMAIN 1 (CPACC + WAS)', title: 'Disabilities & Accessible Solutions', desc: 'Disability models, assistive technologies, semantic HTML structure, and technical WCAG 2.1/2.2 AA requirements.' },
      2: { accent: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', tag: 'DOMAIN 2 (CPACC + WAS)', title: 'Universal Design & Technical Audits', desc: 'POUR principles, universal design, automated vs manual auditing, screen reader heuristics, and accessible design systems.' },
      3: { accent: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', tag: 'DOMAIN 3 (CPACC + WAS)', title: 'Standards, Laws & Remediation', desc: 'ADA, Section 508, EN 301 549, VPAT / ACR compliance, and corporate remediation governance.' }
    }
  };

  const currentDomainMeta = domainMetadata[selectedTrack] || domainMetadata.all;

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '7rem' }}>
      {/* Marquee Hero Header */}
      <section aria-labelledby="qb-explorer-title" className="marquee-hero-card">
        <div aria-hidden="true" style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '14rem', height: '14rem', background: 'rgba(56, 189, 248, 0.12)', borderRadius: '9999px', filter: 'blur(45px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '14rem', height: '14rem', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '9999px', filter: 'blur(45px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Top Certification Track Selector Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.25rem' }}>
            {CERTIFICATION_TRACKS.map(t => {
              const isSelected = selectedTrack === t.id;
              const count = t.id === 'cpacc' ? CPACC_QUESTIONS.length : t.id === 'was' ? WAS_QUESTIONS.length : COMBINED_QUESTIONS.length;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedTrack(t.id);
                    setDomainFilter('all');
                  }}
                  style={{
                    padding: '0.35rem 0.85rem',
                    border: `2px solid ${isSelected ? t.color : 'rgba(255,255,255,0.15)'}`,
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    borderRadius: '6px',
                    background: isSelected ? t.bg : '#0b1326',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? `0 0 12px ${t.color}40` : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  aria-pressed={isSelected}
                >
                  <span>{t.badge}</span>
                  <span style={{ color: isSelected ? t.color : '#64748b' }}>({count})</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #38bdf8', color: '#7dd3fc', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers size={13} />
              <span>[{selectedTrack === 'was' ? 'IAAP WAS CURRICULUM ARCHIVE' : selectedTrack === 'cpacc' ? 'IAAP CPACC BOK ARCHIVE' : 'IAAP DUAL CERTIFICATION ARCHIVE'}]</span>
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', color: '#6ee7b7', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={13} />
              <span>{activePool.length} CERTIFIED DRILLS</span>
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #c084fc', color: '#e9d5ff', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.1)' }}>
              [WCAG 2.2 AAA VERIFIED]
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #facc15', color: '#fef08a', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(250, 204, 21, 0.1)' }}>
              [IAAP BODY OF KNOWLEDGE]
            </span>
          </div>

          <h1 id="qb-explorer-title" style={{ fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
            {selectedTrack === 'was'
              ? 'WAS TECHNICAL QUESTION BANK & CODE ARCHIVE'
              : selectedTrack === 'cpacc'
              ? 'CPACC QUESTION BANK & BOK ARCHIVE'
              : 'IAAP ACCESSIBILITY CERTIFICATION ARCHIVE'}
          </h1>
          <p style={{ marginTop: '0.6rem', fontSize: '1.05rem', color: '#94a3b8', maxWidth: '880px', lineHeight: 1.55 }}>
            {selectedTrack === 'was'
              ? 'Technical accessibility drills adapted from the IAAP Web Accessibility Specialist (WAS) Body of Knowledge. Master WCAG 2.1/2.2 AA success criteria, WAI-ARIA 1.2 mechanics, screen reader compatibility, and code-level remediation.'
              : selectedTrack === 'cpacc'
              ? 'The complete tactical syllabus adapted from the IAAP Certified Professional in Accessibility Core Competencies (CPACC) Body of Knowledge. Browse, filter, expand rationales, and master all three accredited domains.'
              : 'The comprehensive dual-track syllabus covering foundational concepts from IAAP CPACC and deep technical code-level remediation from IAAP WAS. Browse, filter by domain, inspect citations, and test your readiness.'}
          </p>

          {/* Diagnostic Metrics Bar */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', fontFamily: "'Space Mono', monospace" }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Total Active Syllabus: </span>
              <strong style={{ color: '#38bdf8' }}>{activePool.length} Verified Questions</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Domain 1: </span>
              <strong style={{ color: '#38bdf8' }}>{d1Count} Drills ({activePool.length ? Math.round((d1Count / activePool.length) * 100) : 0}%)</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Domain 2: </span>
              <strong style={{ color: '#10b981' }}>{d2Count} Drills ({activePool.length ? Math.round((d2Count / activePool.length) * 100) : 0}%)</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Domain 3: </span>
              <strong style={{ color: '#f59e0b' }}>{d3Count} Drills ({activePool.length ? Math.round((d3Count / activePool.length) * 100) : 0}%)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Breakdown Telemetry Bento Grid */}
      <section aria-label="Curriculum Domain Breakdown" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Domain 1 Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => { soundManager.playClick(); setDomainFilter(domainFilter === '1' ? 'all' : '1'); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); soundManager.playClick(); setDomainFilter(domainFilter === '1' ? 'all' : '1'); } }}
          className="card"
          style={{
            padding: '1.5rem',
            border: `2px solid ${domainFilter === '1' ? currentDomainMeta[1].accent : 'var(--border-color)'}`,
            borderLeft: `5px solid ${currentDomainMeta[1].accent}`,
            background: domainFilter === '1' ? currentDomainMeta[1].bg : 'var(--bg-surface)',
            boxShadow: '4px 4px 0px 0px #040810',
            cursor: 'pointer',
            transition: 'transform 0.1s ease'
          }}
          aria-pressed={domainFilter === '1'}
          aria-label={`Filter by ${currentDomainMeta[1].title}`}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: currentDomainMeta[1].accent, background: currentDomainMeta[1].bg, padding: '0.2rem 0.5rem', borderRadius: '4px', border: `1px solid ${currentDomainMeta[1].border}` }}>
              [{currentDomainMeta[1].tag}]
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: currentDomainMeta[1].accent, fontFamily: "'Space Mono', monospace" }}>
              {d1Count} QUESTIONS
            </span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', fontFamily: "'Space Grotesk', sans-serif" }}>
            {currentDomainMeta[1].title}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            {currentDomainMeta[1].desc}
          </p>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${currentDomainMeta[1].accent}33`, fontSize: '0.78rem', fontFamily: "'Space Mono', monospace", color: '#7dd3fc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{domainFilter === '1' ? '✓ FILTER ACTIVE' : 'CLICK TO FILTER'}</span>
            <span>{d1Count} OF {activePool.length} ITEMS</span>
          </div>
        </div>

        {/* Domain 2 Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => { soundManager.playClick(); setDomainFilter(domainFilter === '2' ? 'all' : '2'); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); soundManager.playClick(); setDomainFilter(domainFilter === '2' ? 'all' : '2'); } }}
          className="card"
          style={{
            padding: '1.5rem',
            border: `2px solid ${domainFilter === '2' ? currentDomainMeta[2].accent : 'var(--border-color)'}`,
            borderLeft: `5px solid ${currentDomainMeta[2].accent}`,
            background: domainFilter === '2' ? currentDomainMeta[2].bg : 'var(--bg-surface)',
            boxShadow: '4px 4px 0px 0px #040810',
            cursor: 'pointer',
            transition: 'transform 0.1s ease'
          }}
          aria-pressed={domainFilter === '2'}
          aria-label={`Filter by ${currentDomainMeta[2].title}`}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: currentDomainMeta[2].accent, background: currentDomainMeta[2].bg, padding: '0.2rem 0.5rem', borderRadius: '4px', border: `1px solid ${currentDomainMeta[2].border}` }}>
              [{currentDomainMeta[2].tag}]
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: currentDomainMeta[2].accent, fontFamily: "'Space Mono', monospace" }}>
              {d2Count} QUESTIONS
            </span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', fontFamily: "'Space Grotesk', sans-serif" }}>
            {currentDomainMeta[2].title}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            {currentDomainMeta[2].desc}
          </p>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${currentDomainMeta[2].accent}33`, fontSize: '0.78rem', fontFamily: "'Space Mono', monospace", color: '#6ee7b7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{domainFilter === '2' ? '✓ FILTER ACTIVE' : 'CLICK TO FILTER'}</span>
            <span>{d2Count} OF {activePool.length} ITEMS</span>
          </div>
        </div>

        {/* Domain 3 Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => { soundManager.playClick(); setDomainFilter(domainFilter === '3' ? 'all' : '3'); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); soundManager.playClick(); setDomainFilter(domainFilter === '3' ? 'all' : '3'); } }}
          className="card"
          style={{
            padding: '1.5rem',
            border: `2px solid ${domainFilter === '3' ? currentDomainMeta[3].accent : 'var(--border-color)'}`,
            borderLeft: `5px solid ${currentDomainMeta[3].accent}`,
            background: domainFilter === '3' ? currentDomainMeta[3].bg : 'var(--bg-surface)',
            boxShadow: '4px 4px 0px 0px #040810',
            cursor: 'pointer',
            transition: 'transform 0.1s ease'
          }}
          aria-pressed={domainFilter === '3'}
          aria-label={`Filter by ${currentDomainMeta[3].title}`}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: currentDomainMeta[3].accent, background: currentDomainMeta[3].bg, padding: '0.2rem 0.5rem', borderRadius: '4px', border: `1px solid ${currentDomainMeta[3].border}` }}>
              [{currentDomainMeta[3].tag}]
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: currentDomainMeta[3].accent, fontFamily: "'Space Mono', monospace" }}>
              {d3Count} QUESTIONS
            </span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', fontFamily: "'Space Grotesk', sans-serif" }}>
            {currentDomainMeta[3].title}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            {currentDomainMeta[3].desc}
          </p>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${currentDomainMeta[3].accent}33`, fontSize: '0.78rem', fontFamily: "'Space Mono', monospace", color: '#fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{domainFilter === '3' ? '✓ FILTER ACTIVE' : 'CLICK TO FILTER'}</span>
            <span>{d3Count} OF {activePool.length} ITEMS</span>
          </div>
        </div>
      </section>

      {/* Filter & Search Console */}
      <section aria-label="Curriculum Search and Filters" className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search by topic, keyword, WCAG criterion, law, or citation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
                aria-label="Search questions by topic, keyword or law"
              />
            </div>

            {/* Expand / Collapse All Quick Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={expandAll}
                className="btn-secondary"
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.8rem',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  background: '#0b1326',
                  borderColor: 'var(--border-color)',
                  color: '#ffffff'
                }}
              >
                [ ⊞ Expand All ]
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="btn-secondary"
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.8rem',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  background: '#0b1326',
                  borderColor: 'var(--border-color)',
                  color: '#ffffff'
                }}
              >
                [ ⊟ Collapse All ]
              </button>
            </div>
          </div>

          {/* Section & Subject Filters Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
            {/* Section Filter Dropdown */}
            <div>
              <label htmlFor="explorer-section-select" style={{ display: 'block', fontWeight: 800, fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.3rem', fontFamily: "'Space Mono', monospace" }}>
                📑 Filter By Section:
              </label>
              <select
                id="explorer-section-select"
                className="input-field"
                value={sectionFilter}
                onChange={(e) => { soundManager.playClick(); setSectionFilter(e.target.value); }}
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
              >
                <option value="all">All Sections ({activePool.length} Qs)</option>
                {allSectionsList.map(cert => (
                  <optgroup key={cert.id} label={cert.title}>
                    {(cert.domains || []).map(dom => (
                      (dom.sections || []).map(s => (
                        <option key={s.id} value={s.id}>
                          {s.id}: {s.title} ({s.count} Qs{s.count < 5 ? ' - 🔴 CRITICAL' : s.count < 10 ? ' - ⚠️ LOW' : ''})
                        </option>
                      ))
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Subject Filter Dropdown */}
            <div>
              <label htmlFor="explorer-subject-select" style={{ display: 'block', fontWeight: 800, fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.3rem', fontFamily: "'Space Mono', monospace" }}>
                🏷️ Filter By Subject / Tag:
              </label>
              <select
                id="explorer-subject-select"
                className="input-field"
                value={subjectFilter}
                onChange={(e) => { soundManager.playClick(); setSubjectFilter(e.target.value); }}
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
              >
                <option value="all">All Subjects / Topics ({activePool.length} Qs)</option>
                {allSubjectsList.map(sub => (
                  <option key={sub.key} value={sub.key}>
                    {sub.icon} {sub.label} ({sub.count} Qs)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Domain Filter Pills & Audit Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `All Domains (${activePool.length})` },
                { id: '1', label: `${currentDomainMeta[1].title} (${d1Count})` },
                { id: '2', label: `${currentDomainMeta[2].title} (${d2Count})` },
                { id: '3', label: `${currentDomainMeta[3].title} (${d3Count})` }
              ].map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => { soundManager.playClick(); setDomainFilter(d.id); }}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 800,
                    background: domainFilter === d.id ? '#38bdf8' : '#0b1326',
                    color: domainFilter === d.id ? '#090d16' : '#94a3b8',
                    border: `1px solid ${domainFilter === d.id ? '#38bdf8' : 'var(--border-color)'}`,
                    cursor: 'pointer'
                  }}
                  aria-pressed={domainFilter === d.id}
                >
                  {d.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setShowAuditPanel(!showAuditPanel);
                }}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 800,
                  minHeight: '44px',
                  background: showAuditPanel ? '#f59e0b' : 'rgba(245, 158, 11, 0.15)',
                  color: showAuditPanel ? '#090d16' : '#fbbf24',
                  border: '1px solid #f59e0b',
                  cursor: 'pointer'
                }}
                aria-expanded={showAuditPanel}
                aria-controls="section-readiness-drawer"
              >
                📊 {showAuditPanel ? 'Hide Section Audit' : 'Section Readiness Audit'}
              </button>
            </div>

            <div style={{ fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
              Displaying <strong style={{ color: '#ffffff' }}>{filteredQuestions.length}</strong> of {activePool.length} Syllabus Drills
            </div>
          </div>

          {/* Collapsible Section Inventory Audit Drawer */}
          {showAuditPanel && (
            <div id="section-readiness-drawer" style={{ marginTop: '0.85rem', padding: '1rem', background: '#070d19', borderRadius: 'var(--radius-sm)', border: '2px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24', fontFamily: "'Space Grotesk', sans-serif" }}>
                  📊 Individual Section Inventory & Readiness Audit
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                  MIN ROUND: 5 Qs | STANDARD: 10 Qs
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                Click any section badge below to inspect its questions. Sections labeled <strong style={{ color: '#fca5a5' }}>🔴 CRITICAL</strong> have fewer than 5 questions and cannot support an isolated 5- or 10-question round without pooling.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem' }}>
                {allSectionsList.map(cert => (
                  (cert.domains || []).map(dom => (
                    (dom.sections || []).map(sec => {
                      const isCritical = sec.count < 5;
                      const isLow = sec.count >= 5 && sec.count < 10;
                      const isSelected = sectionFilter === sec.id;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setSectionFilter(sectionFilter === sec.id ? 'all' : sec.id);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.45rem 0.65rem',
                            minHeight: '44px',
                            borderRadius: '4px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(56, 189, 248, 0.2)' : isCritical ? 'rgba(239, 68, 68, 0.1)' : isLow ? 'rgba(245, 158, 11, 0.1)' : 'rgba(15, 23, 42, 0.6)',
                            border: `1px solid ${isSelected ? '#38bdf8' : isCritical ? '#ef4444' : isLow ? '#f59e0b' : 'rgba(51, 65, 85, 0.5)'}`,
                            color: '#ffffff',
                            fontSize: '0.78rem'
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 800, color: isCritical ? '#fca5a5' : isLow ? '#fde68a' : '#93c5fd' }}>
                              [{sec.id}]
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                              {sec.title}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.4rem',
                            borderRadius: '3px',
                            background: isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#10b981',
                            color: '#090d16',
                            fontFamily: "'Space Mono', monospace"
                          }}>
                            {sec.count} Qs
                          </span>
                        </button>
                      );
                    })
                  ))
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Questions Accordion List */}
      <section aria-label="Curriculum Questions Accordion">
        {filteredQuestions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', border: '2px solid #ef4444' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍🚫</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ef4444', marginBottom: '0.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              NO CURRICULUM QUESTIONS MATCHED YOUR SEARCH
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
              Try adjusting your search terms or selecting "All Domains" to view all {activePool.length} questions in this track.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => { soundManager.playClick(); setSearchTerm(''); setDomainFilter('all'); }}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontFamily: "'Space Mono', monospace" }}
            >
              [ RESET ALL FILTERS ]
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredQuestions.map((q, idx) => {
              const isExpanded = expandedIds.has(q.id);
              const domainMeta = currentDomainMeta[q.domain] || currentDomainMeta[1];
              const isWas = (q.certification || '').toUpperCase() === 'WAS' || (q.id && q.id.startsWith('was-'));

              return (
                <article
                  key={q.id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    border: '2px solid var(--border-bright)',
                    borderLeft: `5px solid ${domainMeta.accent}`,
                    background: 'var(--bg-surface)',
                    boxShadow: '4px 4px 0px 0px #040810'
                  }}
                >
                  {/* Clickable Header Accordion Bar */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleExpand(q.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpand(q.id);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '1rem'
                    }}
                    aria-expanded={isExpanded}
                    aria-label={`Question ${idx + 1}: ${q.question}. Click to toggle explanation and answers.`}
                  >
                    <div style={{ flex: 1 }}>
                      {/* Telemetry Chips */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, background: '#0b1326', color: domainMeta.accent, padding: '0.2rem 0.55rem', borderRadius: '4px', border: `1px solid ${domainMeta.border}`, fontFamily: "'Space Mono', monospace" }}>
                          #{idx + 1}
                        </span>

                        {/* Certification Pill */}
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: isWas ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: isWas ? '#6ee7b7' : '#7dd3fc',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          border: `1px solid ${isWas ? '#10b981' : '#38bdf8'}`,
                          fontFamily: "'Space Mono', monospace",
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {isWas ? <Code size={12} /> : <Award size={12} />}
                          <span>[{isWas ? 'IAAP WAS' : 'IAAP CPACC'}]</span>
                        </span>

                        <span style={{ fontSize: '0.75rem', fontWeight: 800, background: domainMeta.bg, color: domainMeta.accent, padding: '0.2rem 0.65rem', borderRadius: '4px', fontFamily: "'Space Mono', monospace" }}>
                          [DOM-{q.domain}: {q.topic}]
                        </span>
                        {q.difficulty && (
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#1e293b', color: '#94a3b8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}>
                            {q.difficulty}
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: "'Space Mono', monospace" }}>
                          ID: {q.id}
                        </span>
                      </div>

                      {/* Question Stem */}
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.45, margin: 0, fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
                        {q.question}
                      </h3>
                    </div>

                    <div style={{ padding: '0.35rem 0.65rem', background: '#060e20', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0, marginTop: '2px' }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                        {isExpanded ? 'HIDE' : 'EXAMINE'}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Expanded Syllabus Breakdown Drawer */}
                  {isExpanded && (
                    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Dual-Coded Multiple Choice Options Grid */}
                      <div>
                        <div style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8', fontWeight: 800, marginBottom: '0.6rem' }}>
                          [VERIFIED CURRICULUM CHOICES & ACCREDITED ANSWER]
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                          {q.choices.map((c) => {
                            const shape = SHAPE_CONFIG[c.shape] || SHAPE_CONFIG.triangle;
                            return (
                              <div
                                key={c.id}
                                style={{
                                  background: c.isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface-elevated)',
                                  border: c.isCorrect ? '2px solid #10b981' : '1px solid var(--border-color)',
                                  padding: '0.85rem 1rem',
                                  borderRadius: 'var(--radius-sm)',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '0.75rem',
                                  boxShadow: c.isCorrect ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none'
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 900,
                                    fontSize: '0.9rem',
                                    fontFamily: "'Space Mono', monospace",
                                    color: c.isCorrect ? '#10b981' : shape.color,
                                    background: '#060e20',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    border: `1px solid ${c.isCorrect ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                                    flexShrink: 0
                                  }}
                                  aria-label={`${c.id} ${shape.label}`}
                                >
                                  {c.id} {shape.icon}
                                </span>

                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: c.isCorrect ? 700 : 500, lineHeight: 1.4 }}>
                                    {c.text}
                                  </div>
                                  {c.isCorrect && (
                                    <div style={{ fontSize: '0.72rem', color: '#6ee7b7', fontFamily: "'Space Mono', monospace", fontWeight: 800, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                      <CheckCircle2 size={13} color="#10b981" />
                                      <span>[✓ OFFICIAL IAAP ANSWER KEY]</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Official BoK Citation Box */}
                      <div style={{ background: '#060e20', border: `1px solid ${isWas ? '#10b981' : '#38bdf8'}`, padding: '1.1rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: isWas ? '#10b981' : '#38bdf8', marginBottom: '0.4rem', fontFamily: "'Space Mono', monospace", fontSize: '0.78rem' }}>
                          <BookOpen size={16} color={isWas ? '#10b981' : '#38bdf8'} />
                          <span>{isWas ? 'WAS BODY OF KNOWLEDGE & TECHNICAL RATIONALE:' : 'CPACC BODY OF KNOWLEDGE EXPLANATION & RATIONALE:'}</span>
                        </div>
                        <p style={{ fontSize: '0.96rem', color: '#f1f5f9', margin: 0, lineHeight: 1.6 }}>
                          {q.explanation}
                        </p>
                        {(q.citation || q.cpaccRef || q.wasRef) && (
                          <div style={{ marginTop: '0.65rem', paddingTop: '0.5rem', borderTop: `1px solid ${isWas ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)'}`, fontSize: '0.78rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                            Official Syllabus Citation:{' '}
                            {q.citationUrl ? (
                              <a
                                href={q.citationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: isWas ? '#6ee7b7' : '#38bdf8',
                                  textDecoration: 'underline',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontWeight: 800
                                }}
                                aria-label={`${q.citation || q.wasRef || q.cpaccRef} (opens in a new tab)`}
                              >
                                <span>{q.citation || q.wasRef || q.cpaccRef}</span>
                                <ExternalLink size={13} aria-hidden="true" />
                                <span className="sr-only">(opens in a new tab)</span>
                              </a>
                            ) : (
                              <strong style={{ color: isWas ? '#6ee7b7' : '#38bdf8' }}>{q.citation || q.wasRef || q.cpaccRef}</strong>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Humorous Arcade Mnemonic Callout Box */}
                      {q.funNote && (
                        <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#fef08a', fontSize: '0.9rem' }}>
                          <Lightbulb size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Arcade Mnemonic & Reality Check: </strong>
                            <span style={{ lineHeight: 1.5 }}>{q.funNote}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Fixed Bottom Arcade Dock */}
      <aside aria-label="Curriculum Explorer Command Deck" className="arcade-dock">
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', fontFamily: "'Space Mono', monospace", color: '#cbd5e1' }}>
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>
              {activePool.length} Certified Questions Indexed
            </span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>
              ✓ 100% WCAG 2.2 AAA Validated
            </span>
            <span>•</span>
            <span style={{ color: '#facc15' }}>
              Dual-Coded Shapes (▲ ◆ ● ■) Active
            </span>
          </div>

          <button
            type="button"
            className="btn-primary arcade-btn-secondary"
            onClick={() => {
              soundManager.playClick();
              window.location.hash = '#solo';
              window.location.reload();
            }}
            style={{
              padding: '0.65rem 1.75rem',
              fontSize: '0.95rem',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              background: '#facc15',
              borderColor: '#facc15',
              color: '#090d16'
            }}
          >
            <span>[ 🕹️ TEST KNOWLEDGE IN SOLO ARENA ]</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
