import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale,
  Calendar,
  AlertTriangle,
  Info,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const REGIONS = [
  {
    id: 'eu',
    name: 'European Union (EU)',
    flag: '🇪🇺',
    keyStatutes: 'European Accessibility Act (EAA Directive 2019/882) & EN 301 549',
    enforcementDeadline: 'June 28, 2025 (EAA Private Sector Enforcement)',
    technicalBaseline: 'EN 301 549 (Harmonized with WCAG 2.1 Level AA + Non-Web Clauses)',
    scopeSummary: 'Applies to private commercial sector across all 27 EU member states: e-commerce, online banking, e-books, ticketing machines, and transport services. Non-compliance risks sales bans and severe fines.'
  },
  {
    id: 'us',
    name: 'United States (US)',
    flag: '🇺🇸',
    keyStatutes: 'ADA Title II (State/Local) · ADA Title III (Public Accommodations) · Section 508',
    enforcementDeadline: 'April 2026 / April 2027 (DOJ Title II Rule) · Immediate (Title III / 508)',
    technicalBaseline: 'WCAG 2.1 Level AA (DOJ Title II Final Rule 2024)',
    scopeSummary: 'DOJ 2024 Title II final rule mandates WCAG 2.1 AA for all state and municipal web/apps. Title III applies to commercial public accommodations under judicial precedent. Section 508 governs federal ICT procurement.'
  },
  {
    id: 'ca',
    name: 'Canada',
    flag: '🇨🇦',
    keyStatutes: 'Accessible Canada Act (ACA 2019) & AODA (Ontario 2005)',
    enforcementDeadline: 'Ongoing / 2025 (AODA full compliance target)',
    technicalBaseline: 'WCAG 2.0 / 2.1 Level AA',
    scopeSummary: 'ACA mandates barrier-free accessibility across federally regulated industries (banking, aviation, telecoms). Provincially, Ontario\'s AODA mandates WCAG Level AA for private businesses with 50+ staff.'
  },
  {
    id: 'uk',
    name: 'United Kingdom (UK)',
    flag: '🇬🇧',
    keyStatutes: 'Equality Act 2010 & PSBAR 2018 (Public Sector Regulations)',
    enforcementDeadline: 'Active Enforcement (PSBAR full enforcement since Sept 2020)',
    technicalBaseline: 'WCAG 2.1 Level AA',
    scopeSummary: 'Equality Act 2010 requires reasonable adjustments in goods and services. PSBAR 2018 enforces WCAG 2.1 AA and mandatory accessibility statements for public sector bodies monitored by CDDO.'
  },
  {
    id: 'jp',
    name: 'Japan & APAC',
    flag: '🇯🇵',
    keyStatutes: 'Act on Elimination of Discrimination Against Persons with Disabilities & JIS X 8341-3',
    enforcementDeadline: 'April 1, 2024 (Mandatory Reasonable Accommodation for Private Sector)',
    technicalBaseline: 'JIS X 8341-3:2016 (Harmonized identically with WCAG)',
    scopeSummary: 'April 2024 legal amendments made reasonable accommodation mandatory for private enterprises as well as public agencies. Technical standard JIS X 8341-3 mirrors WCAG 2.0/2.1.'
  }
];

