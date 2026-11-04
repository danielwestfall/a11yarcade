import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Users,
  Award,
  RotateCcw,
  Sparkles,
  BarChart,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const TRAINING_MODULES = [
  {
    id: 'trn-foundations',
    name: 'Disability Awareness & PDF/UA Basics',
    audience: 'All Employees',
    duration: '1 Hour',
    method: 'Interactive Screen Reader Demonstration'
  },
  {
    id: 'trn-office-word',
    name: 'Creating Accessible Word & PowerPoint Templates',
    audience: 'Administrative & Communications Staff',
    duration: '2 Hours',
    method: 'Hands-on Document Repair Workshop'
  },
  {
    id: 'trn-indesign',
    name: 'Adobe InDesign Tagged PDF Export Architecture',
    audience: 'Graphic Designers & Marketing Teams',
    duration: '3 Hours',
    method: 'Live Articles Panel & Tag Tree Export Lab'
  },
  {
    id: 'trn-qa-pac',
    name: 'PAC (PDF Accessibility Checker) & Acrobat Pro Audit',
    audience: 'Document QA & Remediation Champions',
    duration: '2 Hours',
    method: 'Defect Remediation & Screen Reader Testing Lab'
  }
];

export default function A11yTrainingCurriculumLab() {
  const [selectedRole, setSelectedRole] = useState('designers'); // 'authors' | 'designers' | 'executives'
  const [includeHandsOnLab, setIncludeHandsOnLab] = useState(true);
  const [simulated, setSimulated] = useState(false);

  const handleSimulateTraining = () => {
    soundManager.playAuditPing();
    setSimulated(true);
    if (includeHandsOnLab) {
      soundManager.playCorrect();
      confetti({ particleCount: 45, spread: 60 });
    } else {
      soundManager.playIncorrect();
    }
  };

  return (
    <section aria-label="Accessibility Training Curriculum Architect Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <GraduationCap size={20} aria-hidden="true" />
          Developing Organizational Document Accessibility Training
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Effective corporate training programs tailor curriculum to distinct authoring roles (Word authors vs InDesign designers) and prioritize <strong>hands-on remediation practice</strong> over passive lecture slides. Measure the real-world defect reduction rate across publishing pipelines.
        </p>
      </div>

      {/* Role Selector */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 1: Select Target Training Audience
        </legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {[
            { id: 'authors', label: 'General Document Authors (Word/Docs)' },
            { id: 'designers', label: 'Graphic Designers (InDesign/Acrobat)' },
            { id: 'executives', label: 'Leadership & Department Managers' }
          ].map(role => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setSelectedRole(role.id);
                  setSimulated(false);
                }}
                style={{
                  minHeight: '44px',
                  padding: '0.65rem 1rem',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid var(--arcade-yellow)' : '1px solid var(--arcade-border)',
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface-elevated)',
                  color: isSelected ? 'var(--arcade-yellow)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
                aria-pressed={isSelected}
              >
                {role.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Curriculum Modules Overview */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.95rem' }}>
          Recommended Curriculum Sequence:
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {TRAINING_MODULES.map((mod, i) => (
            <div
              key={mod.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.6rem 0.75rem',
                borderRadius: '4px',
                background: 'var(--arcade-surface)',
                border: '1px solid var(--arcade-border)',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <strong>Module {i + 1}: {mod.name}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: {mod.audience} • Method: {mod.method}</div>
              </div>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--arcade-yellow)' }}>
                {mod.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructional Design Options */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 2: Pedagogical Method Selection
        </legend>
        <label htmlFor="chk-hands-on" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
          <input
            type="checkbox"
            id="chk-hands-on"
            checked={includeHandsOnLab}
            onChange={(e) => {
              soundManager.playClick();
              setIncludeHandsOnLab(e.target.checked);
              setSimulated(false);
            }}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
          />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <strong>Include Hands-On Remediation Practice:</strong> Attendees repair intentionally broken sample documents rather than only viewing lecture slides.
          </span>
        </label>
      </fieldset>

      {/* Simulate Button */}
      <div>
        <button
          type="button"
          onClick={handleSimulateTraining}
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
          <Award size={18} aria-hidden="true" />
          Evaluate Training Program Impact
        </button>
      </div>

      {/* Outcome */}
      {simulated && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            border: `2px solid ${includeHandsOnLab ? 'var(--arcade-green)' : '#ef4444'}`,
            background: includeHandsOnLab ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {includeHandsOnLab ? (
              <CheckCircle2 size={22} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
            ) : (
              <BarChart size={22} style={{ color: '#ef4444' }} aria-hidden="true" />
            )}
            <h4 style={{ margin: 0, fontSize: '1rem', color: includeHandsOnLab ? 'var(--arcade-green)' : '#ef4444' }}>
              {includeHandsOnLab ? 'TRAINING IMPACT: 82% DEFECT REDUCTION' : 'TRAINING FAILURE: PASSIVE LECTURE YIELDS ONLY 12% RETENTION'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {includeHandsOnLab
              ? 'Document accessibility training succeeds when grounded in role-specific authoring workflows and verified with hands-on practice. Post-training document audits show an 82% reduction in missing headings, untagged images, and broken table structures.'
              : 'Lecturing on standards without interactive remediation practice leads to rapid knowledge fade. Research demonstrates adult learners require active document repair exercises to develop lasting authoring muscle memory.'}
          </p>
        </div>
      )}
    </section>
  );
}
