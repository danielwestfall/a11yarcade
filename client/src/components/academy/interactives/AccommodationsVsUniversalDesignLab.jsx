import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale,
  DollarSign,
  Heart,
  Lightbulb,
  Building2,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const CASES = [
  {
    id: 'case-1',
    title: 'Workplace Screen Reading & Digital Materials',
    employee: 'Jordan, Senior Financial Analyst (Blind screen reader user)',
    reactiveApproach: {
      name: 'Reactive One-Off Accommodation',
      cost: '$2,400 + 6 weeks delay',
      steps: 'Jordan files a formal medical disclosure. HR hires an outside agency to remediate Jordan\'s specific onboarding spreadsheets after Jordan cannot access them on day 1.',
      drawbacks: 'Delayed start, medical privacy exposed to team, future spreadsheets remain inaccessible, stigma of "special treatment".'
    },
    universalApproach: {
      name: 'Systemic Universal Design',
      cost: '$0 ongoing (Standard corporate template overhaul)',
      steps: 'Company enforces accessible Excel/Word templates with built-in heading hierarchy, table headers, and color contrast. All internal software is audited for WCAG 2.1 AA compliance before purchase.',
      benefits: 'Jordan is productive on day 1 with zero delay; benefits future employees, interns, and temporary screen reader users without requiring disclosure.'
    }
  },
  {
    id: 'case-2',
    title: 'All-Hands Global Town Hall Meeting',
    employee: 'Priya, Marketing Coordinator (Hard of hearing) + 300 Global Remote Staff',
    reactiveApproach: {
      name: 'Reactive One-Off Accommodation',
      cost: '$800 per meeting',
      steps: 'Priya submits an ADA accommodation form 2 weeks in advance of each monthly town hall. Company schedules a CART stenographer solely into Priya\'s private video stream.',
      drawbacks: 'High recurring cost; Priya misses unscheduled ad-hoc meetings; other non-native speakers or staff in loud environments receive zero benefit.'
    },
    universalApproach: {
      name: 'Systemic Universal Design',
      cost: '$0 (Enterprise platform feature toggle)',
      steps: 'Enable automated live captioning (ASR) by default on all company Zoom/Teams video conferences, plus record and publish searchable transcripts within 24 hours.',
      benefits: 'Priya has immediate access to every meeting without paperwork; non-native English speakers, staff in noisy environments, and team members catching up benefit equally.'
    }
  },
  {
    id: 'case-3',
    title: 'Workplace Fatigue & Neurodivergent Focus',
    employee: 'Marcus, Software Engineer (ADHD & Chronic Pain)',
    reactiveApproach: {
      name: 'Reactive One-Off Accommodation',
      cost: '$1,200 (Doctor notes & ergonomic assessment)',
      steps: 'Marcus requires a formal medical diagnosis to request core working hours flexibility and a quiet desk in a private office away from the open-floor layout.',
      drawbacks: 'High bureaucratic friction; requires medical disclosure; other neurodivergent or introverted employees suffer burnout quietly.'
    },
    universalApproach: {
      name: 'Systemic Universal Design',
      cost: '$0 policy shift',
      steps: 'Company adopts asynchronous-first communication, core collaboration hours (10am-2pm), dedicated quiet focus booths, and noise-canceling headphones as standard office equipment.',
      benefits: 'Reduces burnout across the entire engineering department, increases overall code velocity, and supports neurodiverse talent organically.'
    }
  }
];

