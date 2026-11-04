import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const MODELS = [
  {
    id: 'social',
    name: 'Social Model',
    tagline: 'Barriers in society disable the person',
    badgeColor: '#10b981',
    description: 'Disability is caused by societal barriers (architectural, digital, systemic, attitudinal), not the individual’s impairment. The solution is removing barriers to enable full participation.'
  },
  {
    id: 'medical',
    name: 'Medical Model',
    tagline: 'Deficit within the individual needing a cure',
    badgeColor: '#f87171',
    description: 'Disability is viewed as an illness, pathology, or individual physiological flaw. Focuses solely on medical treatments, therapies, or curing the individual to adapt to society.'
  },
  {
    id: 'biopsychosocial',
    name: 'Biopsychosocial Model',
    tagline: 'Integrated WHO ICF framework',
    badgeColor: '#38bdf8',
    description: 'Synthesizes biological impairment, personal psychological experience, and social context. Recognizes health conditions while treating participation barriers as interactive.'
  },
  {
    id: 'functional',
    name: 'Functional Solutions Model',
    tagline: 'Practical engineering & technology focus',
    badgeColor: '#c084fc',
    description: 'Pragmatic approach focusing on technological innovation, adaptive equipment, and functional workarounds without engaging in socio-political debates.'
  },
  {
    id: 'charity',
    name: 'Charity / Tragedy Model',
    tagline: 'Disabled persons as victims needing pity',
    badgeColor: '#f59e0b',
    description: 'Frames people with disabilities as unfortunate, helpless victims who depend on the benevolence, sympathy, or inspiration of non-disabled benefactors.'
  }
];

const SCENARIOS = [
  {
    id: 'sc-1',
    scenario: 'A public library lacks a wheelchair ramp. When a patron cannot enter, the director says: "If only their spinal injury could be healed, they could easily walk up our beautiful stone steps."',
    correctModel: 'medical',
    explanation: 'Focuses exclusively on the person’s physical body and inability to walk as the flaw, rather than recognizing the library’s architectural stairs as the disabling barrier.'
  },
  {
    id: 'sc-2',
    scenario: 'A university redesigns its student portal with keyboard navigation, clear ARIA landmarks, and 4.5:1 contrast, asserting that inaccessible software is what excludes blind and motor-impaired students.',
    correctModel: 'social',
    explanation: 'Exemplifies the Social Model: it identifies the digital environment as the disabling barrier and removes that barrier so all students can participate independently.'
  },
  {
    id: 'sc-3',
    scenario: 'A rehabilitation clinic evaluates a stroke survivor by assessing their neurological recovery, their cognitive emotional resilience, and their ability to rejoin their local community sports team.',
    correctModel: 'biopsychosocial',
    explanation: 'Aligns with the Biopsychosocial Model (WHO ICF) by integrating physiological recovery (bio), psychological coping (psycho), and community participation (social).'
  },
  {
    id: 'sc-4',
    scenario: 'An engineering team designs a low-cost 3D-printed motorized switch mount for tablets so a gamer with quadriplegia can play video games using head gestures.',
    correctModel: 'functional',
    explanation: 'This is the Functional Solutions Model: developing tangible practical engineering solutions and assistive technology to bridge functional limitations.'
  },
  {
    id: 'sc-5',
    scenario: 'A holiday TV telethon shows tearful slow-motion footage of disabled children, appealing to viewers to "donate generously out of the kindness of your hearts to comfort these tragic souls."',
    correctModel: 'charity',
    explanation: 'The Charity/Tragedy Model portrays people with disabilities as pitiful victims to elicit emotional donations, denying them dignity, agency, and rights.'
  }
];

