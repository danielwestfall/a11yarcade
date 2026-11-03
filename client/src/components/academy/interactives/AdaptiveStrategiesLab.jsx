import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ZoomIn,
  Mic,
  MousePointer,
  ToggleLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Contrast,
  Volume2,
  AlertTriangle,
  Play,
  Square
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const STRATEGY_MODES = [
  {
    id: 'magnifier',
    title: 'Screen Magnifier Viewport & Panning (200%–800%)',
    short: 'Magnification Viewport',
    icon: ZoomIn,
    userProfile: 'Low vision users (macular degeneration, tunnel vision, low acuity).',
    coreChallenge: 'Loss of visual context, difficulty locating off-screen notifications, and modal traps.',
    wcagCriteria: 'WCAG 1.4.4 (Resize Text) & WCAG 1.4.10 (Reflow 400%)'
  },
  {
    id: 'switch-access',
    title: 'Switch Device Single/Dual Scanning Bench',
    short: 'Switch Scanning',
    icon: ToggleLeft,
    userProfile: 'Users with severe motor limitations (ALS, quadriplegia, cerebral palsy).',
    coreChallenge: 'Linear scanning fatigue; each unnecessary link or nested container requires seconds of waiting.',
    wcagCriteria: 'WCAG 2.4.1 (Bypass Blocks / Skip Links) & WCAG 2.1.1 (Keyboard)'
  },
  {
    id: 'speech-input',
    title: 'Speech Recognition Command Grammar (Dragon / Voice Access)',
    short: 'Speech Command Input',
    icon: Mic,
    userProfile: 'Users operating computers entirely via voice commands (Dragon, Windows Voice Access).',
    coreChallenge: 'Mismatch between visible label and programmatic accessible name renders buttons unclickable by voice.',
    wcagCriteria: 'WCAG 2.5.3 (Label in Name) & WCAG 4.1.2 (Name, Role, Value)'
  },
  {
    id: 'forced-colors',
    title: 'Operating System High Contrast & Forced Colors',
    short: 'Forced Colors Mode',
    icon: Contrast,
    userProfile: 'Users requiring high visual contrast (White on Black, Desert, Aquatic).',
    coreChallenge: 'CSS background colors and box-shadows are stripped, rendering borderless buttons invisible.',
    wcagCriteria: 'WCAG 1.4.3 (Contrast Minimum) & CSS forced-colors: active'
  }
];

