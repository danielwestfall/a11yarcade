import React, { useState } from 'react';
import { Scale, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, ShieldCheck, FileText, Globe2, Building } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const LEGAL_SCENARIOS = [
  {
    id: 'streaming-video',
    title: 'Streaming Video Platform in the US',
    description: 'A commercial video-on-demand platform streams original entertainment and broadcast programming to subscribers nationwide.',
    correctCategory: 'telecom',
    correctStatute: 'CVAA (21st Century Communications and Video Accessibility Act)',
    correctStandard: 'Closed Captions & Audio Description parity with broadcast rules',
    distractors: {
      category: ['civil-rights', 'procurement'],
      statute: ['Section 508', 'ADA Title III', 'EN 301 549'],
      standard: ['VPAT Section 508 compliance', 'Architectural barrier removal', 'Plain language standard']
    },
    explanation: 'The CVAA specifically governs video programming transmitted over the Internet that was previously shown on TV with captions, requiring caption parity and user-accessible caption controls.'
  },
  {
    id: 'federal-intranet',
    title: 'US Federal Agency Employee Intranet',
    description: 'A federal executive department is procuring a new internal enterprise HR and payroll portal for 25,000 civil servants.',
    correctCategory: 'procurement',
    correctStatute: 'Rehabilitation Act Section 508',
    correctStandard: 'WCAG 2.0 / 2.1 Level AA conformance via VPAT / ACR documentation',
    distractors: {
      category: ['civil-rights', 'telecom'],
      statute: ['ADA Title III', 'CVAA', 'Air Carrier Access Act (ACAA)'],
      standard: ['Title II public accommodation', 'Broadcast audio description', 'Physical curb ramp specs']
    },
    explanation: 'Section 508 mandates that all Information and Communication Technology (ICT) developed, procured, maintained, or used by the US federal government must be accessible to federal employees and members of the public.'
  },
  {
    id: 'ecommerce-storefront',
    title: 'Commercial E-Commerce Retailer',
    description: 'A private nationwide clothing chain sells apparel exclusively through their public e-commerce website and mobile app.',
    correctCategory: 'civil-rights',
    correctStatute: 'ADA Title III (Places of Public Accommodation)',
    correctStandard: 'Effective communication and non-discrimination (commonly benchmarked against WCAG 2.1 AA)',
    distractors: {
      category: ['procurement', 'telecom'],
      statute: ['Section 504', 'EN 301 549', 'CVAA'],
      standard: ['FCC Title 47 CFR Part 79', 'FAR Subpart 39.2', 'FAA 14 CFR Part 382']
    },
    explanation: 'US courts and DOJ guidance interpret ADA Title III to apply to commercial e-commerce websites as places of public accommodation or services of places of public accommodation, mandating non-discrimination.'
  },
  {
    id: 'eu-banking-app',
    title: 'European Retail Banking Mobile App',
    description: 'A commercial consumer bank operating across France, Germany, and Spain provides mobile app checking, transfers, and ATM cash withdrawals.',
    correctCategory: 'civil-rights',
    correctStatute: 'European Accessibility Act (EAA - Directive 2019/882)',
    correctStandard: 'Harmonized European Standard EN 301 549 (WCAG Level AA plus hardware/ATM requirements)',
    distractors: {
      category: ['procurement', 'telecom'],
      statute: ['EU Web Accessibility Directive (2016/2102)', 'US Section 508', 'UK Equality Act 2010'],
      standard: ['Public sector body intranet only', 'Broadcast captioning rules only', 'Section 508 VPAT only']
    },
    explanation: 'The European Accessibility Act (Directive 2019/882) applies directly to private sector consumer services, including consumer banking, e-commerce, ATMs, and ticketing across all EU member states.'
  },
  {
    id: 'airline-booking',
    title: 'Commercial Airline Web & Kiosk Check-In',
    description: 'A major international airline operates passenger flights in the United States and provides online flight booking and airport self-service kiosks.',
    correctCategory: 'civil-rights',
    correctStatute: 'Air Carrier Access Act (ACAA - 14 CFR Part 382)',
    correctStandard: 'DOT 14 CFR Part 382 rules (WCAG 2.0 AA for primary website; physical/speech kiosk requirements)',
    distractors: {
      category: ['procurement', 'telecom'],
      statute: ['ADA Title I', 'Section 508', 'CVAA'],
      standard: ['FCC closed captioning', 'Federal employee intranet rule', 'OSHA ergonomic standard']
    },
    explanation: 'Airlines flying in US airspace are governed by the Department of Transportation under the Air Carrier Access Act (ACAA), not the ADA. DOT regulations explicitly require accessible websites (WCAG 2.0 AA) and automated airport kiosks.'
  }
];

