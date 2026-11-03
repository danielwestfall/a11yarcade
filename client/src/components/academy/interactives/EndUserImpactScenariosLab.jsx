import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Shield,
  HeartHandshake,
  DollarSign,
  Laptop2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const PARTICIPANT_COHORTS = [
  {
    id: 'cohort-screen-reader',
    title: 'Totally Blind Screen Reader Users',
    device: 'Own personal laptop (NVDA/JAWS customized speech settings)',
    keyTestingFocus: 'Linear order, form validation alerts, audio feedback, skip links'
  },
  {
    id: 'cohort-low-vision',
    title: 'Low Vision & High Contrast Users',
    device: 'Own 32-inch monitor running Windows High Contrast & 300% Zoom',
    keyTestingFocus: 'Reflow 1.4.10, CSS background stripping, focus indicators'
  },
  {
    id: 'cohort-motor-switch',
    title: 'Motor Impairment & Switch Hardware Users',
    device: 'Personal dual-switch head array & on-screen keyboard',
    keyTestingFocus: 'Target size 2.5.8 (24px AA), fatigue reduction, bypass blocks'
  },
  {
    id: 'cohort-cognitive',
    title: 'Cognitive & Neurodivergent Users (ADHD/Dyslexia)',
    device: 'Standard tablet with custom dyslexia fonts & text-to-speech',
    keyTestingFocus: 'Cognitive overload, time limits 2.2.1, error prevention, plain language'
  }
];

export default function EndUserImpactScenariosLab() {
  const [selectedCohortId, setSelectedCohortId] = useState('cohort-screen-reader');
  const [fairCompensation, setFairCompensation] = useState(true);
  const [useOwnDevice, setUseOwnDevice] = useState(true);
  const [passiveObservation, setPassiveObservation] = useState(true);
  const [evaluated, setEvaluated] = useState(false);

  const activeCohort = PARTICIPANT_COHORTS.find(c => c.id === selectedCohortId) || PARTICIPANT_COHORTS[0];

  const handleSelectCohort = (id) => {
    soundManager.playClick();
    setSelectedCohortId(id);
    setEvaluated(false);
  };

  const handleRunEvaluation = () => {
    soundManager.playAuditPing();
    setEvaluated(true);
    if (isEthical) {
      soundManager.playCorrect();
      confetti({ particleCount: 45, spread: 60 });
    } else {
      soundManager.playIncorrect();
    }
  };

  const isEthical = fairCompensation && useOwnDevice && passiveObservation;

  return (
    <section aria-label="End User Testing Protocol & Ethical Usability Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-purple)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Users size={20} aria-hidden="true" />
          Testing with Users with Disabilities & Functional Impact
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          User testing with people with disabilities is vital for understanding real-world functional barriers. However, it must be conducted with rigorous ethics: fair professional compensation, allowing users to test on their own familiar assistive technologies, and quiet, non-coaching observation.
        </p>
      </div>

      {/* Cohort Selector */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-purple)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 1: Select Participant Disability Cohort
        </legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
          {PARTICIPANT_COHORTS.map(c => {
            const isSelected = c.id === selectedCohortId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCohort(c.id)}
                style={{
                  minHeight: '44px',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid var(--arcade-purple)' : '1px solid var(--arcade-border)',
                  background: isSelected ? 'rgba(192, 132, 252, 0.15)' : 'var(--bg-surface-elevated)',
                  color: isSelected ? 'var(--arcade-purple)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                aria-pressed={isSelected}
              >
                {c.title}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Cohort Details */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-cyan)', fontSize: '0.95rem' }}>{activeCohort.title}</h4>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div><strong>Optimal Hardware Setup:</strong> {activeCohort.device}</div>
          <div><strong>Primary Evaluation Metrics:</strong> {activeCohort.keyTestingFocus}</div>
        </div>
      </div>

      {/* Ethics & Protocol Checklist */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-purple)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 2: Session Ethics & Research Protocol
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-fair-comp"
              checked={fairCompensation}
              onChange={(e) => {
                soundManager.playClick();
                setFairCompensation(e.target.checked);
                setEvaluated(false);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-purple)' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <strong>Fair Professional Compensation:</strong> Pay participants competitive professional rates ($100–$150/hr) rather than token gift cards.
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-own-device"
              checked={useOwnDevice}
              onChange={(e) => {
                soundManager.playClick();
                setUseOwnDevice(e.target.checked);
                setEvaluated(false);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-purple)' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <strong>Personal Assistive Tech Environment:</strong> Allow participants to test on their own configured devices and screen reader versions.
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-passive-obs"
              checked={passiveObservation}
              onChange={(e) => {
                soundManager.playClick();
                setPassiveObservation(e.target.checked);
                setEvaluated(false);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-purple)' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <strong>Non-Coaching Observation Protocol:</strong> Silently document where UI friction occurs without intervening or demonstrating solutions.
            </span>
          </label>
        </div>
      </fieldset>

      {/* Action */}
      <div>
        <button
          type="button"
          onClick={handleRunEvaluation}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--arcade-purple)',
            color: '#fff',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <HeartHandshake size={18} aria-hidden="true" />
          Validate Research Protocol
        </button>
      </div>

      {/* Outcome */}
      {evaluated && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            border: `2px solid ${isEthical ? 'var(--arcade-green)' : '#ef4444'}`,
            background: isEthical ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {isEthical ? (
              <CheckCircle2 size={22} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
            ) : (
              <AlertTriangle size={22} style={{ color: '#ef4444' }} aria-hidden="true" />
            )}
            <h4 style={{ margin: 0, fontSize: '1rem', color: isEthical ? 'var(--arcade-green)' : '#ef4444' }}>
              {isEthical ? 'ETHICAL RESEARCH PROTOCOL APPROVED' : 'PROTOCOL FLAWS DETECTED: INVALID STUDY DATA'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {isEthical
              ? 'Outstanding protocol design! Testing users on their own configured AT with fair compensation and non-intervention yields authentic functional feedback, exposing hidden cognitive barriers that automated checkers miss.'
              : 'Ethical and methodological failure: Testing users on unfamiliar loaner devices or intervening during tasks invalidates user test observations. Always preserve ecological validity by letting users operate their own personal assistive configurations.'}
          </p>
        </div>
      )}
    </section>
  );
}
