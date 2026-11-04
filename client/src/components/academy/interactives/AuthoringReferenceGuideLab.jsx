import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  FileCheck,
  RotateCcw,
  Sparkles,
  Download,
  Palette,
  Type,
  Table as TableIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const GUIDE_RULES = [
  {
    id: 'rule-headings',
    category: 'Typography & Structure',
    icon: Type,
    title: 'Native Heading Styles in Microsoft Word',
    instruction: 'Instruct authors to apply native Heading 1 through 6 styles rather than bolding body text or increasing font sizes.',
    wcagMapping: 'WCAG 1.3.1 Info & Relationships',
    defaultEnabled: true
  },
  {
    id: 'rule-tables',
    category: 'Data Tables',
    icon: TableIcon,
    title: 'Table Header Row & Pagination Controls',
    instruction: 'Check "Header Row" in Table Design; check "Repeat Header Rows at top of each page" and disable "Allow row to split across pages".',
    wcagMapping: 'WCAG 1.3.1 Info & Relationships',
    defaultEnabled: true
  },
  {
    id: 'rule-artifacts',
    category: 'Graphics & Layout',
    icon: Palette,
    title: 'Marking Decorative Flourishes as /Artifact',
    instruction: 'Explicitly direct authors to mark background divider lines, visual tints, and geometric patterns as decorative artifacts.',
    wcagMapping: 'WCAG 1.1.1 Non-text Content / PDF/UA 7.3',
    defaultEnabled: true
  },
  {
    id: 'rule-contrast',
    category: 'Color & Branding',
    icon: Palette,
    title: 'Brand Color Pairing Compliance Matrix',
    instruction: 'Publish pre-calculated accessible color pairings guaranteeing 4.5:1 text contrast directly in corporate design manuals.',
    wcagMapping: 'WCAG 1.4.3 Minimum Contrast',
    defaultEnabled: true
  }
];

export default function AuthoringReferenceGuideLab() {
  const [activeRules, setActiveRules] = useState({
    'rule-headings': true,
    'rule-tables': true,
    'rule-artifacts': true,
    'rule-contrast': true
  });
  const [guideExported, setGuideExported] = useState(false);

  const toggleRule = (id) => {
    soundManager.playClick();
    setActiveRules(prev => ({ ...prev, [id]: !prev[id] }));
    setGuideExported(false);
  };

  const handleExportGuide = () => {
    soundManager.playAuditPing();
    setGuideExported(true);
    soundManager.playCorrect();
    confetti({ particleCount: 40, spread: 60 });
  };

  const enabledCount = Object.values(activeRules).filter(Boolean).length;

  return (
    <section aria-label="Authoring Reference Guide Builder Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <BookOpen size={20} aria-hidden="true" />
          Authoring Reference Guides & Style Manuals
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Preventing accessibility defects during initial document creation is 90% cheaper than downstream PDF remediation. Configure an enterprise document authoring style guide to ensure Word, PowerPoint, and InDesign creators author accessible content by default.
        </p>
      </div>

      {/* Checklist Rules Grid */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Configure Enterprise Document Style Guide Rules
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          {GUIDE_RULES.map(rule => {
            const isChecked = !!activeRules[rule.id];
            const Icon = rule.icon;
            return (
              <label
                key={rule.id}
                htmlFor={`chk-${rule.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  background: isChecked ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-surface-elevated)',
                  border: isChecked ? '1px solid var(--arcade-yellow)' : '1px solid var(--arcade-border)',
                  cursor: 'pointer',
                  minHeight: '44px',
                  userSelect: 'none'
                }}
              >
                <input
                  type="checkbox"
                  id={`chk-${rule.id}`}
                  checked={isChecked}
                  onChange={() => toggleRule(rule.id)}
                  style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{rule.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({rule.category})</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rule.instruction}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--arcade-yellow)', fontWeight: 600 }}>{rule.wcagMapping}</div>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Export Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Active Rules: <strong>{enabledCount} of {GUIDE_RULES.length}</strong>
        </span>

        <button
          type="button"
          onClick={handleExportGuide}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--arcade-yellow)',
            color: '#000',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FileCheck size={18} aria-hidden="true" />
          Compile & Publish Authoring Job Aid
        </button>
      </div>

      {/* Confirmation Box */}
      {guideExported && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--arcade-green)',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <CheckCircle2 size={24} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <strong>Enterprise Style Guide Published!</strong> Document creators receive direct instructions to use native heading styles, repeat table header rows, mark decorative flourishes as artifacts, and apply brand-approved contrast pairings.
          </p>
        </div>
      )}
    </section>
  );
}
