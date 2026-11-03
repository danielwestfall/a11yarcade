import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  Terminal,
  Cpu,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const PIPELINE_GATES = [
  {
    id: 'lint-gate',
    name: 'Pre-Commit Linter Gate (eslint-plugin-jsx-a11y)',
    coverage: '10-15% of WCAG criteria',
    detects: 'Missing alt tags, duplicate IDs, invalid ARIA attributes, non-interactive handlers',
    misses: 'Meaningful alt quality, keyboard trap states, color contrast on rendered canvas'
  },
  {
    id: 'ci-axe-gate',
    name: 'CI/CD Automated DOM Scanner (axe-core / Playwright)',
    coverage: '30-40% of WCAG criteria',
    detects: 'DOM contrast ratios, missing form labels, ARIA hierarchy errors, landmark nesting',
    misses: 'Screen reader announcement timing, logical focus order after modal open, video caption accuracy'
  },
  {
    id: 'manual-qa-gate',
    name: 'Staging Manual Protocol (Keyboard + Screen Reader)',
    coverage: '60-70% of WCAG criteria',
    detects: 'Keyboard trap loops, screen reader focus order, zoom reflow up to 400%, dynamic aria-live announcements',
    misses: 'Fast PR turnarounds if unassisted by automated pre-screening'
  }
];

export default function A11yQaRegressionMatrixLab() {
  const [activeGates, setActiveGates] = useState({
    linter: true,
    ciAxe: true,
    manualQa: false
  });
  const [pipelineState, setPipelineState] = useState('idle'); // 'idle' | 'running' | 'success' | 'failure'
  const [findings, setFindings] = useState([]);

  const toggleGate = (key) => {
    soundManager.playClick();
    setActiveGates(prev => ({ ...prev, [key]: !prev[key] }));
    setPipelineState('idle');
    setFindings([]);
  };

  const handleRunPipeline = () => {
    soundManager.playAuditPing();
    setPipelineState('running');

    setTimeout(() => {
      const results = [];
      let passed = true;

      if (activeGates.linter) {
        results.push({ gate: 'Linter', status: 'PASS', msg: 'Zero static JSX ARIA attribute syntax errors.' });
      }

      if (activeGates.ciAxe) {
        results.push({ gate: 'CI axe-core', status: 'PASS', msg: 'Automated scan found 0 machine-detectable contrast or label violations.' });
      }

      // Check if manual QA gate was omitted
      if (!activeGates.manualQa) {
        passed = false;
        results.push({
          gate: 'Production Release Risk',
          status: 'FAIL',
          msg: 'CRITICAL REGRESSION: Checkout modal creates a keyboard trap loop and fails 200% text reflow. Machine tools only catch 30-40% of WCAG criteria!'
        });
      } else {
        results.push({
          gate: 'Manual Testing Gate',
          status: 'PASS',
          msg: 'Manual QA verified NVDA focus trap dismissal, Tab key order, and 400% zoom reflow.'
        });
      }

      setFindings(results);
      if (passed) {
        setPipelineState('success');
        soundManager.playCorrect();
        confetti({ particleCount: 50, spread: 70 });
      } else {
        setPipelineState('failure');
        soundManager.playIncorrect();
      }
    }, 700);
  };

  const handleReset = () => {
    soundManager.playClick();
    setActiveGates({ linter: true, ciAxe: true, manualQa: false });
    setPipelineState('idle');
    setFindings([]);
  };

  return (
    <section aria-label="Accessibility QA Regression Simulator" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <GitPullRequest size={20} aria-hidden="true" />
          Accessibility Quality Assurance & Regression Integration
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Modern accessibility QA integrates into every software release lifecycle phase. Automated test suites (e.g. axe-core) catch 30–40% of WCAG failures, while manual keyboard and screen reader verification prevents complex interaction regressions from reaching production.
        </p>
      </div>

      {/* Pipeline Gates Config */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Configure Continuous Integration Gates
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          {/* Gate 1 */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-gate-linter"
              checked={activeGates.linter}
              onChange={() => toggleGate('linter')}
              style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
            />
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Gate 1: Pre-Commit Linter (eslint-plugin-jsx-a11y)</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Catches static syntax errors, unassigned labels, and missing alt attributes.</div>
            </div>
          </label>

          {/* Gate 2 */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-gate-axe"
              checked={activeGates.ciAxe}
              onChange={() => toggleGate('ciAxe')}
              style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
            />
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Gate 2: Automated CI/CD DOM Auditor (axe-core / Playwright)</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evaluates rendered DOM trees for contrast ratios, ARIA hierarchy, and duplicate IDs.</div>
            </div>
          </label>

          {/* Gate 3 */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-gate-manual"
              checked={activeGates.manualQa}
              onChange={() => toggleGate('manualQa')}
              style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
            />
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Gate 3: Manual Testing Protocol (Screen Reader & Keyboard Verification)</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verifies keyboard focus traps, logical tab flow, reflow zoom at 400%, and announcement clarity.</div>
            </div>
          </label>
        </div>
      </fieldset>

      {/* Trigger Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={handleRunPipeline}
          disabled={pipelineState === 'running'}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--arcade-yellow)',
            color: '#000',
            fontWeight: 800,
            cursor: pipelineState === 'running' ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Play size={18} aria-hidden="true" />
          {pipelineState === 'running' ? 'Executing Pipeline Test Suite...' : 'Trigger CI/CD Pipeline & Evaluate Release'}
        </button>

        <button
          type="button"
          onClick={handleReset}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            border: '1px solid var(--arcade-border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <RotateCcw size={16} aria-hidden="true" />
          Reset Gates
        </button>
      </div>

      {/* Pipeline Output */}
      {findings.length > 0 && (
        <div
          role="region"
          aria-live="polite"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '1.25rem',
            borderRadius: '8px',
            border: `2px solid ${pipelineState === 'success' ? 'var(--arcade-green)' : '#ef4444'}`,
            background: pipelineState === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {pipelineState === 'success' ? (
              <CheckCircle2 size={22} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
            ) : (
              <XCircle size={22} style={{ color: '#ef4444' }} aria-hidden="true" />
            )}
            <h4 style={{ margin: 0, fontSize: '1rem', color: pipelineState === 'success' ? 'var(--arcade-green)' : '#ef4444' }}>
              {pipelineState === 'success' ? 'PIPELINE PASSED: ZERO ESCAPED REGRESSIONS' : 'PIPELINE FAILED: UNDETECTED INTERACTION REGRESSION ESCAPED'}
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {findings.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '4px',
                  background: 'var(--arcade-surface)',
                  border: '1px solid var(--arcade-border)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ fontWeight: 700, color: item.status === 'PASS' ? 'var(--arcade-green)' : '#ef4444' }}>
                  [{item.gate}]: {item.status}
                </div>
                <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>{item.msg}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