const SCENARIOS = [
  {
    id: 'case-1',
    title: 'Speech Recognition "Label in Name" Mismatch',
    category: 'Speech Recognition (WCAG 2.5.3)',
    scenario:
      'A shopping website has a button displaying the visual text "Checkout". In the HTML, the developer coded: <button aria-label="Proceed to Secure Payment Gateway">Checkout</button>. A user with motor disabilities using Dragon NaturallySpeaking speaks: "Click Checkout". Nothing happens.',
    question: 'Why did the voice command fail, and what does WCAG 2.5.3 (Label in Name) mandate?',
    options: [
      {
        id: 'A',
        text: 'Speech recognition software matches spoken words against the programmatic accessible name. When aria-label completely overrides the visible text without including "Checkout", voice commands fail. Remediation: Ensure the visible text ("Checkout") is included at the beginning of the accessible name.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Speech recognition tools cannot process English verbs with more than two syllables.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'The user must disconnect their microphone and use a physical foot pedal.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Voice software always ignores buttons and only clicks plain text paragraphs.',
        isCorrect: false
      }
    ],
    explanation:
      'Under WCAG 2.5.3 (Level A), for components with labels that include text or images of text, the accessible name must contain the text that is presented visually. If the visible text is "Checkout", the accessible name cannot be replaced with something completely different that omits the word "Checkout".'
  },
  {
    id: 'case-2',
    title: 'Switch Device Scanning Fatigue & Missing Skip Links',
    category: 'Switch Scanning (WCAG 2.4.1)',
    scenario:
      'An e-commerce portal has a mega-menu with 65 navigation links in the header before the main content. A single-switch user utilizing an auto-scan cycle with 1.5-second dwell intervals visits 4 pages to compare products. The site lacks a "Skip to Main Content" link.',
    question: 'What is the operational impact on this switch user, and how does WCAG 2.4.1 resolve it?',
    options: [
      {
        id: 'A',
        text: 'The user must wait through approximately 97 seconds (65 links × 1.5s) of scanning on every single page load before reaching product details. A Skip Link allows the user to bypass the header on the very first scan stop.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Switch users are legally prohibited from browsing shopping websites without a guardian.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'The browser automatically collapses all menus for switch users so skip links are unnecessary.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Switch devices only work if the page contains zero CSS styles.',
        isCorrect: false
      }
    ],
    explanation:
      'For switch access users, navigating linearly through repetitive navigation blocks is physically exhausting and time-consuming. WCAG 2.4.1 (Bypass Blocks) requires a mechanism, such as a prominent keyboard "Skip to main content" link, allowing users to jump directly to primary content on the first focus stop.'
  },
  {
    id: 'case-3',
    title: 'Screen Magnifier Viewport Trapping & Remote Toasts',
    category: 'Screen Magnification (WCAG 1.4.10)',
    scenario:
      'A user magnified at 500% clicks "Save Profile" at the bottom center of the page. The system saves successfully and triggers a subtle green toast alert in the extreme top-right corner of the desktop viewport (which is currently 4 screens away off the magnified display). The user receives no feedback and clicks "Save" 10 times.',
    question: 'How should feedback be delivered to accommodate magnified viewport limitations?',
    options: [
      {
        id: 'A',
        text: 'Pair visible feedback near the trigger element or move focus to the alert confirmation, and expose status updates via an ARIA live region (role="status" or aria-live="polite") so screen magnifiers with speech announce it regardless of viewport position.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Prohibit magnification levels higher than 125% via CSS viewport meta tags.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Play a piercing 120-decibel siren every time any button is clicked.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Lock the user\'s screen resolution permanently to 800x600 VGA.',
        isCorrect: false
      }
    ],
    explanation:
      'At high magnification (400%+), users see only a small rectangular slice of the display. Floating toast alerts at the viewport periphery are invisible unless accompanied by programmatic focus shifts, proximity to the trigger, or ARIA live region speech announcements.'
  },
  {
    id: 'case-4',
    title: 'Windows High Contrast Invisible Button Outlines',
    category: 'Forced Colors Mode',
    scenario:
      'A web app styles its primary buttons using background-color: #2563eb; border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.2). When a low-vision user turns on Windows High Contrast Black theme, the CSS background and box-shadow are discarded by the operating system, leaving white text floating on black with no button boundary.',
    question: 'What modern CSS best practice ensures button boundaries remain visible in forced-colors mode?',
    options: [
      {
        id: 'A',
        text: 'Provide an explicit transparent border (e.g. border: 1px solid transparent). In forced-colors mode, the OS automatically renders transparent borders using the system ButtonText or CanvasText color.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Use forced-color-adjust: none on the entire <body> to completely disable high contrast mode.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Replace all buttons with animated Flash widgets.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'High contrast mode is obsolete and should be rejected with an HTTP 403 error.',
        isCorrect: false
      }
    ],
    explanation:
      'In Windows High Contrast and CSS forced-colors mode, CSS backgrounds and box-shadows are stripped. Adding border: 1px (or 2px) solid transparent is invisible in normal mode but automatically turns into a visible system border in high contrast mode, preserving interactive boundaries.'
  }
];