export default function A11yLawsRegulationsLab() {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatute, setSelectedStatute] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');
  const [evaluated, setEvaluated] = useState(false);
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState({});

  const scenario = LEGAL_SCENARIOS[currentScenarioIdx];

  const categoryOptions = [
    { id: 'civil-rights', label: 'Civil Rights / Anti-Discrimination Law' },
    { id: 'procurement', label: 'Government ICT Procurement Standard' },
    { id: 'telecom', label: 'Telecommunications & Media Regulation' }
  ];

  const statuteOptions = [
    scenario.correctStatute,
    ...scenario.distractors.statute
  ].sort();

  const standardOptions = [
    scenario.correctStandard,
    ...scenario.distractors.standard
  ].sort();

  const handleEvaluate = () => {
    soundManager.playClick();
    const isCategoryCorrect = selectedCategory === scenario.correctCategory;
    const isStatuteCorrect = selectedStatute === scenario.correctStatute;
    const isStandardCorrect = selectedStandard === scenario.correctStandard;
    const allCorrect = isCategoryCorrect && isStatuteCorrect && isStandardCorrect;

    if (allCorrect) {
      soundManager.playCorrect();
      if (!completedScenarios[scenario.id]) {
        setScore(prev => prev + 1);
        setCompletedScenarios(prev => ({ ...prev, [scenario.id]: true }));
      }
    } else {
      soundManager.playIncorrect();
    }
    setEvaluated(true);
  };

  const handleNext = () => {
    soundManager.playClick();
    setEvaluated(false);
    setSelectedCategory('');
    setSelectedStatute('');
    setSelectedStandard('');
    setCurrentScenarioIdx(prev => (prev + 1) % LEGAL_SCENARIOS.length);
  };

  const isFormComplete = selectedCategory && selectedStatute && selectedStandard;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '8px',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Scale size={20} color="#38bdf8" aria-hidden="true" />
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
              Global Legal & Regulatory Classification Matrix
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Investigate real-world digital products and classify whether they are governed by Civil Rights, Procurement, or Specialized Sector laws.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Mastered: {score} / {LEGAL_SCENARIOS.length}
          </span>
          <div
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={LEGAL_SCENARIOS.length}
            aria-label="Legal scenarios mastery progress"
            style={{
              width: '100px',
              height: '8px',
              background: 'var(--border-color)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${(score / LEGAL_SCENARIOS.length) * 100}%`,
                height: '100%',
                background: '#38bdf8',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Case Scenario Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#38bdf8' }}>
            Case Study #{currentScenarioIdx + 1} of {LEGAL_SCENARIOS.length}
          </span>
          {completedScenarios[scenario.id] && (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={14} aria-hidden="true" /> Mastered
            </span>
          )}
        </div>
        <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {scenario.title}
        </h5>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {scenario.description}
        </p>
      </div>

      {/* Interactive Selection Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Step 1: Legal Category */}
        <fieldset
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1rem',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <legend style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', padding: '0 0.25rem' }}>
            1. Legal Enforcement Category
          </legend>
          {categoryOptions.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <label
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-elevated)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                  cursor: evaluated ? 'default' : 'pointer',
                  fontSize: '0.85rem',
                  color: isSelected ? '#38bdf8' : 'var(--text-secondary)'
                }}
              >
                <input
                  type="radio"
                  name="legal-category"
                  value={cat.id}
                  checked={isSelected}
                  disabled={evaluated}
                  onChange={() => setSelectedCategory(cat.id)}
                  style={{ accentColor: '#38bdf8' }}
                />
                <span>{cat.label}</span>
              </label>
            );
          })}
        </fieldset>

        {/* Step 2: Primary Governing Statute */}
        <fieldset
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1rem',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <legend style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', padding: '0 0.25rem' }}>
            2. Primary Governing Statute
          </legend>
          {statuteOptions.map(statute => {
            const isSelected = selectedStatute === statute;
            return (
              <label
                key={statute}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-elevated)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                  cursor: evaluated ? 'default' : 'pointer',
                  fontSize: '0.85rem',
                  color: isSelected ? '#38bdf8' : 'var(--text-secondary)'
                }}
              >
                <input
                  type="radio"
                  name="governing-statute"
                  value={statute}
                  checked={isSelected}
                  disabled={evaluated}
                  onChange={() => setSelectedStatute(statute)}
                  style={{ accentColor: '#38bdf8' }}
                />
                <span>{statute}</span>
              </label>
            );
          })}
        </fieldset>

        {/* Step 3: Mandatory Remedy / Technical Standard */}
        <fieldset
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1rem',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <legend style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', padding: '0 0.25rem' }}>
            3. Mandatory Technical Standard
          </legend>
          {standardOptions.map(std => {
            const isSelected = selectedStandard === std;
            return (
              <label
                key={std}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-elevated)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                  cursor: evaluated ? 'default' : 'pointer',
                  fontSize: '0.85rem',
                  color: isSelected ? '#38bdf8' : 'var(--text-secondary)'
                }}
              >
                <input
                  type="radio"
                  name="technical-standard"
                  value={std}
                  checked={isSelected}
                  disabled={evaluated}
                  onChange={() => setSelectedStandard(std)}
                  style={{ accentColor: '#38bdf8' }}
                />
                <span>{std}</span>
              </label>
            );
          })}
        </fieldset>
      </div>

      {/* Feedback Panel */}
      {evaluated && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            background: selectedCategory === scenario.correctCategory && selectedStatute === scenario.correctStatute && selectedStandard === scenario.correctStandard
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            borderLeft: `4px solid ${
              selectedCategory === scenario.correctCategory && selectedStatute === scenario.correctStatute && selectedStandard === scenario.correctStandard
                ? '#10b981'
                : '#ef4444'
            }`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
            {selectedCategory === scenario.correctCategory && selectedStatute === scenario.correctStatute && selectedStandard === scenario.correctStandard ? (
              <>
                <CheckCircle2 size={18} color="#10b981" aria-hidden="true" />
                <span style={{ color: '#10b981' }}>Classification Correct!</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} color="#ef4444" aria-hidden="true" />
                <span style={{ color: '#ef4444' }}>Incorrect Classification</span>
              </>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
            {scenario.explanation}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
        {!evaluated ? (
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={!isFormComplete}
            className="primary-btn"
            style={{
              padding: '0.65rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              opacity: isFormComplete ? 1 : 0.5,
              cursor: isFormComplete ? 'pointer' : 'not-allowed'
            }}
          >
            Verify Legal Classification
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="primary-btn"
            style={{
              padding: '0.65rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>Next Case Study</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