const SCENARIOS = [
  {
    id: 'scen-1',
    title: 'Case 1: European E-Commerce Expansion',
    scenario: 'A US-based apparel retailer is launching a localized online shopping portal and mobile app targeting customers in France, Germany, and Spain with consumer checkout and electronic payment services.',
    question: 'Which regional statute and enforcement deadline strictly governs this commercial launch?',
    options: [
      { id: 'A', text: 'Section 508 of the Rehabilitation Act (US Federal rules apply internationally)' },
      { id: 'B', text: 'European Accessibility Act (Directive 2019/882), enforceable June 28, 2025 across all EU member states' },
      { id: 'C', text: 'UN CRPD Article 9 without any technical standard' },
      { id: 'D', text: 'Marrakesh Treaty on copyrighted literary works' }
    ],
    answer: 'B',
    explanation: 'The European Accessibility Act (EAA Directive 2019/882) applies directly to commercial e-commerce, banking, and ticketing services across the EU, with strict enforcement starting June 28, 2025.'
  },
  {
    id: 'scen-2',
    title: 'Case 2: US Municipal Government Portal',
    scenario: 'A county government in Ohio (population 120,000) is redesigning its property tax payment website, park reservation portal, and downloadable PDF voter guides.',
    question: 'Under the April 2024 Department of Justice (DOJ) Title II Final Rule, what is the exact legal mandate?',
    options: [
      { id: 'A', text: 'State and local entities are exempt from digital accessibility requirements' },
      { id: 'B', text: 'Web content and mobile apps must strictly conform to WCAG 2.1 Level AA within 2 to 3 years' },
      { id: 'C', text: 'Entities must only comply with Section 504 if sued in federal district court' },
      { id: 'D', text: 'The county may substitute a telephone hotline instead of making the website accessible' }
    ],
    answer: 'B',
    explanation: 'The DOJ 2024 Title II Final Rule officially codified W3C WCAG 2.1 Level AA as the technical standard for all state and local government web content, mobile apps, and electronic documents.'
  },
  {
    id: 'scen-3',
    title: 'Case 3: European Technical Harmonization',
    scenario: 'A software vendor is bidding on a contract to supply intranet workstation software and self-service kiosk terminals to a public hospital system in the European Union.',
    question: 'Which technical standard specifies ICT accessibility requirements for public procurement in the EU?',
    options: [
      { id: 'A', text: 'EN 301 549 (Accessibility requirements for ICT products and services)' },
      { id: 'B', text: 'ADAAG 2010 architectural guidelines' },
      { id: 'C', text: 'ISO 9001 quality management standard' },
      { id: 'D', text: 'FCC CVAA Title II telecommunications regulations' }
    ],
    answer: 'A',
    explanation: 'EN 301 549 is the European harmonized standard for ICT accessibility in public procurement, encompassing web, mobile, software, hardware, and kiosks.'
  },
  {
    id: 'scen-4',
    title: 'Case 4: Canadian Federal Banking Regulation',
    scenario: 'A Canadian national retail bank operates mobile deposit apps and public web portals across all Canadian provinces from British Columbia to Quebec.',
    question: 'Which federal Canadian statute establishes proactive accessibility obligations for federally regulated industries like banking and telecommunications?',
    options: [
      { id: 'A', text: 'Accessibility for Ontarians with Disabilities Act (AODA)' },
      { id: 'B', text: 'The Accessible Canada Act (ACA 2019)' },
      { id: 'C', text: 'Section 508 of the Rehabilitation Act' },
      { id: 'D', text: 'The UK Equality Act 2010' }
    ],
    answer: 'B',
    explanation: 'The Accessible Canada Act (ACA 2019) governs federally regulated entities (banks, telecoms, federal agencies), whereas AODA is provincial legislation applying specifically to Ontario.'
  }
];

