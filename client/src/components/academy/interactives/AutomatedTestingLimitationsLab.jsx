import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Eye,
  Bot,
  UserCheck,
  HelpCircle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const DEFECTS = [
  {
    id: 'alt-filename',
    title: '1. Filename as Alternative Text',
    element: 'Quarterly Revenue Performance Bar Chart',
    code: '<Figure Alt="Q3_2026_revenue_growth_final_v2.png">',
    pacResult: 'PASS (Automated Checker detects non-empty Alt string)',
    pacPass: true,
    humanVerdict: 'CRITICAL BARRIER — Filename conveys zero data values, trends, or axis metrics to screen reader users.',
    fixDescription: 'Replace filename with true descriptive text: "Bar chart illustrating 18% Q3 revenue growth from $4.2M to $4.9M."'
  },
  {
    id: 'column-order',
    title: '2. Interleaved Multi-Column Reading Order',
    element: 'Two-Column Policy Article Layout',
    code: '<P>Col 1 Line 1</P><P>Col 2 Line 1</P><P>Col 1 Line 2</P><P>Col 2 Line 2</P>',
    pacResult: 'PASS (Automated Checker detects all text enclosed in valid <P> tags)',
    pacPass: true,
    humanVerdict: 'CRITICAL BARRIER — Sentences alternate across columns, garbling text into incomprehensible gibberish.',
    fixDescription: 'Restructure tag tree sequentially: tag all Column 1 paragraphs first, followed by Column 2 paragraphs.'
  },
  {
    id: 'layout-table',
    title: '3. Decorative Layout Formatted as Data Table',
    element: 'Team Member Contact Directory Cards',
    code: '<Table><TR><TH scope="col">Photo</TH><TH scope="col">Bio</TH></TR>...</Table>',
    pacResult: 'PASS (Automated Checker detects <TH> with valid scope attribute)',
    pacPass: true,
    humanVerdict: 'COGNITIVE BARRIER — Layout tables tagged with <Table> force screen readers into table navigation mode, creating unnecessary coordinate announcements.',
    fixDescription: 'Linearize layout into standard semantic headings and lists; reserve <Table> tags strictly for relational data.'
  },
  {
    id: 'image-contrast',
    title: '4. Text Contrast Over Background Photo',
    element: 'White Hero Banner Headline over Sky Photograph',
    code: '<P style="color: #ffffff">Join Our Inclusive Team</P> (Over cloud image)',
    pacResult: 'PASS / SKIPPED (PAC cannot compute luminance against raster image pixels)',
    pacPass: true,
    humanVerdict: 'CRITICAL BARRIER — Contrast drops to 1.9:1 over bright cloud pixels, failing WCAG 1.4.3 minimum 4.5:1.',
    fixDescription: 'Insert a solid 75% dark overlay scrim behind the text to ensure consistent 7.2:1 contrast.'
  }
];

export default function AutomatedTestingLimitationsLab() {
  const [fixedDefects, setFixedDefects] = useState({
    'alt-filename': false,
    'column-order': false,
    'layout-table': false,
    'image-contrast': false
  });

  const fixedCount = Object.values(fixedDefects).filter(Boolean).length;
  const isAllFixed = fixedCount === DEFECTS.length;
  const humanScore = Math.round((fixedCount / DEFECTS.length) * 100);

  const handleFixDefect = (id) => {
    soundManager.playClick();
    setFixedDefects(prev => {
      const updated = { ...prev, [id]: true };
      if (Object.values(updated).filter(Boolean).length === DEFECTS.length) {
        soundManager.playCorrect();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
      return updated;
    });
  };

  const handleFixAll = () => {
    soundManager.playClick();
    setFixedDefects({
      'alt-filename': true,
      'column-order': true,
      'layout-table': true,
      'image-contrast': true
    });
    soundManager.playCorrect();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    soundManager.playClick();
    setFixedDefects({
      'alt-filename': false,
      'column-order': false,
      'layout-table': false,
      'image-contrast': false
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro Header */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <FileSearch size={18} color="var(--arcade-amber)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Automated vs Human Judgment Document Audit Lab
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          IAAP ADS BoK Section 3.3 addresses the dangerous myth of automated PDF accessibility validation.
          Automated checkers (PAC, Acrobat Accessibility Checker) check ONLY syntactic code rules — they give 100% green
          checkmarks to documents with gibberish alt text, scrambled reading order, layout tables, and unreadable contrast.
          Experience the critical necessity of manual assistive technology testing.
        </p>
      </div>

      {/* Dual Scoreboard: Bot Checker vs Human Auditor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {/* Automated Bot Checker Scorecard */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bot size={18} color="var(--arcade-green)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Automated PAC 2024 Validation Score
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--arcade-green)' }}>
            100% · ALL CHECKS PASSED ✓
          </div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.4rem 0.6rem', borderRadius: '4px', borderLeft: '3px solid #f59e0b' }}>
            ⚠️ False Sense of Security: Automated tools cannot check meaning, reading order, or visual contrast over photos!
          </div>
        </div>

        {/* Human Expert Auditor Scorecard */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <UserCheck size={18} color={isAllFixed ? 'var(--arcade-green)' : '#ef4444'} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Human Assistive Tech Conformance Score
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isAllFixed ? 'var(--arcade-green)' : humanScore >= 50 ? 'var(--arcade-cyan)' : '#ef4444' }}>
            {humanScore}% · {isAllFixed ? 'GENUINELY ACCESSIBLE ✓' : `${DEFECTS.length - fixedCount} Critical Barriers Active`}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <button
              type="button"
              onClick={handleFixAll}
              className="secondary-btn"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Sparkles size={12} color="var(--arcade-gold)" />
              <span>Fix All 4 Flaws</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="secondary-btn"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 4 Deceptive Defect Inspection Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {DEFECTS.map(defect => {
          const isFixed = fixedDefects[defect.id];
          return (
            <div
              key={defect.id}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: `1px solid ${isFixed ? 'var(--arcade-green)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {defect.title}
                  </h5>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Document Target: <strong>{defect.element}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--arcade-green)', border: '1px solid var(--arcade-green)' }}>
                    Bot: PASS ✓
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', background: isFixed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isFixed ? 'var(--arcade-green)' : '#f87171', border: `1px solid ${isFixed ? 'var(--arcade-green)' : '#ef4444'}` }}>
                    Human: {isFixed ? 'PASS ✓' : 'FAIL ✗'}
                  </span>
                </div>
              </div>

              {/* Tag Code Display */}
              <div style={{ background: '#0a0f1d', padding: '0.5rem 0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#93c5fd', overflowX: 'auto' }}>
                {defect.code}
              </div>

              {/* Contrast Narrative */}
              <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                {isFixed ? (
                  <span style={{ color: 'var(--arcade-green)', fontWeight: 700 }}>
                    ✓ Remediated: {defect.fixDescription}
                  </span>
                ) : (
                  <span style={{ color: '#f87171' }}>
                    ⚠️ {defect.humanVerdict}
                  </span>
                )}
              </div>

              {/* Action Button */}
              {!isFixed && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.4rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => handleFixDefect(defect.id)}
                    className="primary-btn"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Check size={14} />
                    <span>Apply Expert Manual Remediation</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