export default function DisabilityModelClassifier() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredMap, setAnsweredMap] = useState({});

  const currentScenario = SCENARIOS[currentIndex];
  const isLastScenario = currentIndex === SCENARIOS.length - 1;

  const handleSelectModel = (modelId) => {
    if (feedback) return; // Prevent changing after submission
    setSelectedModel(modelId);
    soundManager.playClick();
  };

  const handleCheckAnswer = () => {
    if (!selectedModel) return;
    const isCorrect = selectedModel === currentScenario.correctModel;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 1);
    } else {
      soundManager.playIncorrect();
    }

    setFeedback({
      isCorrect,
      explanation: currentScenario.explanation
    });

    setAnsweredMap(prev => ({
      ...prev,
      [currentScenario.id]: isCorrect
    }));
  };

  const handleNext = () => {
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedModel(null);
      setFeedback(null);
      soundManager.playClick();
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedModel(null);
    setFeedback(null);
    setScore(0);
    setAnsweredMap({});
    soundManager.playClick();
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🏛️</span>
            <span>Disability Model Classifier Lab</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Diagnose real-world scenarios and classify which theoretical framework is guiding the policy or statement.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>Score: </span>
            <span style={{ color: 'var(--arcade-green)' }}>{score}</span> / <span>{SCENARIOS.length}</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="secondary-btn"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Reset interactive"
          >
            <RefreshCw size={14} />
            <span>Restart Lab</span>
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {SCENARIOS.map((sc, idx) => {
          const isCurrent = idx === currentIndex;
          const status = answeredMap[sc.id];
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setSelectedModel(null);
                setFeedback(null);
              }}
              style={{
                flex: 1,
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: status === true
                  ? 'var(--arcade-green)'
                  : status === false
                  ? 'var(--arcade-crimson)'
                  : isCurrent
                  ? 'var(--arcade-cyan)'
                  : 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              aria-label={`Scenario ${idx + 1} of ${SCENARIOS.length}`}
            />
          );
        })}
      </div>

      {/* Main Scenario Card */}
      <div
        className="card"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Scenario {currentIndex + 1} of {SCENARIOS.length}
          </span>
          {answeredMap[currentScenario.id] !== undefined && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              background: answeredMap[currentScenario.id] ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: answeredMap[currentScenario.id] ? '#10b981' : '#ef4444'
            }}>
              {answeredMap[currentScenario.id] ? 'CORRECT ✓' : 'REVIEW NEEDED ✗'}
            </span>
          )}
        </div>

        <blockquote
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            background: 'var(--bg-surface-elevated)',
            borderLeft: '4px solid var(--arcade-cyan)',
            padding: '1rem 1.25rem',
            borderRadius: '4px',
            margin: 0,
            fontStyle: 'italic'
          }}
        >
          "{currentScenario.scenario}"
        </blockquote>

        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Which theoretical model of disability is exhibited here?
        </p>

        {/* Models Grid Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {MODELS.map((model) => {
            const isSelected = selectedModel === model.id;
            const isCorrectModel = currentScenario.correctModel === model.id;
            let borderStyle = '1px solid var(--border-color)';
            let bgStyle = 'var(--bg-surface-elevated)';

            if (feedback) {
              if (isCorrectModel) {
                borderStyle = '2px solid #10b981';
                bgStyle = 'rgba(16, 185, 129, 0.15)';
              } else if (isSelected && !feedback.isCorrect) {
                borderStyle = '2px solid #ef4444';
                bgStyle = 'rgba(239, 68, 68, 0.15)';
              }
            } else if (isSelected) {
              borderStyle = `2px solid ${model.badgeColor}`;
              bgStyle = 'rgba(56, 189, 248, 0.15)';
            }

            return (
              <button
                key={model.id}
                type="button"
                onClick={() => handleSelectModel(model.id)}
                disabled={feedback !== null}
                style={{
                  background: bgStyle,
                  border: borderStyle,
                  borderRadius: '6px',
                  padding: '0.9rem',
                  textAlign: 'left',
                  cursor: feedback ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: model.badgeColor }}>
                    {model.name}
                  </span>
                  {isSelected && !feedback && (
                    <span style={{ fontSize: '0.8rem', color: model.badgeColor }}>●</span>
                  )}
                  {feedback && isCorrectModel && (
                    <CheckCircle2 size={16} color="#10b981" />
                  )}
                  {feedback && isSelected && !feedback.isCorrect && (
                    <XCircle size={16} color="#ef4444" />
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {model.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        {!feedback ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={!selectedModel}
              className="primary-btn"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                opacity: selectedModel ? 1 : 0.5,
                cursor: selectedModel ? 'pointer' : 'not-allowed'
              }}
            >
              Verify Diagnosis
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '6px',
              background: feedback.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              animation: 'fadeIn 0.2s ease-in'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {feedback.isCorrect ? (
                <>
                  <CheckCircle2 size={20} color="#10b981" />
                  <span style={{ fontWeight: 800, color: '#10b981', fontSize: '1rem' }}>
                    Excellent Analysis!
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={20} color="#ef4444" />
                  <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '1rem' }}>
                    Incorrect Model
                  </span>
                </>
              )}
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
              {feedback.explanation}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              {!isLastScenario ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="primary-btn"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>Next Scenario</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--arcade-green)', fontWeight: 700 }}>
                    Lab Complete!
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="secondary-btn"
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Model Reference Sheet Collapsible */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          💡 IAAP CPACC Model Quick Reference
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
          {MODELS.map(m => (
            <div key={m.id} style={{ padding: '0.5rem', borderLeft: `3px solid ${m.badgeColor}`, background: 'rgba(255,255,255,0.02)' }}>
              <strong style={{ color: m.badgeColor }}>{m.name}: </strong>
              <span style={{ color: 'var(--text-muted)' }}>{m.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