export default function GlobalLegalCompassLab() {
  const [selectedRegionId, setSelectedRegionId] = useState('eu');
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  const activeRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];
  const currentScenario = SCENARIOS[activeScenarioIdx];
  const selectedChoice = userAnswers[currentScenario.id];
  const isAnswered = !!selectedChoice;
  const isCorrect = selectedChoice === currentScenario.answer;

  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = SCENARIOS.filter(s => userAnswers[s.id] === s.answer).length;
  const isAllMastered = correctCount === SCENARIOS.length;

  const handleSelectOption = (scenarioId, optionId) => {
    soundManager.playClick();
    setUserAnswers(prev => {
      const updated = { ...prev, [scenarioId]: optionId };
      const newCorrect = SCENARIOS.filter(s => updated[s.id] === s.answer).length;
      if (newCorrect === SCENARIOS.length) {
        soundManager.playCorrect();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } else if (optionId === currentScenario.answer) {
        soundManager.playCorrect();
      } else {
        soundManager.playIncorrect();
      }
      return updated;
    });
  };

  const handleReset = () => {
    soundManager.playClick();
    setUserAnswers({});
    setActiveScenarioIdx(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Globe size={18} color="var(--arcade-cyan)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Global Legal Jurisdictions & Regulatory Compass Simulator
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          CPACC Domain 3 requires deep fluency in international and regional disability rights legislation.
          Examine the legal mandates, technical standards, and enforcement dates across the EU (EAA, EN 301 549),
          the US (ADA Title II/III, Section 508), Canada (ACA, AODA), the UK (Equality Act), and Japan (JIS X 8341-3).
        </p>
      </div>

      {/* Region Selector Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {REGIONS.map(reg => {
          const isSelected = selectedRegionId === reg.id;
          return (
            <button
              key={reg.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedRegionId(reg.id);
              }}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: isSelected ? 'var(--arcade-cyan)' : 'var(--border-color)',
                background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-elevated)',
                color: isSelected ? 'var(--arcade-cyan)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{reg.flag}</span>
              <span>{reg.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Region Legal Dossier */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{activeRegion.flag}</span>
            <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {activeRegion.name} Regulatory Profile
            </h5>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid #f59e0b' }}>
            <Calendar size={14} />
            <span>{activeRegion.enforcementDeadline}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginTop: '0.25rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Key Governing Statutes
            </span>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {activeRegion.keyStatutes}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Mandated Technical Standard
            </span>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--arcade-green)', marginTop: '0.2rem' }}>
              {activeRegion.technicalBaseline}
            </div>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          {activeRegion.scopeSummary}
        </p>
      </div>

      {/* Case Scenario Challenge Desk */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Jurisdictional Case Challenge ({activeScenarioIdx + 1} of {SCENARIOS.length})
            </span>
            <h5 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {currentScenario.title}
            </h5>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isAllMastered ? 'var(--arcade-green)' : 'var(--arcade-cyan)' }}>
              {correctCount} of {SCENARIOS.length} Solved {isAllMastered && '✓'}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="secondary-btn"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Narrative Box */}
        <div style={{ background: 'var(--bg-surface)', borderLeft: '4px solid var(--arcade-cyan)', padding: '0.85rem', borderRadius: '4px', fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          {currentScenario.scenario}
        </div>

        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {currentScenario.question}
        </p>

        {/* Multiple Choice Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {currentScenario.options.map(opt => {
            const isSelected = selectedChoice === opt.id;
            let borderStyle = '1px solid var(--border-color)';
            let bgStyle = 'var(--bg-surface)';

            if (isAnswered) {
              if (opt.id === currentScenario.answer) {
                borderStyle = '2px solid var(--arcade-green)';
                bgStyle = 'rgba(16, 185, 129, 0.12)';
              } else if (isSelected && opt.id !== currentScenario.answer) {
                borderStyle = '2px solid #ef4444';
                bgStyle = 'rgba(239, 68, 68, 0.12)';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(currentScenario.id, opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem',
                  borderRadius: '6px',
                  border: borderStyle,
                  background: bgStyle,
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--arcade-cyan)' : 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: isSelected ? '#040810' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  {opt.id}
                </div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.4, color: 'var(--text-primary)' }}>
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Rationale */}
        {isAnswered && (
          <div style={{ padding: '0.85rem', borderRadius: '6px', background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: `1px solid ${isCorrect ? 'var(--arcade-green)' : '#ef4444'}`, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
            <strong>{isCorrect ? '✓ Correct Legal Analysis:' : '✗ Incorrect Jurisdictional Finding:'}</strong> {currentScenario.explanation}
          </div>
        )}

        {/* Stepper Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <button
            type="button"
            disabled={activeScenarioIdx === 0}
            onClick={() => {
              soundManager.playClick();
              setActiveScenarioIdx(prev => prev - 1);
            }}
            className="secondary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            ← Previous Case
          </button>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Case {activeScenarioIdx + 1} of {SCENARIOS.length}
          </span>

          <button
            type="button"
            disabled={activeScenarioIdx === SCENARIOS.length - 1}
            onClick={() => {
              soundManager.playClick();
              setActiveScenarioIdx(prev => prev + 1);
            }}
            className="primary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            Next Case →
          </button>
        </div>
      </div>
    </div>
  );
}
