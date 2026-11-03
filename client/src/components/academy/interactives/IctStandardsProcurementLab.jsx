import React, { useState } from 'react';
import {
  FileText,
  Server,
  Monitor,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Globe,
  Sliders,
  DollarSign,
  Laptop,
  Smartphone,
  PhoneCall,
  HardDrive
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const ICT_DOMAINS = [
  {
    id: 'web',
    title: 'Web & Web Applications',
    icon: Globe,
    standards: 'WCAG 2.1 Level AA · EN 301 549 Clause 9 · Section 508 E205',
    scope: 'Public internet portals, intranet portals, browser-based cloud SaaS software.',
    keyRule: 'Must satisfy all 50 WCAG 2.1 Level A and AA Success Criteria across responsive layouts.'
  },
  {
    id: 'docs',
    title: 'Electronic Documents (PDF / Office)',
    icon: FileText,
    standards: 'WCAG 2.1 AA · ISO 14289-1 (PDF/UA) · EN 301 549 Clause 10 · Section 508 E205.4',
    scope: 'Static and interactive PDFs, spreadsheets, Word documents, digital forms, presentation slides.',
    keyRule: 'All authoring documents must have semantic tag trees, logical reading order, title metadata, and alternative text.'
  },
  {
    id: 'software',
    title: 'Non-Web & Mobile Native Software',
    icon: Smartphone,
    standards: 'WCAG 2.1 AA (WCAG2ICT) · EN 301 549 Clause 11 · Section 508 Chapter 5',
    scope: 'Installed desktop executables (.exe, .dmg), native iOS/Android mobile apps, command-line utilities.',
    keyRule: 'Must expose controls to OS Accessibility APIs (UIA, NSAccessibility) and honor OS font size and high contrast settings.'
  },
  {
    id: 'closed',
    title: 'Closed Hardware & Self-Service Kiosks',
    icon: HardDrive,
    standards: 'Section 508 Chapter 4 · EN 301 549 Clause 5 & 8 · ADA Title III Kiosk Rules',
    scope: 'Automated Teller Machines (ATMs), airline check-in kiosks, subway ticketing machines, smart lockers.',
    keyRule: 'Because users cannot attach personal screen readers, closed products MUST provide built-in speech output, 3.5mm audio jacks, and tactile keypads.'
  },
  {
    id: 'telecom',
    title: 'Telecommunications & Two-Way Voice',
    icon: PhoneCall,
    standards: 'Section 508 Chapter 4 (412) · EN 301 549 Clause 6 · FCC RTT Mandates',
    scope: 'VoIP software, corporate softphones, video conferencing platforms, emergency call services.',
    keyRule: 'Must support Real-Time Text (RTT) transmission, interoperability with telecommunications relay services (TRS), and video sign-language bandwidth.'
  }
];

const SCENARIOS = [
  {
    id: 'proc-1',
    title: 'Closed Functionality Kiosk Headphone Jack & Speech Output',
    category: 'Closed Functionality (EN 301 549 Clause 5)',
    scenario:
      'A hospital procures self-service patient check-in kiosks. The vendor VPAT states: "Conforms to WCAG 2.1 AA because the screen uses standard HTML5." However, the physical kiosk has no headphone jack, no speakers, and no tactile buttons.',
    question: 'Why does this kiosk fail ICT accessibility standards under Section 508 and EN 301 549?',
    options: [
      {
        id: 'A',
        text: 'Closed functionality hardware prohibits users from attaching their own assistive technologies. Merely having an HTML interface is insufficient; Section 508 Chapter 4 and EN 301 549 Clause 5 mandate built-in speech output, volume control, a 3.5mm headphone jack, and tactile key indicators.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Hospitals are completely exempt from all federal and state accessibility procurement regulations.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Kiosks are required to have a mechanical braille embossing typewriter attached to the side.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'The kiosk must be operated by a doctor at all times.',
        isCorrect: false
      }
    ],
    explanation:
      'Closed products (kiosks, ATMs, voting machines) prevent users from loading personal screen readers. Under Section 508 Chapter 4 and EN 301 549 Clause 5, closed systems must have built-in speech output accessible via a standard audio jack, volume amplification, and tactile key orientation (raised dot on "5").'
  },
  {
    id: 'proc-2',
    title: 'Real-Time Text (RTT) in Telecommunications Procurements',
    category: 'Telecommunications & Two-Way Voice',
    scenario:
      'A government agency purchases a modern VoIP telecommunications phone system for customer support. Advocacy groups verify whether the system supports Real-Time Text (RTT).',
    question: 'Why is Real-Time Text (RTT) specifically mandated under Section 508 Section 412 and EN 301 549 Clause 6?',
    options: [
      {
        id: 'A',
        text: 'RTT transmits characters instantly as they are typed without requiring users to press a "Send" button, enabling conversational parity, simultaneous two-way dialogue, and vital 911 emergency communication for deaf and speech-disabled individuals.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'RTT is an encryption protocol designed to block spam telephone calls.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'RTT compresses audio files into MP3 format to save storage space.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'RTT is only required if the telephone call lasts longer than 4 hours.',
        isCorrect: false
      }
    ],
    explanation:
      'Unlike chat or SMS where messages are sent in blocks, Real-Time Text (RTT) streams characters instantaneously as they are keyed. This provides natural conversational cadence, immediate comprehension during emergencies, and seamless communication for deaf, hard-of-hearing, and speech-impaired callers.'
  },
  {
    id: 'proc-3',
    title: 'Global Technical Harmonization (Section 508, EN 301 549, JIS)',
    category: 'International Standards Harmonization',
    scenario:
      'A multinational software corporation designs an enterprise resource planning (ERP) platform. The executive team wants to know which technical baseline must be targeted to achieve compliance across the United States federal government, the European Union member states, and Japan.',
    question: 'What is the universally harmonized technical baseline shared by Section 508, EN 301 549, and JIS X 8341-3?',
    options: [
      {
        id: 'A',
        text: 'W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Microsoft Windows 95 Display Guidelines.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'ISO 9001 Manufacturing Quality Standards.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Each country uses completely conflicting technical rules with zero mutual overlap.',
        isCorrect: false
      }
    ],
    explanation:
      'International standards harmonization has successfully unified US Revised Section 508, European standard EN 301 549, and Japanese standard JIS X 8341-3 around W3C WCAG 2.1 Level AA as the shared technical core for digital accessibility.'
  },
  {
    id: 'proc-4',
    title: 'Enforceable Contractual SLA Clauses in ICT Procurements',
    category: 'Procurement Governance',
    scenario:
      'An enterprise selects an HR cloud software vendor. The vendor provides a VPAT claiming full conformance. During user acceptance testing by blind employees, critical payroll workflows are completely impassable.',
    question: 'What procurement contractual clause prevents the enterprise from being trapped with inaccessible software?',
    options: [
      {
        id: 'A',
        text: 'An Accessibility Warranty and Remediation Service Level Agreement (SLA) requiring the vendor to remediate identified WCAG defects within 30-60 days at the vendor\'s sole expense, or face contract termination and full refund.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'A clause requiring the enterprise to fire all employees who report software bugs.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'An agreement that accessibility standards only apply during leap years.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'A verbal handshake without written documentation.',
        isCorrect: false
      }
    ],
    explanation:
      'Procurement experts require robust accessibility clauses in the master services agreement (MSA). Without an enforceable warranty and remediation SLA with strict cure periods and indemnity, organizations bear the legal and financial burden of vendor non-compliance.'
  }
];

export default function IctStandardsProcurementLab() {
  const [selectedDomainId, setSelectedDomainId] = useState('closed');
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const activeDomain = ICT_DOMAINS.find(d => d.id === selectedDomainId) || ICT_DOMAINS[0];
  const currentScenario = SCENARIOS[activeScenarioIdx];
  const selectedOption = userAnswers[currentScenario.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && currentScenario.options.find(o => o.id === selectedOption)?.isCorrect;

  const handleSelectOption = (optId) => {
    if (isAnswered) return;
    const opt = currentScenario.options.find(o => o.id === optId);
    const newAnswers = { ...userAnswers, [currentScenario.id]: optId };
    setUserAnswers(newAnswers);

    if (opt?.isCorrect) {
      soundManager.playCorrect();
      const newScore = score + 25;
      setScore(newScore);
      if (Object.keys(newAnswers).length === SCENARIOS.length) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      soundManager.playIncorrect();
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setUserAnswers({});
    setScore(0);
    setActiveScenarioIdx(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(16, 185, 129, 0.08))',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <Server size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Applying Standards to ICT & Technical Specifications Lab
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Master Section 508 Chapter 4, EN 301 549, closed functionality kiosks, Real-Time Text (RTT), and procurement SLAs
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              ICT Standards Score
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: score === 100 ? 'var(--arcade-green)' : 'var(--arcade-yellow)' }}>
              {score}% ({Object.keys(userAnswers).length}/{SCENARIOS.length} Solved)
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="secondary-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
            title="Reset lab"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* ICT Scope Selector */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Select ICT Domain Scoping Category:
        </div>
        <div role="tablist" aria-label="ICT Domains" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {ICT_DOMAINS.map((domain) => {
            const isSelected = domain.id === selectedDomainId;
            const Icon = domain.icon;
            return (
              <button
                key={domain.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedDomainId(domain.id);
                }}
                className={`tab-btn ${isSelected ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: '6px',
                  background: isSelected ? 'var(--card-bg)' : 'transparent',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                  color: isSelected ? '#38bdf8' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} />
                <span>{domain.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Domain Card */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {activeDomain.title}
          </span>
          <span
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8'
            }}
          >
            {activeDomain.standards}
          </span>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', borderLeft: '4px solid #38bdf8', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          <strong>Scope:</strong> {activeDomain.scope}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Core Technical Rule:</strong> {activeDomain.keyRule}
        </div>
      </div>

      {/* Case Solver Challenges */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              ICT Standards & Procurement Case Examiner
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Case {activeScenarioIdx + 1} of {SCENARIOS.length}: {currentScenario.title}
            </h4>
          </div>

          <span
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8'
            }}
          >
            {currentScenario.category}
          </span>
        </div>

        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ marginBottom: '0.65rem' }}>
            <strong>Procurement Scenario:</strong> {currentScenario.scenario}
          </div>
          <div style={{ fontWeight: 700, color: '#38bdf8' }}>
            {currentScenario.question}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {currentScenario.options.map((opt) => {
            const isChosen = selectedOption === opt.id;
            let optBorder = 'var(--border-color)';
            let optBg = 'var(--bg-secondary)';

            if (isAnswered) {
              if (opt.isCorrect) {
                optBorder = 'var(--arcade-green)';
                optBg = 'rgba(16, 185, 129, 0.12)';
              } else if (isChosen && !opt.isCorrect) {
                optBorder = '#ef4444';
                optBg = 'rgba(239, 68, 68, 0.12)';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswered}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  background: optBg,
                  border: `1px solid ${optBorder}`,
                  textAlign: 'left',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    background: isAnswered && opt.isCorrect ? 'var(--arcade-green)' : isAnswered && isChosen ? '#ef4444' : 'rgba(255,255,255,0.1)',
                    color: isAnswered && (opt.isCorrect || isChosen) ? '#ffffff' : 'var(--text-primary)'
                  }}
                >
                  {opt.id}
                </div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--text-primary)' }}>
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Rationale */}
        {isAnswered && (
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '6px',
              background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${isCorrect ? 'var(--arcade-green)' : '#ef4444'}`,
              fontSize: '0.85rem',
              lineHeight: 1.5,
              color: 'var(--text-primary)'
            }}
          >
            <strong>{isCorrect ? '✓ Correct ICT Procurement Analysis:' : '✗ Incorrect Finding:'}</strong> {currentScenario.explanation}
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
