import React, { useState } from 'react';
import {
  Eye,
  Hand,
  Compass,
  Cpu,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Laptop,
  Smartphone,
  Server,
  Layers,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const POUR_PRINCIPLES = [
  {
    id: 'perceivable',
    name: '1. Perceivable',
    icon: Eye,
    color: '#38bdf8',
    coreDefinition: 'Information and user interface components must be presentable to users in ways they can perceive. It cannot be invisible to all of their senses.',
    webApplication: 'Text alternatives for images (1.1.1), captions for video (1.2.2), 4.5:1 text contrast (1.4.3), responsive reflow at 400% (1.4.10).',
    nonWebIctApplication: 'Under WCAG2ICT & EN 301 549: Self-service ticketing kiosks and ATMs must provide built-in speech synthesis output via standard 3.5mm audio jacks so non-sighted users can perceive screen output.'
  },
  {
    id: 'operable',
    name: '2. Operable',
    icon: Hand,
    color: 'var(--arcade-green)',
    coreDefinition: 'User interface components and navigation must be operable. The interface cannot require an interaction that a user cannot perform.',
    webApplication: 'All functionality available from a keyboard (2.1.1), no keyboard traps (2.1.2), adjustable timing timeouts (2.2.1), target size minimum 24x24px (2.5.8).',
    nonWebIctApplication: 'Physical kiosks must offer tactile numeric keypads with a raised dot on the "5" key, operable within ADA reach ranges (15" to 48" above the floor), with alternatives to complex path-based or biometric gestures.'
  },
  {
    id: 'understandable',
    name: '3. Understandable',
    icon: Compass,
    color: 'var(--arcade-yellow)',
    coreDefinition: 'Information and the operation of the user interface must be understandable. The content or operation cannot be beyond the user\'s understanding.',
    webApplication: 'Human language of page identified (3.1.1), predictable focus without context change on input (3.2.1, 3.2.2), clear error identification and suggestions (3.3.1, 3.3.3).',
    nonWebIctApplication: 'Touchscreen kiosks and native software must provide plain-language instructions, predictable navigation buttons, and clear step-by-step transaction recovery prompts when errors occur.'
  },
  {
    id: 'robust',
    name: '4. Robust',
    icon: Cpu,
    color: '#a855f7',
    coreDefinition: 'Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.',
    webApplication: 'Clean semantic markup, valid Name, Role, Value exposed for all custom widgets (4.1.2), and asynchronous status messages announced via live regions (4.1.3).',
    nonWebIctApplication: 'Native desktop and mobile software must interface directly with operating system accessibility APIs (Windows UIA, macOS NSAccessibility, Android Accessibility API) rather than drawing custom non-interactive bitmaps.'
  }
];

const SCENARIOS = [
  {
    id: 'pour-1',
    title: 'Closed Functionality Metro Transit Kiosk Audio Jack',
    category: 'Perceivable (WCAG2ICT)',
    scenario:
      'A municipal transit authority installs touchscreen ticket vending machines. The machines lack a 3.5mm headphone jack or built-in speaker, requiring riders to view the visual LCD screen to select train stops and purchase tickets.',
    question: 'Under WCAG Principle 1 (Perceivable) and WCAG2ICT / EN 301 549, why is this a critical barrier?',
    options: [
      {
        id: 'A',
        text: 'The visual transaction information is invisible to the senses of blind riders. Closed products must provide an audio jack with speech output so information is perceivable non-visually.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Ticketing kiosks are required to print all tickets in embossed braille paper only.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'The machine is violating Principle 4 (Robust) because passengers are not allowed to install NVDA onto the kiosk hard drive.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'No violation exists as long as the train station has fluorescent ceiling lights.',
        isCorrect: false
      }
    ],
    explanation:
      'Principle 1 (Perceivable) dictates that content cannot be invisible to all of a user\'s senses. In closed-functionality hardware where users cannot run personal screen readers, the kiosk must provide speech output (via headphone jack) to make visual information perceivable.'
  },
  {
    id: 'pour-2',
    title: 'Mobile Banking Shake-to-Undo Gesture Without Alternatives',
    category: 'Operable (WCAG 2.5.4)',
    scenario:
      'A banking smartphone app introduces a feature where shaking the physical phone cancels a wire transfer. There is no on-screen button, menu item, or voice command alternative to cancel the transfer.',
    question: 'Which POUR principle and success criterion does this design flaw violate?',
    options: [
      {
        id: 'A',
        text: 'Principle 2 (Operable) — specifically WCAG 2.5.4 (Motion Actuation), which requires that functions triggered by device motion must also be operable by standard user interface components.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Principle 1 (Perceivable) — because shaking a phone produces no visual text.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Principle 3 (Understandable) — because shaking a phone is too confusing to remember.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Principle 4 (Robust) — because motion sensors are prohibited by the W3C.',
        isCorrect: false
      }
    ],
    explanation:
      'Under Principle 2 (Operable), WCAG 2.5.4 (Motion Actuation) mandates that any functionality triggered by moving or shaking the device must also be operable via standard controls (like a button) for users with motor limitations or devices mounted in fixed wheelchair holders.'
  },
  {
    id: 'pour-3',
    title: 'Vague Error Dialog "An Error Has Occurred"',
    category: 'Understandable (WCAG 3.3.1)',
    scenario:
      'A job applicant fills out a 20-field employment application and clicks Submit. The page reloads, scrolls to the top, and displays a red banner stating: "An error has occurred. Please fix your errors." None of the 20 input fields are highlighted or described.',
    question: 'Which POUR principle and criteria are violated by this notification failure?',
    options: [
      {
        id: 'A',
        text: 'Principle 3 (Understandable) — specifically WCAG 3.3.1 (Error Identification), which requires that if an input error is detected, the item in error is identified and the error is described to the user in text.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Principle 2 (Operable) — because the user is required to press the Enter key.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Principle 1 (Perceivable) — because red banners are illegal under international law.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Principle 4 (Robust) — because forms must be submitted through FTP servers.',
        isCorrect: false
      }
    ],
    explanation:
      'Principle 3 (Understandable) requires the operation of the interface to be clear. WCAG 3.3.1 explicitly requires that when an input error occurs, the system must specifically identify which field failed and explain why in text so the user understands how to remediate it.'
  },
  {
    id: 'pour-4',
    title: 'Custom Dropdown Drawn with HTML Divs & Canvas',
    category: 'Robust (WCAG 4.1.2)',
    scenario:
      'A web portal replaces native <select> menus with custom <div class="drop-box"> elements drawn with CSS and JavaScript canvas. The developers provided no role, aria-expanded, or aria-haspopup attributes. Sighted mouse users can click options, but screen readers announce only "Blank" or "Section".',
    question: 'Why is this a direct violation of Principle 4 (Robust)?',
    options: [
      {
        id: 'A',
        text: 'Because assistive technologies rely on programmatic Name, Role, and Value (WCAG 4.1.2) exposed through the accessibility API. When custom div soup lacks ARIA roles and states, it fails the robustness mandate to be reliably interpreted by user agents.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Because HTML <div> elements are deprecated in modern web standards.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Because dropdowns are only permitted on mobile phones.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Because canvas elements must be watermarked with a copyright symbol.',
        isCorrect: false
      }
    ],
    explanation:
      'Principle 4 (Robust) mandates that content must be interpretable by diverse user agents and assistive technologies. Under WCAG 4.1.2 (Name, Role, Value), custom UI components must expose their role (e.g. combobox/listbox) and state (expanded/collapsed) so screen readers can interpret and manipulate them.'
  }
];

export default function WcagPourPrinciplesLab() {
  const [selectedPrincipleId, setSelectedPrincipleId] = useState('perceivable');
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const activePrinciple = POUR_PRINCIPLES.find(p => p.id === selectedPrincipleId) || POUR_PRINCIPLES[0];
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
            <Compass size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              WCAG POUR Principles & Non-Web ICT Application Lab
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Explore Perceivable, Operable, Understandable, and Robust across web, mobile apps, and closed kiosks (WCAG2ICT)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              POUR Score
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

      {/* POUR Principle Selector Tabs */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Select WCAG Principle (POUR):
        </div>
        <div role="tablist" onKeyDown={(e) => {
          if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
          e.preventDefault();
          const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'));
          const idx = tabs.indexOf(document.activeElement);
          if (idx === -1) return;
          const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : e.key === 'ArrowLeft' ? (idx - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : tabs.length - 1;
          tabs[nextIdx]?.focus();
          tabs[nextIdx]?.click();
        }} aria-label="POUR Principles" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {POUR_PRINCIPLES.map((p) => {
            const isSelected = p.id === selectedPrincipleId;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedPrincipleId(p.id);
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
                  border: isSelected ? `1px solid ${p.color}` : '1px solid var(--border-color)',
                  color: isSelected ? p.color : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Principle Detail Card */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: activePrinciple.color }}>
            {activePrinciple.name}
          </span>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
            Foundation Principle
          </span>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', borderLeft: `4px solid ${activePrinciple.color}`, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          <strong>Core Definition:</strong> {activePrinciple.coreDefinition}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Laptop size={14} /> Web & Digital Document Application
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {activePrinciple.webApplication}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--arcade-green)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Server size={14} /> Non-Web Software & Kiosks (WCAG2ICT)
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {activePrinciple.nonWebIctApplication}
            </div>
          </div>
        </div>
      </div>

      {/* Case Solver Bench */}
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
              POUR Principles Diagnostic Bench
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
            <strong>Inspection Scenario:</strong> {currentScenario.scenario}
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
            <strong>{isCorrect ? '✓ Correct POUR Principle Analysis:' : '✗ Incorrect Finding:'}</strong> {currentScenario.explanation}
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
