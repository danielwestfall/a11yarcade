import React, { useState } from 'react';
import {
  PieChart,
  CheckCircle2,
  Sigma,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Table
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const COMPLEX_CHALLENGES = [
  {
    id: 'math-equations',
    name: 'Scientific & MathML Equations',
    icon: Sigma,
    desc: 'Scientific formulas saved as bitmap images prevent screen readers from navigating numerator/denominator hierarchies or outputting Nemeth Braille.',
    badPractice: 'Image of quadratic formula with alt="Formula image"',
    goodPractice: 'Native MathML (<math>) or LaTeX markup embedded in PDF with semantic structural tree tags'
  },
  {
    id: 'complex-infographic',
    name: 'Multi-Layer Financial Infographic',
    icon: PieChart,
    desc: 'Complex 10-year multi-segment revenue infographics cannot be adequately described in a single alt text attribute.',
    badPractice: 'Single 5,000-character alt-text blob dumped into image properties dialog',
    goodPractice: 'High-level executive summary paragraph paired with an accessible, properly tagged data table'
  },
  {
    id: 'form-tab-order',
    name: 'Interactive Form Field Keyboard Order',
    icon: SlidersHorizontal,
    desc: 'By default, Acrobat tab order may follow creation order or visual coordinates rather than reading order.',
    badPractice: 'Tab Order set to "Unspecified" (keyboard jumps erratically across form sections)',
    goodPractice: 'Page Properties > Tab Order explicitly set to "Use Document Structure"'
  }
];

export default function ComplexDocumentEscalationLab() {
  const [selectedChallengeId, setSelectedChallengeId] = useState('math-equations');
  const [useAccessiblePattern, setUseAccessiblePattern] = useState(true);
  const [completedAll, setCompletedAll] = useState(false);
  const [visited, setVisited] = useState(1);

  const activeChallenge = COMPLEX_CHALLENGES.find(c => c.id === selectedChallengeId) || COMPLEX_CHALLENGES[0];

  const handleSelectChallenge = (id) => {
    soundManager.playClick();
    setSelectedChallengeId(id);
    const newCount = visited + 1;
    setVisited(newCount);
    if (newCount >= COMPLEX_CHALLENGES.length && !completedAll) {
      setCompletedAll(true);
      soundManager.playCorrect();
      confetti({ particleCount: 35, spread: 60 });
    }
  };

  const handleTogglePattern = () => {
    soundManager.playClick();
    const next = !useAccessiblePattern;
    setUseAccessiblePattern(next);
    if (next) soundManager.playCorrect();
    else soundManager.playIncorrect();
  };

  return (
    <section aria-label="Complex Document Remediation Escalation Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <PieChart size={20} aria-hidden="true" />
          Complex Formats: MathML, LaTeX, Data Visualizations & Forms
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Complex document assets require specialized architectural patterns: scientific formulas need <strong>MathML</strong> for tactile Nemeth Braille, dense infographics require <strong>paired data tables</strong>, and interactive PDF forms must bind tab order to <strong>Document Structure</strong>.
        </p>
      </div>

      {/* Challenge Selector */}
      <div role="tablist" aria-label="Complex Format Challenges" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
        {COMPLEX_CHALLENGES.map(ch => {
          const isSelected = selectedChallengeId === ch.id;
          const Icon = ch.icon;
          return (
            <button
              key={ch.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleSelectChallenge(ch.id)}
              style={{
                minHeight: '44px',
                padding: '0.75rem',
                borderRadius: '6px',
                border: isSelected ? '2px solid var(--arcade-yellow)' : '1px solid var(--arcade-border)',
                background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface-elevated)',
                color: isSelected ? 'var(--arcade-yellow)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'left'
              }}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{ch.name}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Pattern Comparison Console */}
      <div style={{ background: '#020617', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--arcade-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--arcade-yellow)' }}>
            Architecture Pattern Evaluation: {activeChallenge.name}
          </span>
          <button
            type="button"
            onClick={handleTogglePattern}
            style={{
              minHeight: '36px',
              padding: '0.4rem 0.85rem',
              borderRadius: '4px',
              border: 'none',
              background: useAccessiblePattern ? 'var(--arcade-green)' : '#ef4444',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {useAccessiblePattern ? '✓ Accessible Architecture Pattern' : '✕ Flawed Legacy Anti-Pattern'}
          </button>
        </div>

        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeChallenge.desc}</p>

        {/* Pattern Card */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '6px',
            background: useAccessiblePattern ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${useAccessiblePattern ? 'var(--arcade-green)' : '#ef4444'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <strong style={{ fontSize: '0.85rem', color: useAccessiblePattern ? 'var(--arcade-green)' : '#ef4444' }}>
            {useAccessiblePattern ? 'Recommended Industry Pattern:' : 'Inaccessible Anti-Pattern:'}
          </strong>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {useAccessiblePattern ? activeChallenge.goodPractice : activeChallenge.badPractice}
          </span>
        </div>
      </div>
    </section>
  );
}
