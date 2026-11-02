import React, { useState } from 'react';
import { Layers, CheckCircle2, XCircle, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const PRINCIPLES = [
  { id: 'p1', name: '1. Equitable Use', desc: 'Marketable & useful to people with diverse abilities; avoids segregating any users.' },
  { id: 'p2', name: '2. Flexibility in Use', desc: 'Accommodates a wide range of individual preferences & abilities.' },
  { id: 'p3', name: '3. Simple & Intuitive', desc: 'Easy to understand regardless of user experience, language, or focus.' },
  { id: 'p4', name: '4. Perceptible Info', desc: 'Communicates necessary information effectively through redundant sensory channels.' },
  { id: 'p5', name: '5. Tolerance for Error', desc: 'Minimizes hazards & adverse consequences of accidental actions.' },
  { id: 'p6', name: '6. Low Physical Effort', desc: 'Can be used efficiently and comfortably with minimum fatigue.' },
  { id: 'p7', name: '7. Size & Space', desc: 'Appropriate size & space for approach, reach, manipulation regardless of user body.' }
];

const SCENARIOS = [
  {
    id: 'sc-p1',
    item: 'Automatic sliding entrance doors in a supermarket providing equal access for wheelchair users, parents with strollers, and shoppers carrying heavy bags without separate entrances.',
    correctPrinciple: 'p1',
    explanation: 'Principle 1 (Equitable Use): Provides the exact same seamless means of entrance for all individuals without segregation or stigma.'
  },
  {
    id: 'sc-p2',
    item: 'Left-and-right ambidextrous computer mouse and customizable video playback speed controls (0.75x to 2.0x).',
    correctPrinciple: 'p2',
    explanation: 'Principle 2 (Flexibility in Use): Accommodates user choice in methods of use and pace.'
  },
  {
    id: 'sc-p3',
    item: 'Airport terminal directional signs utilizing internationally standardized pictograms and clear visual iconography that require no reading ability.',
    correctPrinciple: 'p3',
    explanation: 'Principle 3 (Simple and Intuitive Use): Eliminates unnecessary complexity and bridges language or literacy barriers.'
  },
  {
    id: 'sc-p4',
    item: 'Crosswalk pedestrian signals that output synchronized bright walk lights, audible chirping audio cues, and vibrating tactile push-buttons.',
    correctPrinciple: 'p4',
    explanation: 'Principle 4 (Perceptible Information): Employs redundant sensory modes (visual, audible, and tactile) to ensure critical information is received.'
  },
  {
    id: 'sc-p5',
    item: 'Email client featuring an "Undo Send" countdown toast notification and a prominent confirmation prompt before permanently deleting archives.',
    correctPrinciple: 'p5',
    explanation: 'Principle 5 (Tolerance for Error): Warns of hazards and provides reversible actions for inadvertent mistakes.'
  },
  {
    id: 'sc-p6',
    item: 'Lever-style door handles replacing round brass knobs that can be easily pushed down with a closed fist, elbow, or minimal grip strength.',
    correctPrinciple: 'p6',
    explanation: 'Principle 6 (Low Physical Effort): Allows operation with minimal operating force, avoiding pinching, twisting of the wrist, or physical exertion.'
  },
  {
    id: 'sc-p7',
    item: 'Transit subway fare turnstiles wide enough to accommodate motorized power wheelchairs, service animals, luggage, and strollers comfortably.',
    correctPrinciple: 'p7',
    explanation: 'Principle 7 (Size and Space for Approach and Use): Ensures adequate clear floor space and reach dimensions for any user regardless of seated or standing posture.'
  }
];

export default function UniversalDesignSorter() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedP, setSelectedP] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [completedMap, setCompletedMap] = useState({});

  const scenario = SCENARIOS[currentIdx];
  const isDone = completedMap[scenario.id] !== undefined;

  const handleSelect = (pId) => {
    if (feedback) return;
    setSelectedP(pId);
    soundManager.playClick();
  };

  const handleCheck = () => {
    if (!selectedP) return;
    const isCorrect = selectedP === scenario.correctPrinciple;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 1);
    } else {
      soundManager.playIncorrect();
    }

    setFeedback({
      isCorrect,
      explanation: scenario.explanation
    });

    setCompletedMap(prev => ({
      ...prev,
      [scenario.id]: isCorrect
    }));
  };

  const handleNext = () => {
    if (currentIdx < SCENARIOS.length - 1) {
      soundManager.playClick();
      setCurrentIdx(prev => prev + 1);
      setSelectedP(null);
      setFeedback(null);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setCurrentIdx(0);
    setSelectedP(null);
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
            <Layers size={22} color="var(--arcade-purple)" />
            <span>Universal Design 7 Principles Sorter</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Map real-world design innovations to North Carolina State University's 7 Principles of Universal Design.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>Score: </span>
            <span style={{ color: 'var(--arcade-green)' }}>{score}</span> / {SCENARIOS.length}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="secondary-btn"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Scenario Card */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-purple)', textTransform: 'uppercase' }}>
            Case Study {currentIdx + 1} of {SCENARIOS.length}
          </span>
          {isDone && (
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', background: completedMap[scenario.id] ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: completedMap[scenario.id] ? '#10b981' : '#ef4444' }}>
              {completedMap[scenario.id] ? 'CORRECT ✓' : 'REVIEW ✗'}
            </span>
          )}
        </div>

        <blockquote style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-primary)', background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--arcade-purple)', padding: '1rem 1.25rem', borderRadius: '4px', margin: 0 }}>
          "{scenario.item}"
        </blockquote>

        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
          Which Universal Design principle is most prominently demonstrated?
        </p>

        {/* Principles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {PRINCIPLES.map((p) => {
            const isSelected = selectedP === p.id;
            const isCorrect = scenario.correctPrinciple === p.id;
            let borderStyle = '1px solid var(--border-color)';
            let bgStyle = 'var(--bg-surface-elevated)';

            if (feedback) {
              if (isCorrect) {
                borderStyle = '2px solid #10b981';
                bgStyle = 'rgba(16, 185, 129, 0.15)';
              } else if (isSelected && !feedback.isCorrect) {
                borderStyle = '2px solid #ef4444';
                bgStyle = 'rgba(239, 68, 68, 0.15)';
              }
            } else if (isSelected) {
              borderStyle = '2px solid var(--arcade-purple)';
              bgStyle = 'rgba(192, 132, 252, 0.15)';
            }

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id)}
                disabled={feedback !== null}
                style={{
                  background: bgStyle,
                  border: borderStyle,
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  cursor: feedback ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {p.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        {!feedback ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleCheck}
              disabled={!selectedP}
              className="primary-btn"
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem', opacity: selectedP ? 1 : 0.5, cursor: selectedP ? 'pointer' : 'not-allowed' }}
            >
              Confirm Principle Match
            </button>
          </div>
        ) : (
          <div style={{ padding: '1rem', borderRadius: '6px', background: feedback.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}`, display: 'flex', flexDirection: 'column', gap: '0.5rem', animation: 'fadeIn 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: feedback.isCorrect ? '#10b981' : '#ef4444' }}>
              {feedback.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              <span>{feedback.isCorrect ? 'Correct Alignment!' : 'Incorrect Principle'}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
              {feedback.explanation}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              {currentIdx < SCENARIOS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="primary-btn"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>Next Principle</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReset}
                  className="secondary-btn"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  Start Over
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