export default function AdaptiveStrategiesLab() {
  const [activeStrategyId, setActiveStrategyId] = useState('magnifier');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [currentScanIdx, setCurrentScanIdx] = useState(0);
  const [speechCommand, setSpeechCommand] = useState('');
  const [speechStatus, setSpeechStatus] = useState('');
  const [isForcedColorsActive, setIsForcedColorsActive] = useState(false);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const activeStrategy = STRATEGY_MODES.find(s => s.id === activeStrategyId) || STRATEGY_MODES[0];
  const currentScenario = SCENARIOS[activeScenarioIdx];
  const selectedOption = userAnswers[currentScenario.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && currentScenario.options.find(o => o.id === selectedOption)?.isCorrect;

  // Scan simulation interval
  useEffect(() => {
    let timer = null;
    if (isScanningActive) {
      timer = setInterval(() => {
        setCurrentScanIdx(prev => (prev + 1) % 5);
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isScanningActive]);

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

  const handleTestVoiceCommand = (cmd) => {
    setSpeechCommand(cmd);
    if (cmd.toLowerCase() === 'click checkout') {
      soundManager.playIncorrect();
      setSpeechStatus('❌ Command Failed: Visual label "Checkout" does not match programmatic name "Proceed to Secure Payment Gateway" (WCAG 2.5.3 Violation)');
    } else if (cmd.toLowerCase() === 'click proceed to secure payment gateway') {
      soundManager.playCorrect();
      setSpeechStatus('✓ Button Clicked: Matched hidden aria-label, but motor user cannot guess this without visual indicator!');
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setUserAnswers({});
    setScore(0);
    setActiveScenarioIdx(0);
    setZoomLevel(100);
    setIsScanningActive(false);
    setCurrentScanIdx(0);
    setSpeechCommand('');
    setSpeechStatus('');
    setIsForcedColorsActive(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.08))',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
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
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--arcade-green)'
            }}
          >
            <Sliders size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Assistive Strategies & Adaptive Hardware Input Simulator
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Simulate Screen Magnification Viewports, Switch Device Auto-Scanning, Speech Recognition Grammars & High Contrast
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Strategies Score
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

      {/* Strategy Mode Tabs */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Select Assistive Strategy Mode:
        </div>
        <div role="tablist" aria-label="Assistive Strategies" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {STRATEGY_MODES.map((mode) => {
            const isSelected = mode.id === activeStrategyId;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  soundManager.playClick();
                  setActiveStrategyId(mode.id);
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
                  border: isSelected ? '1px solid var(--arcade-green)' : '1px solid var(--border-color)',
                  color: isSelected ? 'var(--arcade-green)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} />
                <span>{mode.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Mode Overview Card */}
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
            {activeStrategy.title}
          </span>
          <span
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--arcade-green)'
            }}
          >
            {activeStrategy.wcagCriteria}
          </span>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', borderLeft: '4px solid var(--arcade-green)', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          <strong>User Profile:</strong> {activeStrategy.userProfile}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Critical Design Caveat:</strong> {activeStrategy.coreChallenge}
        </div>
      </div>

      {/* Interactive Hands-On Simulation Workbench */}
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
              Interactive Strategy Workbench
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {activeStrategyId === 'magnifier' && 'Magnification Viewport Simulator'}
              {activeStrategyId === 'switch-access' && 'Switch Single/Dual Step-Scan Simulator'}
              {activeStrategyId === 'speech-input' && 'Voice Recognition Label Matching'}
              {activeStrategyId === 'forced-colors' && 'CSS Forced-Colors High Contrast Inspector'}
            </h4>
          </div>

          {/* Workbench Controls by Mode */}
          {activeStrategyId === 'magnifier' && (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[100, 200, 400, 800].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setZoomLevel(z);
                  }}
                  style={{
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    background: zoomLevel === z ? 'var(--arcade-green)' : 'var(--bg-surface-elevated)',
                    color: zoomLevel === z ? '#090d16' : 'var(--text-primary)',
                    fontWeight: 700,
                    border: zoomLevel === z ? '1px solid var(--arcade-green)' : '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  {z}% Zoom
                </button>
              ))}
            </div>
          )}

          {activeStrategyId === 'switch-access' && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsScanningActive(prev => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: '4px',
                background: isScanningActive ? '#ef4444' : 'var(--arcade-green)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isScanningActive ? <Square size={13} /> : <Play size={13} />}
              {isScanningActive ? 'Stop Auto-Scan' : 'Start Auto-Scan (1.2s)'}
            </button>
          )}

          {activeStrategyId === 'forced-colors' && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsForcedColorsActive(prev => !prev);
              }}
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: '4px',
                background: isForcedColorsActive ? '#ffffff' : '#000000',
                color: isForcedColorsActive ? '#000000' : '#ffffff',
                border: '1px solid #38bdf8',
                cursor: 'pointer'
              }}
            >
              High Contrast: {isForcedColorsActive ? 'ACTIVE (White on Black)' : 'OFF (Standard)'}
            </button>
          )}
        </div>

        {/* Workbench Interactive Canvas */}
        <div
          style={{
            background: isForcedColorsActive ? '#000000' : 'var(--bg-secondary)',
            color: isForcedColorsActive ? '#ffffff' : 'var(--text-primary)',
            padding: '1.25rem',
            borderRadius: '6px',
            border: isForcedColorsActive ? '2px solid #ffffff' : '1px solid var(--border-color)',
            minHeight: '180px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Magnifier Simulation */}
          {activeStrategyId === 'magnifier' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.3s ease',
                  width: `${(100 / (zoomLevel / 100))}%`
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Patient Health Portal</h3>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
                  Welcome back, Alex. Your prescription for Amoxicillin 500mg is ready for refill pickup.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="primary-btn" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Confirm Refill</button>
                  <button className="secondary-btn" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Pharmacy Hours</button>
                </div>
              </div>

              {zoomLevel >= 400 && (
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '4px', fontSize: '0.75rem', color: '#ef4444' }}>
                  ⚠️ Magnification Insight: At {zoomLevel}%, the user only sees ~{Math.round(10000 / zoomLevel)}% of the original viewport width. Right-aligned chat widgets and top notifications are entirely cut off!
                </div>
              )}
            </div>
          )}

          {/* Switch Access Simulation */}
          {activeStrategyId === 'switch-access' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Simulating automatic sequential item scan loop. Active item highlights with high-contrast ring:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Home', 'Products', 'Pricing', 'Documentation', 'Contact Support'].map((label, idx) => {
                  const isHighlighted = isScanningActive && currentScanIdx === idx;
                  return (
                    <div
                      key={label}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        background: isHighlighted ? 'var(--arcade-yellow)' : 'var(--card-bg)',
                        color: isHighlighted ? '#000000' : 'var(--text-primary)',
                        border: isHighlighted ? '3px solid #facc15' : '1px solid var(--border-color)',
                        fontWeight: isHighlighted ? 800 : 500,
                        transform: isHighlighted ? 'scale(1.05)' : 'none',
                        transition: 'all 0.15s ease',
                        fontSize: '0.85rem'
                      }}
                    >
                      {label} {isHighlighted && '⚡ [Scan Focus]'}
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Notice: Without a Skip Link, the switch user must wait for each item in sequence (1.2s × item count) on every page refresh before reaching content.
              </div>
            </div>
          )}

          {/* Speech Input Simulation */}
          {activeStrategyId === 'speech-input' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Target Button Code:
                </div>
                <code style={{ fontSize: '0.8rem', color: '#38bdf8', background: '#0f172a', padding: '0.35rem 0.65rem', borderRadius: '4px', display: 'block' }}>
                  &lt;button aria-label="Proceed to Secure Payment Gateway"&gt;Checkout&lt;/button&gt;
                </code>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Try Voice Commands:</span>
                <button
                  type="button"
                  onClick={() => handleTestVoiceCommand('Click Checkout')}
                  className="secondary-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  <Mic size={14} /> Speak: "Click Checkout"
                </button>

                <button
                  type="button"
                  onClick={() => handleTestVoiceCommand('Click Proceed to Secure Payment Gateway')}
                  className="secondary-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  <Mic size={14} /> Speak: "Click Proceed to..."
                </button>
              </div>

              {speechStatus && (
                <div style={{ padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', lineHeight: 1.45, background: speechStatus.startsWith('❌') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', border: `1px solid ${speechStatus.startsWith('❌') ? '#ef4444' : 'var(--arcade-green)'}`, color: 'var(--text-primary)' }}>
                  {speechStatus}
                </div>
              )}
            </div>
          )}

          {/* Forced Colors Simulation */}
          {activeStrategyId === 'forced-colors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem' }}>
                Compare standard buttons (borderless with CSS background) versus accessible buttons (transparent border):
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Defective Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <button
                    type="button"
                    style={{
                      background: isForcedColorsActive ? 'transparent' : '#2563eb',
                      color: isForcedColorsActive ? '#ffffff' : '#ffffff',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    Submit Order (No Border)
                  </button>
                  <span style={{ fontSize: '0.72rem', color: isForcedColorsActive ? '#ef4444' : 'var(--text-muted)' }}>
                    {isForcedColorsActive ? '❌ Defect: Background stripped, button boundary invisible!' : 'Looks fine in standard CSS'}
                  </span>
                </div>

                {/* Remediated Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <button
                    type="button"
                    style={{
                      background: isForcedColorsActive ? 'transparent' : '#10b981',
                      color: isForcedColorsActive ? '#ffffff' : '#ffffff',
                      border: isForcedColorsActive ? '2px solid #ffffff' : '2px solid transparent',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    Submit Order (Transparent Border)
                  </button>
                  <span style={{ fontSize: '0.72rem', color: isForcedColorsActive ? 'var(--arcade-green)' : 'var(--text-muted)' }}>
                    {isForcedColorsActive ? '✓ Remediated: OS automatically renders visible border!' : 'Transparent border in normal mode'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Strategies Case Challenges */}
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
              Adaptive Strategies Case Examiner
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
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--arcade-green)'
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
            <strong>Strategy Scenario:</strong> {currentScenario.scenario}
          </div>
          <div style={{ fontWeight: 700, color: 'var(--arcade-green)' }}>
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
            <strong>{isCorrect ? '✓ Correct Strategy Analysis:' : '✗ Incorrect Diagnosis:'}</strong> {currentScenario.explanation}
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
