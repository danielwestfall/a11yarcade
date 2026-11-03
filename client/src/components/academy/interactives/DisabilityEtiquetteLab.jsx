import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Heart,
  Dog,
  Eye,
  VolumeX,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const SCENARIOS = [
  {
    id: 'service-dog',
    title: '1. Service Animal Interaction',
    icon: Dog,
    context: 'You enter a corporate conference room for a project kickoff meeting. A new team member arrives accompanied by a golden retriever wearing a service harness and "Working Dog — Do Not Pet" badge.',
    question: 'How should you and your team conduct yourselves regarding the service animal?',
    options: [
      {
        id: 'A',
        text: 'Walk over, crouch down, pet the dog warmly, and offer a small piece of bagel to make the dog feel welcome in the office.',
        isCorrect: false,
        feedback: 'Incorrect. You must NEVER pet, feed, speak to, or distract a working service dog. The dog is on active duty monitoring the handler\'s safety or medical cues (e.g. seizure detection or navigation).'
      },
      {
        id: 'B',
        text: 'Greet the colleague directly, address them as you would any other colleague, completely ignore the working dog, and do not pet or distract the animal.',
        isCorrect: true,
        feedback: 'Correct! Working service animals are actively performing essential assistive tasks. Always greet the human handler directly and ignore the working animal so their focus remains on the handler.'
      },
      {
        id: 'C',
        text: 'Ask the colleague to provide medical documentation proving their disability before allowing the dog to stay in the meeting room.',
        isCorrect: false,
        feedback: 'Incorrect. Asking for personal medical records violates civil rights laws (e.g., ADA Title I/III). Handlers cannot be interrogated regarding private diagnoses.'
      }
    ]
  },
  {
    id: 'wheelchair-etiquette',
    title: '2. Mobility Devices & Physical Space',
    icon: Users,
    context: 'You are having an extended 25-minute strategy discussion in the hallway with a colleague who uses a motorized wheelchair.',
    question: 'What is the most respectful and accessible physical posture and conduct?',
    options: [
      {
        id: 'A',
        text: 'Lean comfortably against the armrest of the wheelchair, or place your laptop on their lap tray while talking.',
        isCorrect: false,
        feedback: 'Incorrect. A person\'s wheelchair, white cane, or assistive device is an extension of their personal bodily space. Leaning on or touching someone\'s mobility device without consent is a violation of personal boundaries.'
      },
      {
        id: 'B',
        text: 'Pull up a chair or sit down so you are conversing at eye level, and never touch or lean on their wheelchair without explicit permission.',
        isCorrect: true,
        feedback: 'Correct! Speaking at eye level prevents neck strain for the wheelchair user and eliminates paternalistic power dynamics. Always treat assistive devices as personal body space.'
      },
      {
        id: 'C',
        text: 'Helpfully grab the push handles and push them to an empty room to save them the effort of driving their wheelchair.',
        isCorrect: false,
        feedback: 'Incorrect. Never grab, steer, or push someone\'s wheelchair without being explicitly asked. Pushing someone without their consent strips them of their autonomy and can cause injury.'
      }
    ]
  },
  {
    id: 'deaf-asl-interpreter',
    title: '3. Communicating with Deaf Colleagues via ASL',
    icon: VolumeX,
    context: 'You are conducting an engineering interview with a Deaf candidate who is accompanied by a professional American Sign Language (ASL) interpreter.',
    question: 'Where should your eye contact and verbal address be directed during the interview?',
    options: [
      {
        id: 'A',
        text: 'Look directly at the interpreter and say: "Can you ask him to describe his experience with React and state management?"',
        isCorrect: false,
        feedback: 'Incorrect. Speaking to the interpreter ("tell him", "ask her") treats the Deaf candidate as an invisible third party. The interpreter is a neutral communication conduit.'
      },
      {
        id: 'B',
        text: 'Look directly at the Deaf candidate, maintain direct eye contact with them, and speak directly in the first person ("What is your experience with React?").',
        isCorrect: true,
        feedback: 'Correct! Always address the person with the disability directly ("you") and maintain eye contact with them. The interpreter will voice what the candidate signs and sign what you speak.'
      },
      {
        id: 'C',
        text: 'Speak in an exaggeratedly loud shouting voice and over-enunciate your lips while ignoring both the candidate and interpreter.',
        isCorrect: false,
        feedback: 'Incorrect. Shouting does not assist a Deaf individual and distorts natural lip shapes, making lip reading harder while being disrespectful.'
      }
    ]
  },
  {
    id: 'language-preferences',
    title: '4. Respectful Terminology & Community Preferences',
    icon: MessageSquare,
    context: 'You are writing an internal company accessibility blog post and developing guidelines for communicating about disability across teams.',
    question: 'How should you approach the choice between Person-First Language and Identity-First Language?',
    options: [
      {
        id: 'A',
        text: 'Use polite euphemisms such as "differently abled", "special needs", or "handi-capable" because they sound more positive than the word "disabled".',
        isCorrect: false,
        feedback: 'Incorrect. Disability advocacy communities and the IAAP strongly reject patronizing euphemisms like "special needs" or "differently abled". "Disabled" and "disability" are neutral, factual descriptors.'
      },
      {
        id: 'B',
        text: 'Understand that preferences vary: many in the Autism and Deaf communities prefer Identity-First ("Autistic person", "Deaf person"), while many others prefer Person-First ("person with a disability"); respect individual and community preferences and avoid euphemisms.',
        isCorrect: true,
        feedback: 'Correct! There is no single universal rule. Many Autistic and Deaf people embrace Identity-First language as integral to their culture, while others prefer Person-First. When in doubt, ask the individual their preference.'
      },
      {
        id: 'C',
        text: 'Mandate that everyone must use only Person-First language without exception, and correct Autistic people who refer to themselves as "Autistic".',
        isCorrect: false,
        feedback: 'Incorrect. Policing how individuals identify is disrespectful. While Person-First language is common in legal/medical contexts, Identity-First language is deeply valued by many cultural disability communities.'
      }
    ]
  }
];

