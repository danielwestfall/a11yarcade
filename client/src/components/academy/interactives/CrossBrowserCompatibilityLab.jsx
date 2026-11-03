import React, { useState } from 'react';
import {
  Layers,
  Monitor,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Cpu,
  Smartphone,
  Laptop,
  Terminal,
  Volume2,
  AlertTriangle,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const PAIRINGS = [
  {
    id: 'nvda-firefox',
    name: 'NVDA + Firefox',
    os: 'Windows 11',
    engine: 'Gecko',
    api: 'IAccessible2 (IA2) + MSAA',
    description: 'Gold-standard open-source pairing on Windows. Uses IAccessible2 directly without intermediating proprietary UIA translation layers.',
    modeSwitching: 'Browse Mode (Virtual Buffer) vs Focus Mode (Keys passed directly to web control). Press NVDA+Space to manually toggle.',
    quirks: 'Virtual cursor sometimes gets stuck in complex tables or nested landmark containers; relies heavily on standard HTML elements over ARIA emulation.'
  },
  {
    id: 'jaws-chrome',
    name: 'JAWS + Chrome / Edge',
    os: 'Windows 11',
    engine: 'Blink',
    api: 'UI Automation (UIA) & IAccessible2',
    description: 'Most common enterprise corporate pairing. JAWS hooks deeply into Blink via Chromium accessibility tree and IA2/UIA.',
    modeSwitching: 'Virtual PC Cursor vs Forms Mode. Automatic Forms Mode activates upon Tab into inputs, but custom ARIA composite widgets may require explicit role="application".',
    quirks: 'Aggressively buffers offscreen DOM; can report stale text if dynamic content updates without triggering explicit DOM mutation events or live region alerts.'
  },
  {
    id: 'vo-safari',
    name: 'VoiceOver + Safari',
    os: 'macOS Sonoma / iOS 17',
    engine: 'WebKit',
    api: 'NSAccessibility (macOS) / UIAccessibility (iOS)',
    description: 'Native Apple ecosystem stack. Does NOT use a virtual buffer; navigates the live DOM tree directly via Rotor and VO cursor keys (Control+Option).',
    modeSwitching: 'No virtual buffer toggle; interaction is controlled via Enter/Escape group drilling (VO+Shift+Down to interact, VO+Shift+Up to stop interacting).',
    quirks: 'Announces both DOM text mutations and aria-live announcements simultaneously if innerHTML is replaced; custom comboboxes fail if aria-controls points across shadow DOM.'
  },
  {
    id: 'talkback-chrome',
    name: 'TalkBack + Chrome',
    os: 'Android 14',
    engine: 'Blink',
    api: 'Android Accessibility Framework (AccessibilityNodeInfo)',
    description: 'Dominant mobile Android screen reader. Uses touch exploration, two-finger gestures, and linear swipe-right navigation.',
    modeSwitching: 'Touch Explore vs Linear Reading Granularities (Headings, Controls, Links, Characters, Words).',
    quirks: 'Accessibility events can be throttled during high GPU animations; non-interactive elements with click listeners fail to be recognized unless role="button" and tabindex="0" are explicitly supplied.'
  }
];

const WIDGETS = [
  {
    id: 'disclosure',
    name: 'Expandable Accordion / Disclosure',
    htmlCode: '<button aria-expanded="true" aria-controls="faq-panel">\n  Frequently Asked Questions\n</button>\n<div id="faq-panel" role="region">\n  Content goes here...\n</div>',
    apiMapping: {
      role: 'ROLE_SYSTEM_PUSHBUTTON (IA2) / AXButton (WebKit)',
      state: 'STATE_SYSTEM_EXPANDED / AXExpanded = true',
      name: '"Frequently Asked Questions"',
      action: 'Press / Click toggles aria-expanded'
    },
    speechOutput: {
      'nvda-firefox': '"Frequently Asked Questions, button, expanded"',
      'jaws-chrome': '"Frequently Asked Questions, button, expanded. Press Enter to collapse."',
      'vo-safari': '"Frequently Asked Questions, expanded, button"',
      'talkback-chrome': '"Frequently Asked Questions, button, double tap to collapse"'
    }
  },
  {
    id: 'dialog',
    name: 'Modal Dialog Box',
    htmlCode: '<dialog open aria-modal="true" aria-labelledby="modal-title">\n  <h2 id="modal-title">Delete Project?</h2>\n  <button>Cancel</button>\n  <button>Confirm</button>\n</dialog>',
    apiMapping: {
      role: 'ROLE_SYSTEM_DIALOG (IA2) / AXDialog / AXWindow',
      state: 'STATE_SYSTEM_MODAL / AXModal = true',
      name: '"Delete Project?"',
      action: 'Restricts AT focus inside dialog perimeter'
    },
    speechOutput: {
      'nvda-firefox': '"Delete Project?, dialog. Cancel, button"',
      'jaws-chrome': '"Delete Project?, dialog. To move through dialog, use Tab key. Cancel, button"',
      'vo-safari': '"Delete Project?, web dialog, Cancel, button. 2 items in dialog."',
      'talkback-chrome': '"Window: Delete Project?, Cancel, button"'
    }
  },
  {
    id: 'combobox',
    name: 'Search Combobox / Autocomplete',
    htmlCode: '<input type="text" role="combobox"\n  aria-autocomplete="list"\n  aria-expanded="true"\n  aria-controls="results-list"\n  aria-activedescendant="opt-2" />',
    apiMapping: {
      role: 'ROLE_SYSTEM_COMBOBOX / AXComboBox',
      state: 'STATE_SYSTEM_EXPANDED, haspopup="listbox"',
      name: 'Search Query Input',
      action: 'ArrowDown moves activedescendant focus'
    },
    speechOutput: {
      'nvda-firefox': '"Search, combo box, expanded, has auto complete, editable, Option 2, 2 of 5"',
      'jaws-chrome': '"Search, combobox editable, Option 2, 2 of 5. Press Enter to select."',
      'vo-safari': '"Option 2, selected, 2 of 5, Search, combo box, menu popup"',
      'talkback-chrome': '"Search, edit box, Option 2 selected, list showing 5 items"'
    }
  },
  {
    id: 'live-region',
    name: 'Polite Live Status Region',
    htmlCode: '<div role="status" aria-live="polite" aria-atomic="true">\n  3 search results updated\n</div>',
    apiMapping: {
      role: 'ROLE_SYSTEM_STATUSBAR / AXLiveRegion',
      state: 'aria-live: polite, aria-atomic: true',
      name: 'Status announcement',
      action: 'Queues speech after current speech completes'
    },
    speechOutput: {
      'nvda-firefox': '"3 search results updated" (speaks after user stops typing)',
      'jaws-chrome': '"3 search results updated" (speaks politely in idle queue)',
      'vo-safari': '"3 search results updated" (speaks at next natural punctuation pause)',
      'talkback-chrome': '"3 search results updated" (chimes and announces immediately after gesture)'
    }
  }
];

const BUGS_DEBUGGER = [
  {
    id: 'bug-1',
    title: 'NVDA Key Trapping in Custom Spreadsheet Widget',
    scenario:
      'A software developer builds a web spreadsheet with arrow key cell navigation. When NVDA users press Right Arrow, NVDA reads the next letter of the cell label instead of moving to the next spreadsheet cell.',
    question: 'What is the architectural root cause and standard W3C APG remediation?',
    options: [
      {
        id: 'A',
        text: 'NVDA is stuck in Browse Mode (Virtual Buffer). The composite grid container needs role="grid" and the widget must manage roving tabindex, prompting NVDA to automatically switch to Focus Mode.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'NVDA does not support HTML tables; the developer must replace all <table> elements with plain <div> tags.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'The developer should execute JavaScript window.alert() on every keystroke to break the screen reader buffer.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Users must be advised to uninstall Firefox and use only Microsoft Edge in Internet Explorer compatibility mode.',
        isCorrect: false
      }
    ],
    explanation:
      'On Windows screen readers (NVDA & JAWS), the Virtual Buffer (Browse Mode) intercepts arrow keys for document reading. Adding an interactive composite role like role="grid" or role="application" with roving tabIndex instructs the screen reader to enter Focus Mode, passing arrow keys directly to the web application.'
  },
  {
    id: 'bug-2',
    title: 'VoiceOver Safari Live Region Double Announcement',
    scenario:
      'When filtering an e-commerce catalog, an aria-live="polite" notification announces "12 items found" twice in VoiceOver on iOS Safari: once immediately, and once again 2 seconds later.',
    question: 'Why does WebKit/VoiceOver produce this double utterance anomaly?',
    options: [
      {
        id: 'A',
        text: 'The developer completely wiped and recreated the container <div aria-live="polite"> element in the DOM on every fetch instead of mutating only the inner textContent of a pre-existing live container.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Safari does not support the polite setting; only aria-live="assertive" is permitted by Apple.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'VoiceOver always repeats all text on iOS by default to assist users with short-term memory loss.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'The browser screen brightness was set below 50%, triggering VoiceOver echo mode.',
        isCorrect: false
      }
    ],
    explanation:
      'In WebKit/Safari, injecting a brand-new element with aria-live causes VoiceOver to announce both the DOM insertion event AND the live region mutation event. Best practice dictates rendering an empty aria-live region on initial page load and subsequently mutating only its textContent.'
  },
  {
    id: 'bug-3',
    title: 'JAWS & Chrome Custom Select Dropdown Failure',
    scenario:
      'A designer crafts a custom dropdown using <div role="combobox">. In Chrome with JAWS, pressing the Down Arrow opens the options list, but JAWS remains silent and never announces the currently selected option.',
    question: 'Which required ARIA 1.2 attribute relationship is missing between the combobox and listbox items?',
    options: [
      {
        id: 'A',
        text: 'The input is missing aria-activedescendant pointing to the unique ID of the currently focused option (or roving tabindex is missing).',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'The combobox requires CSS property outline: none !important.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'JAWS only supports native HTML <select> elements and will never announce ARIA listboxes.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'The combobox must have aria-hidden="true" set on all parent header tags.',
        isCorrect: false
      }
    ],
    explanation:
      'ARIA comboboxes require DOM programmatic focus management. If visual highlight moves via arrow keys, aria-activedescendant on the combobox input must update dynamically to match the id of the focused option; without it, assistive technologies cannot report selection changes.'
  },
  {
    id: 'bug-4',
    title: 'TalkBack Android Unclickable Icon Button',
    scenario:
      'On Android Chrome, a shopping cart badge is coded as <span class="cart-icon" onclick="openCart()"><svg>...</svg></span>. TalkBack users can tap the icon, but TalkBack simply announces "Unlabelled 1" and double-tapping does not reliably open the cart.',
    question: 'How must the element be coded for Android AccessibilityNodeInfo compatibility?',
    options: [
      {
        id: 'A',
        text: 'Use a native <button type="button" aria-label="Shopping Cart">, or at minimum provide role="button", tabindex="0", and an explicit accessible name.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Wrap the span in an <i> tag and add an HTML comment explaining its purpose.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Add title="cart" only, leaving the span as a non-interactive element.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Disable TalkBack touch exploration by setting pointer-events: none on the body.',
        isCorrect: false
      }
    ],
    explanation:
      'Android\'s Accessibility Framework ignores clicks on non-semantic <span> elements unless they expose an interactive AccessibilityNodeInfo action. Using a native <button> ensures proper button role, keyboard focusability, and click/touch dispatch across all mobile AT engines.'
  }
];

export default function CrossBrowserCompatibilityLab() {
  const [selectedPairingId, setSelectedPairingId] = useState('nvda-firefox');
  const [selectedWidgetId, setSelectedWidgetId] = useState('disclosure');
  const [activeBugIdx, setActiveBugIdx] = useState(0);
  const [bugAnswers, setBugAnswers] = useState({});
  const [score, setScore] = useState(0);

  const activePairing = PAIRINGS.find(p => p.id === selectedPairingId) || PAIRINGS[0];
  const activeWidget = WIDGETS.find(w => w.id === selectedWidgetId) || WIDGETS[0];
  const currentBug = BUGS_DEBUGGER[activeBugIdx];
  const selectedOption = bugAnswers[currentBug.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && currentBug.options.find(o => o.id === selectedOption)?.isCorrect;

  const handleSelectOption = (optId) => {
    if (isAnswered) return;
    const opt = currentBug.options.find(o => o.id === optId);
    const newAnswers = { ...bugAnswers, [currentBug.id]: optId };
    setBugAnswers(newAnswers);

    if (opt?.isCorrect) {
      soundManager.playCorrect();
      const newScore = score + 25;
      setScore(newScore);
      if (Object.keys(newAnswers).length === BUGS_DEBUGGER.length) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      soundManager.playIncorrect();
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setBugAnswers({});
    setScore(0);
    setActiveBugIdx(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(59, 130, 246, 0.08))',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(168, 85, 247, 0.25)',
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
              background: 'rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a855f7'
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Cross-Browser & Screen Reader Compatibility Matrix Lab
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Explore Accessibility Tree mappings across NVDA, JAWS, VoiceOver, and TalkBack with platform API diagnostics
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Interoperability Score
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: score === 100 ? 'var(--arcade-green)' : 'var(--arcade-yellow)' }}>
              {score}% ({Object.keys(bugAnswers).length}/{BUGS_DEBUGGER.length} Resolved)
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

      {/* Pairing Selector */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Select Screen Reader & Browser Baseline Pairing:
        </div>
        <div
          role="tablist"
          aria-label="AT and Browser Pairings"
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
        >
          {PAIRINGS.map((p) => {
            const isSelected = p.id === selectedPairingId;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedPairingId(p.id);
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
                  border: isSelected ? '1px solid #a855f7' : '1px solid var(--border-color)',
                  color: isSelected ? '#a855f7' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {p.id.includes('talkback') ? <Smartphone size={14} /> : <Laptop size={14} />}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Architecture Deep Dive Panel */}
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
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activePairing.name} Architecture
            </span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <strong>Platform OS:</strong> {activePairing.os} · <strong>Rendering Engine:</strong> {activePairing.engine} · <strong>Accessibility API:</strong> {activePairing.api}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', borderLeft: '4px solid #a855f7', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          {activePairing.description}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 700, color: '#a855f7', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={14} /> Mode Switching & Interaction Mechanics
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {activePairing.modeSwitching}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--arcade-yellow)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={14} /> Known Quirks & Implementation Caveats
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {activePairing.quirks}
            </div>
          </div>
        </div>
      </div>

      {/* Live Widget Tree & Speech Synthesizer Simulator */}
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
              Accessibility API Tree & Speech Translation Bench
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Widget: {activeWidget.name}
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {WIDGETS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setSelectedWidgetId(w.id);
                }}
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  background: w.id === selectedWidgetId ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-secondary)',
                  border: `1px solid ${w.id === selectedWidgetId ? '#a855f7' : 'var(--border-color)'}`,
                  color: w.id === selectedWidgetId ? '#a855f7' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {w.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Code View */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Code2 size={13} /> Source HTML / ARIA Markup:
            </div>
            <pre
              style={{
                margin: 0,
                background: '#0d1117',
                color: '#58a6ff',
                padding: '0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                border: '1px solid var(--border-color)'
              }}
            >
              {activeWidget.htmlCode}
            </pre>
          </div>

          {/* API Tree & Spoken Announcement */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Cpu size={13} /> OS Accessibility Tree Node Mapping:
            </div>
            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '0.85rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.78rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div><strong>Role:</strong> <code>{activeWidget.apiMapping.role}</code></div>
              <div><strong>State:</strong> <code>{activeWidget.apiMapping.state}</code></div>
              <div><strong>Accessible Name:</strong> <code>{activeWidget.apiMapping.name}</code></div>
              <div><strong>Standard Action:</strong> <code>{activeWidget.apiMapping.action}</code></div>
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
              <Volume2 size={13} style={{ color: 'var(--arcade-green)' }} /> Simulated Speech Utterance ({activePairing.name}):
            </div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                fontWeight: 600
              }}
            >
              🔊 {activeWidget.speechOutput[activePairing.id]}
            </div>
          </div>
        </div>
      </div>

      {/* Interoperability Bug Detective Bench */}
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
              Interoperability Bug Detective
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Challenge {activeBugIdx + 1} of {BUGS_DEBUGGER.length}: {currentBug.title}
            </h4>
          </div>
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
            <strong>Bug Report:</strong> {currentBug.scenario}
          </div>
          <div style={{ fontWeight: 700, color: '#a855f7' }}>
            {currentBug.question}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {currentBug.options.map((opt) => {
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
            <strong>{isCorrect ? '✓ Root Cause Identified:' : '✗ Incorrect Diagnosis:'}</strong> {currentBug.explanation}
          </div>
        )}

        {/* Stepper Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <button
            type="button"
            disabled={activeBugIdx === 0}
            onClick={() => {
              soundManager.playClick();
              setActiveBugIdx(prev => prev - 1);
            }}
            className="secondary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            ← Previous Bug
          </button>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Bug {activeBugIdx + 1} of {BUGS_DEBUGGER.length}
          </span>

          <button
            type="button"
            disabled={activeBugIdx === BUGS_DEBUGGER.length - 1}
            onClick={() => {
              soundManager.playClick();
              setActiveBugIdx(prev => prev + 1);
            }}
            className="primary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            Next Bug →
          </button>
        </div>
      </div>
    </div>
  );
}