const SCENARIOS = [
  {
    id: 'quiz-1',
    title: 'JAN (Job Accommodation Network) Cost Data',
    category: 'Workplace Accommodations',
    scenario:
      'A corporate hiring manager hesitates to extend an offer to a qualified applicant who uses a wheelchair and screen reader, assuming that providing workplace accommodations will cost the department tens of thousands of dollars.',
    question: 'According to empirical research by the Job Accommodation Network (JAN), what do most workplace accommodations actually cost?',
    options: [
      {
        id: 'A',
        text: 'Over 50% of workplace accommodations cost exactly $0, and the median one-time cost for accommodations that do have an expense is only around $500.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'The average accommodation costs between $25,000 and $40,000 per year.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Accommodations must legally equal 10% of the employee\'s base salary.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'All workplace accommodations are 100% reimbursed by the United Nations.',
        isCorrect: false
      }
    ],
    explanation:
      'Extensive surveys conducted by the Job Accommodation Network (JAN) show that 56% of workplace accommodations cost absolutely nothing ($0). Of those that did incur a cost, the median one-time expenditure was approximately $500, yielding substantial business returns in employee retention and productivity.'
  },
  {
    id: 'quiz-2',
    title: 'Fundamental Paradigm Difference: Accommodations vs Universal Design',
    category: 'Design Philosophy',
    scenario:
      'A university IT department responds to accessibility by waiting until a blind student enrolls, then spending 8 weeks retrofitting each course webpage manually. A faculty committee argues this violates universal design principles.',
    question: 'How do Individualized Accommodations and Universal Design fundamentally differ?',
    options: [
      {
        id: 'A',
        text: 'Accommodations are reactive retrofits tailored to a specific individual after disclosure; Universal Design is proactive systemic design that makes products usable by the widest possible audience without retrofits or disclosure.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Accommodations are for physical spaces only, while Universal Design is only for software.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Universal Design completely eliminates the legal need for individualized accommodations in all human situations.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Accommodations are free, while Universal Design is always funded by municipal tax bonds.',
        isCorrect: false
      }
    ],
    explanation:
      'Accommodations are reactive adjustments made for a specific individual upon formal request or medical disclosure. In contrast, Universal Design is proactive, designing environments and tools from the start so that as many people as possible can use them naturally without specialized retrofits.'
  },
  {
    id: 'quiz-3',
    title: 'The "Undue Hardship" Legal Threshold',
    category: 'ADA Title I & Legal Mandates',
    scenario:
      'An enterprise with $800 million in annual profits denies an employee\'s request for a $300 ergonomic vertical mouse and screen magnification license, claiming it constitutes an "Undue Hardship" on the business.',
    question: 'Under ADA Title I and international employment regulations, what defines "Undue Hardship"?',
    options: [
      {
        id: 'A',
        text: 'An action requiring significant difficulty or expense when considered in light of the overall financial resources, size, and operational structure of the entire employer.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Any expense that exceeds $50 from a department\'s petty cash drawer.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Any accommodation that requires an IT administrator to reboot a computer.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Any adjustment that is not approved by unanimous vote of all coworkers.',
        isCorrect: false
      }
    ],
    explanation:
      'Under the ADA, "undue hardship" means an accommodation would require significant difficulty or expense when assessed against the overall financial resources of the parent enterprise. For an enterprise with hundreds of millions in revenue, a $300 software license can never meet the legal threshold for undue hardship.'
  },
  {
    id: 'quiz-4',
    title: 'Privacy and the "Interactive Process"',
    category: 'Employment Civil Rights',
    scenario:
      'An employee with epilepsy requests permission to work under reduced fluorescent lighting and avoid video meetings with strobing animations. The supervisor demands to see the employee\'s entire childhood medical history before discussing adjustments.',
    question: 'How should the interactive accommodation process be conducted respectfully and legally?',
    options: [
      {
        id: 'A',
        text: 'Through a collaborative, respectful dialogue focused strictly on functional workplace limitations and reasonable solutions, requesting only documentation that directly verifies the impairment and need for accommodation while maintaining medical confidentiality.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'By broadcasting the employee\'s medical condition on the office intranet bulletin board.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'By immediately demoting the employee to an unpaid part-time position.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Supervisors are prohibited from speaking with employees who have health conditions.',
        isCorrect: false
      }
    ],
    explanation:
      'The ADA requires a collaborative "interactive process" between employer and employee. Inquiries and documentation must be strictly limited to the functional job-related limitations and the accommodation requested; employers may not demand unrelated medical histories or disclose medical data to colleagues.'
  }
];

export default function AccommodationsVsUniversalDesignLab() {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const currentCase = CASES[activeCaseIdx];
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
    setActiveCaseIdx(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(168, 85, 247, 0.08))',
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
            <Scale size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Individual Accommodations vs Systemic Universal Design
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Master reactive one-off workplace adjustments (JAN data) versus proactive universal design transformation
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Mastery Score
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

      {/* Case Study Comparison Bench */}
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
              Workplace Transformation Case Bench
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentCase.title}
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {CASES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveCaseIdx(i);
                }}
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  background: activeCaseIdx === i ? '#38bdf8' : 'var(--bg-secondary)',
                  color: activeCaseIdx === i ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                Case #{i + 1}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          <strong>Context:</strong> {currentCase.employee}
        </div>

        {/* Comparison Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Reactive Accommodation Card */}
          <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ef4444' }}>
                {currentCase.reactiveApproach.name}
              </span>
              <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.4rem', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700 }}>
                {currentCase.reactiveApproach.cost}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.45, color: 'var(--text-primary)' }}>
              {currentCase.reactiveApproach.steps}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#ef4444', borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: '0.4rem' }}>
              <strong>Drawbacks:</strong> {currentCase.reactiveApproach.drawbacks}
            </div>
          </div>

          {/* Universal Design Transformation Card */}
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--arcade-green)' }}>
                {currentCase.universalApproach.name}
              </span>
              <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.4rem', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--arcade-green)', fontWeight: 700 }}>
                {currentCase.universalApproach.cost}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.45, color: 'var(--text-primary)' }}>
              {currentCase.universalApproach.steps}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--arcade-green)', borderTop: '1px solid rgba(16, 185, 129, 0.2)', paddingTop: '0.4rem' }}>
              <strong>Systemic Value:</strong> {currentCase.universalApproach.benefits}
            </div>
          </div>
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
              Employment & Accommodation Case Examiner
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
            <strong>Factual Scenario:</strong> {currentScenario.scenario}
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
            <strong>{isCorrect ? '✓ Correct Employment Law Analysis:' : '✗ Incorrect Finding:'}</strong> {currentScenario.explanation}
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
