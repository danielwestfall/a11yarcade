import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const DEFECTS = [
  {
    id: 'def-1',
    defect: 'On the final payment page, the "Submit Payment" button has tabindex="-1" and cannot be reached via keyboard or screen reader, completely preventing blind and motor-impaired users from buying products.',
    correctLevel: 'blocker',
    explanation: 'Blocker (Critical): Completely stops users from completing a fundamental core business transaction. There is zero workaround.'
  },
  {
    id: 'def-2',
    defect: 'An image of the CEO on the "About Us" page has alt="Photo" instead of "Photo of CEO Elena Rostova delivering company remarks".',
    correctLevel: 'minor',
    explanation: 'Minor / Low Severity: While technically a WCAG 1.1.1 defect, it is purely biographical/supplemental and does not impair core application functionality.'
  },
  {
    id: 'def-3',
    defect: 'The main navigation dropdown menu cannot be opened using the keyboard. However, all links within the dropdown are also present as flat text links in the footer.',
    correctLevel: 'serious',
    explanation: 'Serious (High): Significant functional impediment causing high user frustration, but an alternative workaround route exists via the footer.'
  },
  {
    id: 'def-4',
    defect: 'A video tutorial has accurate synchronized closed captions, but lacks a full secondary downloadable transcript.',
    correctLevel: 'moderate',
    explanation: 'Moderate: Deaf users can fully understand the content via captions (WCAG 1.2.2 AA pass), though deafblind users relying on braille would benefit from a transcript.'
  }
];

const SEVERITY_LEVELS = [
  { id: 'blocker', label: 'Blocker (P1)', color: '#ef4444', desc: 'Prevents completion of core tasks; zero workaround' },
  { id: 'serious', label: 'Serious (P2)', color: '#f59e0b', desc: 'Major barrier; cumbersome workaround exists' },
  { id: 'moderate', label: 'Moderate (P3)', color: '#38bdf8', desc: 'Notable inconvenience or minor missing context' },
  { id: 'minor', label: 'Minor / Low (P4)', color: '#10b981', desc: 'Cosmetic or non-essential content defect' }
];

export default function IssueSeverityTriageLab() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [completedMap, setCompletedMap] = useState({});

  const defect = DEFECTS[currentIdx];

  const handleSelectLevel = (levelId) => {
    if (feedback) return;
    setSelectedLevel(levelId);
    soundManager.playClick();
  };

  const handleCheck = () => {
    if (!selectedLevel) return;
    const isCorrect = selectedLevel === defect.correctLevel;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 1);
    } else {
      soundManager.playIncorrect();
    }

    setFeedback({
      isCorrect,
      explanation: defect.explanation
    });

    setCompletedMap(prev => ({
      ...prev,
      [defect.id]: isCorrect
    }));
  };

  const handleNext = () => {
    if (currentIdx < DEFECTS.length - 1) {
      soundManager.playClick();
      setCurrentIdx(prev => prev + 1);
      setSelectedLevel(null);
      setFeedback(null);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setCurrentIdx(0);
    setSelectedLevel(null);
    setFeedback(null);
    setScore(0);
    setCompletedMap({});
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={22} color="var(--arcade-crimson)" />
            <span>Accessibility Defect Severity & Triage Lab</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Learn how to prioritize remediation backlogs per WAS Domain 3 guidelines (Blocker, Serious, Moderate, Minor).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>Score: </span>
            <span style={{ color: 'var(--arcade-green)' }}>{score}</span> / {DEFECTS.length}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="secondary-btn"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-crimson)', textTransform: 'uppercase' }}>
            Defect Bug Report {currentIdx + 1} of {DEFECTS.length}
          </span>
          {completedMap[defect.id] !== undefined && (
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', background: completedMap[defect.id] ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: completedMap[defect.id] ? '#10b981' : '#ef4444' }}>
              {completedMap[defect.id] ? 'CORRECT TRIAGE ✓' : 'MISCLASSIFIED ✗'}
            </span>
          )}
        </div>

        <blockquote style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)', background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--arcade-crimson)', padding: '1rem 1.25rem', borderRadius: '4px', margin: 0 }}>
          "{defect.defect}"
        </blockquote>

        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
          What severity level should be assigned in the issue tracker?
        </p>

        {/* Severity Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {SEVERITY_LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            const isCorrect = defect.correctLevel === lvl.id;
            let border = '1px solid var(--border-color)';
            let bg = 'var(--bg-surface-elevated)';

            if (feedback) {
              if (isCorrect) {
                border = '2px solid #10b981';
                bg = 'rgba(16, 185, 129, 0.15)';
              } else if (isSelected && !feedback.isCorrect) {
                border = '2px solid #ef4444';
                bg = 'rgba(239, 68, 68, 0.15)';
              }
            } else if (isSelected) {
              border = `2px solid ${lvl.color}`;
              bg = `${lvl.color}20`;
            }

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleSelectLevel(lvl.id)}
                disabled={feedback !== null}
                style={{
                  background: bg,
                  border: border,
                  borderRadius: '6px',
                  padding: '0.85rem',
                  textAlign: 'left',
                  cursor: feedback ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: lvl.color }}>
                  {lvl.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {lvl.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Buttons / Feedback */}
        {!feedback ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleCheck}
              disabled={!selectedLevel}
              className="primary-btn"
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem', opacity: selectedLevel ? 1 : 0.5, cursor: selectedLevel ? 'pointer' : 'not-allowed' }}
            >
              Confirm Severity Rating
            </button>
          </div>
        ) : (
          <div style={{ padding: '1rem', borderRadius: '6px', background: feedback.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}`, display: 'flex', flexDirection: 'column', gap: '0.5rem', animation: 'fadeIn 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: feedback.isCorrect ? '#10b981' : '#ef4444' }}>
              <CheckCircle2 size={18} />
              <span>{feedback.isCorrect ? 'Accurate Triage Assessment!' : 'Severity Rating Mismatch'}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
              {feedback.explanation}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              {currentIdx < DEFECTS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="primary-btn"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>Next Bug Report</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReset}
                  className="secondary-btn"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  Restart Triage
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
