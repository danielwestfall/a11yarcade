import React, { useState } from 'react';
import {
  Code,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Terminal,
  GitPullRequest,
  Check,
  FileCode,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const ACT_RULES = [
  {
    id: 'rule-b4f0c3',
    ruleId: 'ACT Rule b4f0c3',
    name: 'Image button has accessible name',
    sc: 'WCAG 2.1/2.2 SC 1.1.1 & 4.1.2 (Level A)',
    aspects: 'DOM Tree · Accessibility Tree',
    codeBefore: '<input type="image" src="/icons/search.png">',
    codeAfter: '<input type="image" src="/icons/search.png" alt="Search product catalog">',
    errorSnippet: 'Expectation 1 failed: Element has an empty computed accessible name.',
    fixAction: 'Add alt="Search product catalog"'
  },
  {
    id: 'rule-afw4f7',
    ruleId: 'ACT Rule afw4f7',
    name: 'Text has minimum contrast ratio',
    sc: 'WCAG 2.1/2.2 SC 1.4.3 (Level AA)',
    aspects: 'DOM Tree · CSS Styling',
    codeBefore: '<p style="color: #94a3b8; background-color: #ffffff;">Terms of Service</p>',
    codeAfter: '<p style="color: #475569; background-color: #ffffff;">Terms of Service</p>',
    errorSnippet: 'Expectation 1 failed: Contrast ratio is 2.42:1, which is below 4.5:1 for normal text.',
    fixAction: 'Darken color to #475569 (5.84:1 ratio)'
  },
  {
    id: 'rule-6cfa84',
    ruleId: 'ACT Rule 6cfa84',
    name: 'Element with lang has valid BCP 47 language tag',
    sc: 'WCAG 2.1/2.2 SC 3.1.1 (Level A)',
    aspects: 'DOM Tree',
    codeBefore: '<html lang="en-ZZZ">',
    codeAfter: '<html lang="en">',
    errorSnippet: 'Expectation 1 failed: "en-ZZZ" is not a well-formed IANA BCP 47 language subtag.',
    fixAction: 'Correct language attribute to lang="en"'
  },
  {
    id: 'rule-97a4e1',
    ruleId: 'ACT Rule 97a4e1',
    name: 'Button has non-empty accessible name',
    sc: 'WCAG 2.1/2.2 SC 4.1.2 (Level A)',
    aspects: 'Accessibility Tree',
    codeBefore: '<button aria-label="   "><svg aria-hidden="true">...</svg></button>',
    codeAfter: '<button aria-label="Close modal dialog"><svg aria-hidden="true">...</svg></button>',
    errorSnippet: 'Expectation 1 failed: aria-label contains only whitespace; computed name is empty.',
    fixAction: 'Replace whitespace with aria-label="Close modal dialog"'
  }
];

export default function ActRulesLinterLab() {
  const [fixedRules, setFixedRules] = useState({
    'rule-b4f0c3': false,
    'rule-afw4f7': false,
    'rule-6cfa84': false,
    'rule-97a4e1': false
  });

  const fixedCount = Object.values(fixedRules).filter(Boolean).length;
  const isCiPassing = fixedCount === ACT_RULES.length;

  const handleFixRule = (id) => {
    soundManager.playClick();
    setFixedRules(prev => {
      const updated = { ...prev, [id]: true };
      if (Object.values(updated).filter(Boolean).length === ACT_RULES.length) {
        soundManager.playCorrect();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
      return updated;
    });
  };

  const handleFixAll = () => {
    soundManager.playClick();
    setFixedRules({
      'rule-b4f0c3': true,
      'rule-afw4f7': true,
      'rule-6cfa84': true,
      'rule-97a4e1': true
    });
    soundManager.playCorrect();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    soundManager.playClick();
    setFixedRules({
      'rule-b4f0c3': false,
      'rule-afw4f7': false,
      'rule-6cfa84': false,
      'rule-97a4e1': false
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Info */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Code size={18} color="var(--arcade-green)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Automated Linters & W3C ACT (Accessibility Conformance Testing) Rules Lab
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          WAS Domain 2 covers testing tools and the W3C ACT Rules Format 1.0. ACT Rules harmonize accessibility testing
          tools (axe-core, ARC, Lighthouse) to ensure that automated tests are transparent, reproducible, and vendor-neutral.
          Debug 4 code snippets failing official ACT Rules and unblock the CI/CD build gate.
        </p>
      </div>

      {/* CI/CD Build Gate Simulator */}
      <div style={{ background: '#090d16', border: `1px solid ${isCiPassing ? '#10b981' : '#ef4444'}`, borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitPullRequest size={16} color={isCiPassing ? 'var(--arcade-green)' : '#ef4444'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
              PR #142: Core Navigation & Form Updates (GitHub Actions CI)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleFixAll}
              className="secondary-btn"
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Sparkles size={12} color="var(--arcade-gold)" />
              <span>Remediate All ACT Rules</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="secondary-btn"
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Build Status Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', borderRadius: '4px', background: isCiPassing ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${isCiPassing ? 'var(--arcade-green)' : '#ef4444'}` }}>
          {isCiPassing ? <CheckCircle2 size={16} color="var(--arcade-green)" /> : <XCircle size={16} color="#ef4444" />}
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isCiPassing ? '#4ade80' : '#f87171' }}>
            {isCiPassing ? 'CI BUILD PASSED ✓ — All 4 W3C ACT Rule expectations satisfied. Merge permitted.' : `BUILD FAILED ✗ — ${ACT_RULES.length - fixedCount} ACT Rule violations blocking deployment.`}
          </span>
        </div>
      </div>

      {/* 4 ACT Rule Inspection Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {ACT_RULES.map(rule => {
          const isFixed = fixedRules[rule.id];
          return (
            <div
              key={rule.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--arcade-cyan)', fontFamily: 'monospace' }}>
                      {rule.ruleId}
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                      Aspects: {rule.aspects}
                    </span>
                  </div>
                  <h5 style={{ margin: '0.2rem 0 0 0', fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {rule.name}
                  </h5>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                    Maps to: <strong>{rule.sc}</strong>
                  </div>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', background: isFixed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isFixed ? 'var(--arcade-green)' : '#f87171', border: `1px solid ${isFixed ? 'var(--arcade-green)' : '#ef4444'}` }}>
                  {isFixed ? 'PASSED ✓' : 'FAILED ✗'}
                </span>
              </div>

              {/* Code Snippet Box */}
              <div style={{ background: '#0a0f1d', padding: '0.5rem 0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem', color: isFixed ? '#4ade80' : '#f87171', overflowX: 'auto' }}>
                {isFixed ? rule.codeAfter : rule.codeBefore}
              </div>

              {/* Diagnostic Error Message */}
              {!isFixed ? (
                <div style={{ fontSize: '0.78rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.08)', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                  {rule.errorSnippet}
                </div>
              ) : (
                <div style={{ fontSize: '0.78rem', color: 'var(--arcade-green)', background: 'rgba(16, 185, 129, 0.08)', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                  ✓ Remediated: Code satisfies all ACT Rule applicability and expectation clauses.
                </div>
              )}

              {/* Action Button */}
              {!isFixed && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.35rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => handleFixRule(rule.id)}
                    className="primary-btn"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Check size={14} />
                    <span>{rule.fixAction}</span>
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