export default function DisabilityEtiquetteLab() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [userChoices, setUserChoices] = useState({}); // { [scenarioId]: optionId }

  const currentScenario = SCENARIOS[activeScenarioIdx];
  const selectedOptionId = userChoices[currentScenario.id];
  const selectedOption = currentScenario.options.find(o => o.id === selectedOptionId);

  const completedCount = Object.keys(userChoices).length;
  const correctCount = SCENARIOS.filter(s => {
    const chosenId = userChoices[s.id];
    const opt = s.options.find(o => o.id === chosenId);
    return opt?.isCorrect;
  }).length;

  const isAllCorrect = correctCount === SCENARIOS.length;

  const handleSelectOption = (scenarioId, optionId) => {
    soundManager.playClick();
    const isNew = !userChoices[scenarioId];
    const targetOption = currentScenario.options.find(o => o.id === optionId);

    setUserChoices(prev => {
      const updated = { ...prev, [scenarioId]: optionId };
      const newCorrect = SCENARIOS.filter(s => {
        const cId = updated[s.id];
        return s.options.find(o => o.id === cId)?.isCorrect;
      }).length;

      if (newCorrect === SCENARIOS.length) {
        soundManager.playCorrect();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } else if (targetOption?.isCorrect) {
        soundManager.playCorrect();
      } else {
        soundManager.playIncorrect();
      }
      return updated;
    });
  };

  const handleReset = () => {
    soundManager.playClick();
    setUserChoices({});
    setActiveScenarioIdx(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro Header */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Heart size={18} color="var(--arcade-purple)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Disability Etiquette & Respectful Interactions Simulator
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          CPACC Domain 1 covers professional disability etiquette. Etiquette is rooted in autonomy, personal dignity,
          and treating assistive devices as personal bodily space. Navigate through 4 common real-world scenarios to practice
          respectful language, service animal protocol, and direct communication.
        </p>
      </div>

      {/* Progress & Scorecard */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Etiquette Proficiency & Scenario Scorecard
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isAllCorrect ? 'var(--arcade-green)' : correctCount > 0 ? 'var(--arcade-cyan)' : 'var(--text-primary)' }}>
              {correctCount} of {SCENARIOS.length} Scenarios Mastered {isAllCorrect && '— 100% RESPECTFUL ETIQUETTE ✓'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="secondary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RotateCcw size={14} />
            <span>Reset All Scenarios</span>
          </button>
        </div>

        {/* Multi-segment indicator */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SCENARIOS.length}, 1fr)`, gap: '0.4rem', height: '8px' }}>
          {SCENARIOS.map(s => {
            const chosenId = userChoices[s.id];
            const opt = s.options.find(o => o.id === chosenId);
            const isDone = !!chosenId;
            const isGood = opt?.isCorrect;
            return (
              <div
                key={s.id}
                style={{
                  borderRadius: '4px',
                  background: !isDone ? 'var(--bg-surface)' : isGood ? 'var(--arcade-green)' : '#ef4444',
                  transition: 'background 0.3s ease'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Scenario Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {SCENARIOS.map((scenario, idx) => {
          const chosenId = userChoices[scenario.id];
          const opt = scenario.options.find(o => o.id === chosenId);
          const isDone = !!chosenId;
          const isGood = opt?.isCorrect;
          const isSelected = activeScenarioIdx === idx;
          const IconComp = scenario.icon;

          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveScenarioIdx(idx);
              }}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid',
                borderColor: isSelected ? 'var(--arcade-purple)' : 'var(--border-color)',
                background: isSelected ? 'rgba(168, 85, 247, 0.15)' : 'var(--bg-surface-elevated)',
                color: isSelected ? 'var(--arcade-purple)' : 'var(--text-secondary)'
              }}
            >
              <IconComp size={14} />
              <span>{scenario.title}</span>
              {isDone && (
                isGood ? <CheckCircle2 size={14} color="var(--arcade-green)" /> : <XCircle size={14} color="#ef4444" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Scenario Card */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Context Narrative */}
        <div style={{ background: 'var(--bg-surface)', borderLeft: '4px solid var(--arcade-purple)', padding: '1rem', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--arcade-purple)' }}>
            Real-World Scenario
          </span>
          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {currentScenario.context}
          </p>
        </div>

        {/* Question Prompt */}
        <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {currentScenario.question}
        </h5>

        {/* Decision Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {currentScenario.options.map(option => {
            const isSelected = selectedOptionId === option.id;
            let borderStyle = '1px solid var(--border-color)';
            let bgStyle = 'var(--bg-surface)';

            if (selectedOptionId) {
              if (option.isCorrect) {
                borderStyle = '2px solid var(--arcade-green)';
                bgStyle = 'rgba(16, 185, 129, 0.1)';
              } else if (isSelected && !option.isCorrect) {
                borderStyle = '2px solid #ef4444';
                bgStyle = 'rgba(239, 68, 68, 0.1)';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(currentScenario.id, option.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: borderStyle,
                  background: bgStyle,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--arcade-purple)' : 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: isSelected ? '#fff' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  {option.id}
                </div>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  {option.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pedagogical Feedback Banner */}
        {selectedOption && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '6px',
              background: selectedOption.isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${selectedOption.isCorrect ? 'var(--arcade-green)' : '#ef4444'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', color: selectedOption.isCorrect ? 'var(--arcade-green)' : '#ef4444' }}>
              {selectedOption.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{selectedOption.isCorrect ? 'Authoritative IAAP Etiquette Guidance' : 'Common Misconception & Etiquette Trap'}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
              {selectedOption.feedback}
            </p>
          </div>
        )}

        {/* Next / Navigation CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <button
            type="button"
            disabled={activeScenarioIdx === 0}
            onClick={() => {
              soundManager.playClick();
              setActiveScenarioIdx(prev => prev - 1);
            }}
            className="secondary-btn"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
          >
            ← Previous Scenario
          </button>
          <button
            type="button"
            disabled={activeScenarioIdx === SCENARIOS.length - 1}
            onClick={() => {
              soundManager.playClick();
              setActiveScenarioIdx(prev => prev + 1);
            }}
            className="primary-btn"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
          >
            Next Scenario →
          </button>
        </div>
      </div>
    </div>
  );
}
