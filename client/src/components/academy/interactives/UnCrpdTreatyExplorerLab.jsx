import React, { useState } from 'react';
import {
  Globe,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale,
  FileText,
  AlertTriangle,
  Award,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const TREATIES = [
  {
    id: 'crpd-9',
    name: 'UN CRPD Article 9',
    title: 'Accessibility',
    adopted: '2006 (UN General Assembly)',
    body: 'United Nations Committee on the Rights of Persons with Disabilities',
    coreMandate:
      'Requires States Parties to take appropriate measures to ensure access for persons with disabilities, on an equal basis with others, to the physical environment, transportation, information and communications (including ICT systems), and other public facilities and services.',
    keyClauses: [
      {
        clause: 'Article 9.1(b)',
        summary: 'Encompasses information, communications and other services, including electronic services and emergency services in urban and rural areas.'
      },
      {
        clause: 'Article 9.2(a)',
        summary: 'Develop, promulgate, and monitor the implementation of minimum national standards and guidelines for accessibility of public facilities and services.'
      },
      {
        clause: 'Article 9.2(b)',
        summary: 'Explicitly obligates States Parties to ensure that private entities offering facilities and services to the public take into account all aspects of accessibility.'
      },
      {
        clause: 'Article 9.2(g) & (h)',
        summary: 'Promote access to new ICT and emergency communication systems, and promote the design, development, production and distribution of accessible ICT at an early stage.'
      }
    ],
    impact: 'Established digital accessibility as an international human right, serving as the legal bedrock for the European Accessibility Act, Section 508, and national disability legislation worldwide.'
  },
  {
    id: 'crpd-21',
    name: 'UN CRPD Article 21',
    title: 'Freedom of Expression and Access to Information',
    adopted: '2006 (UN General Assembly)',
    body: 'United Nations Committee on the Rights of Persons with Disabilities',
    coreMandate:
      'Guarantees the freedom to seek, receive and impart information and ideas on an equal basis with others through all forms of communication of their choice.',
    keyClauses: [
      {
        clause: 'Article 21(a)',
        summary: 'Providing official public information in accessible formats and technologies appropriate to different kinds of disabilities in a timely manner and without additional cost.'
      },
      {
        clause: 'Article 21(b)',
        summary: 'Accepting and facilitating the official use of sign languages, Braille, augmentative and alternative communication (AAC), and all other accessible modes of choice.'
      },
      {
        clause: 'Article 21(c)',
        summary: 'Urging private entities that provide services to the general public, including through the Internet, to provide information and services in accessible and usable formats.'
      },
      {
        clause: 'Article 21(d)',
        summary: 'Encouraging mass media, including providers of information through the Internet, to make their content and services accessible.'
      }
    ],
    impact: 'Explicitly outlaws "disability surcharges" for accessible formats and mandates timely parity of public disclosures, voting materials, and governmental communication.'
  },
  {
    id: 'marrakesh',
    name: 'Marrakesh Treaty (WIPO)',
    title: 'Facilitating Access to Published Works for Print Disabilities',
    adopted: '2013 (World Intellectual Property Organization - WIPO)',
    body: 'Administered by WIPO; entered into force September 30, 2016',
    coreMandate:
      'Creates mandatory copyright exceptions allowing Authorized Entities to reproduce, distribute, and make available accessible-format copies (Braille, audiobooks, DAISY, large print) without authorization of copyright holders, and authorizes cross-border exchange between member states.',
    keyClauses: [
      {
        clause: 'Article 4 (National Exceptions)',
        summary: 'Contracting parties must enact statutory exceptions permitting Authorized Entities (libraries, schools, NGOs) to convert published works into accessible formats without royalties.'
      },
      {
        clause: 'Article 5 & 6 (Cross-Border Exchange)',
        summary: 'Authorizes the cross-border import and export of accessible format copies between member states, eliminating duplication of effort across language borders.'
      },
      {
        clause: 'Authorized Entities Definition',
        summary: 'Non-profit institutions, government agencies, or educational bodies providing education, instructional training, or adaptive reading to beneficiaries on a non-profit basis.'
      },
      {
        clause: 'Beneficiary Persons',
        summary: 'Persons who are blind, visually impaired, or have physical disabilities preventing them from holding or manipulating a book, or focusing/moving their eyes.'
      }
    ],
    impact: 'Directly combats the global "Book Famine", where fewer than 5% of published books were previously available in accessible formats in developing nations.'
  },
  {
    id: 'udhr',
    name: 'Universal Declaration of Human Rights (UDHR)',
    title: 'Foundational Charter of Human Dignity',
    adopted: '1948 (UN General Assembly Resolution 217 A)',
    body: 'United Nations General Assembly',
    coreMandate:
      'Affirms universal human rights, non-discrimination, and fundamental freedoms that set the philosophical and moral precedent for modern disability rights conventions.',
    keyClauses: [
      {
        clause: 'Article 1 & 2',
        summary: 'All human beings are born free and equal in dignity and rights without distinction of any kind.'
      },
      {
        clause: 'Article 19',
        summary: 'Everyone has the right to freedom of opinion and expression, including freedom to seek, receive and impart information and ideas through any media regardless of frontiers.'
      },
      {
        clause: 'Article 26',
        summary: 'Everyone has the right to education, directed to the full development of the human personality and strengthening of respect for human rights.'
      }
    ],
    impact: 'Provides the overarching human rights framework that shifted international law from viewing disability as a charitable medical issue to a fundamental equality mandate.'
  }
];

const SCENARIOS = [
  {
    id: 'case-1',
    title: 'Cross-Border Accessible Textbook Exchange',
    category: 'Marrakesh Treaty',
    scenario:
      'A university library in Canada has produced high-quality DAISY and Braille digital editions of 150 medical textbooks. A school for the visually impaired in Kenya wishes to import and distribute these copies to its blind students. The original textbook publisher threatens a copyright infringement lawsuit.',
    question: 'Under international disability law, what legal protection applies to this transaction?',
    options: [
      {
        id: 'A',
        text: 'The exchange is illegal under the Berne Convention unless the Kenyan school pays international copyright royalties for each student.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'The Marrakesh Treaty authorizes Authorized Entities (the Canadian library) to export accessible format copies to Authorized Entities or beneficiaries in another contracting party without rights holder permission.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'The transaction is only allowed if the publisher has explicitly placed the books into public domain.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'UN CRPD Article 9 exempts students from civil suits but does not grant cross-border copyright exceptions.',
        isCorrect: false
      }
    ],
    explanation:
      'The Marrakesh Treaty (WIPO 2013, Articles 5 & 6) specifically creates cross-border export and import mechanisms for accessible-format works produced by Authorized Entities (such as recognized libraries) without requiring copyright holder authorization or royalty payments.'
  },
  {
    id: 'case-2',
    title: 'Commercial Banking App Accessibility Scope',
    category: 'UN CRPD Article 9',
    scenario:
      'A multinational commercial bank releases an updated mobile banking application that is completely incompatible with screen readers. During a national regulatory review, the bank argues that UN CRPD Article 9 is an international treaty that only binds state government agencies and municipal portals, not private commercial entities.',
    question: 'How does UN CRPD Article 9 address private commercial entities offering public services?',
    options: [
      {
        id: 'A',
        text: 'The bank is correct; UN CRPD Article 9 applies solely to state-owned enterprises and public administration portals.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Article 9 applies to private commercial software only if the bank receives more than 50% of its operating revenue from government contracts.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Article 9.2(b) explicitly obligates States Parties to take measures to ensure that private entities that offer facilities and services to the public take into account all aspects of accessibility.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'CRPD Article 9 defers commercial private apps exclusively to ISO 9001 certification bodies without state oversight.',
        isCorrect: false
      }
    ],
    explanation:
      'CRPD Article 9.2(b) explicitly requires States Parties to enact measures to ensure that private entities that offer facilities and services to the public take into account all aspects of accessibility for persons with disabilities. This clause was the legal mandate behind domestic statutes like the European Accessibility Act.'
  },
  {
    id: 'case-3',
    title: 'Emergency Evacuation Broadcasts & Surcharges',
    category: 'UN CRPD Article 21',
    scenario:
      'During a public health crisis, a national health ministry distributes urgent video bulletins online without captions or sign language interpretation. When advocacy groups demand accessible formats, the agency offers an alternate captioned feed but charges a monthly $15 "adaptive accessibility media surcharge" to deaf subscribers.',
    question: 'Which specific obligations under UN CRPD Article 21 are violated here?',
    options: [
      {
        id: 'A',
        text: 'Article 21(a) requires providing information intended for the general public in accessible formats in a timely manner AND without additional cost.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Charging a fee is permitted as long as the fee covers the administrative cost of human transcription.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Only printed braille materials are protected under Article 21; video streaming falls under Article 30 (Recreation).',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'No violation exists as long as an accessible transcript is published within 60 business days.',
        isCorrect: false
      }
    ],
    explanation:
      'UN CRPD Article 21(a) explicitly mandates that States Parties provide information intended for the general public in accessible formats and technologies "in a timely manner and without additional cost". Imposing an accessibility surcharge is a direct treaty violation.'
  },
  {
    id: 'case-4',
    title: 'Shift from Charity/Medical to Human Rights Model',
    category: 'UDHR & CRPD Philosophy',
    scenario:
      'A legislative proposal categorizes accessibility accommodations as "discretionary humanitarian charity" that can be suspended whenever municipal budgets face deficits. Human rights legal scholars challenge this framing.',
    question: 'How do the UDHR and UN CRPD fundamentally frame digital and physical accessibility?',
    options: [
      {
        id: 'A',
        text: 'As an optional welfare benefit contingent on annual municipal budget surplus.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'As an inalienable, fundamental human right rooted in dignity, equality of opportunity, and full societal participation.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'As a medical rehabilitation intervention designed solely to cure individual physiological deficits.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'As a commercial consumer perk governed strictly by voluntary retail trade associations.',
        isCorrect: false
      }
    ],
    explanation:
      'The UN CRPD fundamentally marks a paradigm shift from viewing persons with disabilities as objects of charity, medical treatment and social protection toward viewing them as subjects with rights, who are capable of claiming those rights and making decisions for their lives based on free and informed consent.'
  }
];

export default function UnCrpdTreatyExplorerLab() {
  const [selectedTreatyId, setSelectedTreatyId] = useState('crpd-9');
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const activeTreaty = TREATIES.find(t => t.id === selectedTreatyId) || TREATIES[0];
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
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(16, 185, 129, 0.08))',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.25)',
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
              background: 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--arcade-blue)'
            }}
          >
            <Globe size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              UN CRPD & International Human Rights Treaty Explorer
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Explore UN CRPD Articles 9 & 21, the Marrakesh Treaty (WIPO 2013), and global human rights mandates
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Treaty Mastery
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
            title="Reset progress"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Treaty Exploration Tabs */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Select International Convention or Treaty:
        </div>
        <div
          role="tablist"
          aria-label="International Treaties"
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
          onKeyDown={(e) => {
            if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
            e.preventDefault();
            const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'));
            const idx = tabs.indexOf(document.activeElement);
            if (idx === -1) return;
            const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : e.key === 'ArrowLeft' ? (idx - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : tabs.length - 1;
            tabs[nextIdx]?.focus();
            tabs[nextIdx]?.click();
          }}
        >
          {TREATIES.map((treaty) => {
            const isSelected = treaty.id === selectedTreatyId;
            return (
              <button
                key={treaty.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedTreatyId(treaty.id);
                }}
                className={`tab-btn ${isSelected ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: '6px',
                  background: isSelected ? 'var(--card-bg)' : 'transparent',
                  border: isSelected ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: isSelected ? 'var(--accent-color)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <BookOpen size={14} />
                <span>{treaty.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Treaty Card */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeTreaty.name}: {activeTreaty.title}
              </span>
              <span
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--arcade-blue)',
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: 600
                }}
              >
                {activeTreaty.adopted}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <strong>Administering Body:</strong> {activeTreaty.body}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', borderLeft: '4px solid var(--arcade-blue)', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          <strong>Core Mandate:</strong> {activeTreaty.coreMandate}
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Key Articles & Enforceable Provisions:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.65rem' }}>
            {activeTreaty.keyClauses.map((c, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8rem',
                  lineHeight: 1.45
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--accent-color)', marginBottom: '0.25rem' }}>
                  {c.clause}
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {c.summary}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} style={{ color: 'var(--arcade-green)', flexShrink: 0 }} />
          <div>
            <strong>Global Impact:</strong> {activeTreaty.impact}
          </div>
        </div>
      </div>

      {/* Interactive Case Solver Bench */}
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
              Interactive Human Rights Case Solver
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
              background: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--arcade-blue)'
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
            <strong>Factual Scenario:</strong> {currentScenario.scenario}
          </div>
          <div style={{ fontWeight: 700, color: 'var(--accent-color)' }}>
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
            <strong>{isCorrect ? '✓ Correct Legal Analysis:' : '✗ Incorrect Legal Finding:'}</strong> {currentScenario.explanation}
          </div>
        )}

        {/* Case Stepper Navigation */}
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
