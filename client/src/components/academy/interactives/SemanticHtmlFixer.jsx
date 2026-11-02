import React, { useState } from 'react';
import { Code, CheckCircle2, AlertTriangle, ArrowRight, Play, RefreshCw, Eye, Sparkles, Volume2 } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const CHALLENGES = [
  {
    id: 'ch-btn',
    title: 'Challenge 1: The Pseudo-Button ("Div Soup")',
    context: 'An e-commerce checkout has a button constructed out of a <div> with an inline click handler.',
    brokenCode: `<div class="btn" onclick="submitOrder()">\n  Submit Order\n</div>`,
    brokenA11yTree: {
      role: 'generic / none (div)',
      name: '"" (none)',
      focusable: 'NO (Not in sequential tab order)',
      keys: 'Mouse click only (Space & Enter do nothing)',
      srSpeech: '"Submit Order" (Read as flat text; user doesn\'t know it is clickable)'
    },
    fixedCode: `<button type="button" onclick="submitOrder()">\n  Submit Order\n</button>`,
    fixedA11yTree: {
      role: 'button',
      name: '"Submit Order"',
      focusable: 'YES (Natural tab order)',
      keys: 'Click, Enter, and Spacebar built-in',
      srSpeech: '"Submit Order, button" (Identified as actionable control in rotor)'
    },
    remediationExplanation: 'Using the native <button> gives you keyboard focus (Tab), activation via Space and Enter keys, role="button", and disabled state handling for free—without writing custom JavaScript event listeners.'
  },
  {
    id: 'ch-heading',
    title: 'Challenge 2: Fake Visual Heading',
    context: 'A settings page uses styled divs instead of semantic headings, preventing screen reader users from navigating by section.',
    brokenCode: `<div class="section-heading" style="font-size: 24px; font-weight: 800;">\n  Security & Privacy Settings\n</div>`,
    brokenA11yTree: {
      role: 'generic (div)',
      name: '"" (none)',
      focusable: 'NO',
      keys: 'None',
      srSpeech: '"Security and Privacy Settings" (Screen reader cannot jump here using "H" key)'
    },
    fixedCode: `<h2>Security & Privacy Settings</h2>`,
    fixedA11yTree: {
      role: 'heading',
      level: 2,
      name: '"Security & Privacy Settings"',
      focusable: 'NO (Navigable via Screen Reader heading hotkey "H" / "2")',
      keys: 'H hotkey',
      srSpeech: '"Heading level 2, Security & Privacy Settings"'
    },
    remediationExplanation: 'Screen reader users rely on the "H" key to scan page structure. A styled <div> produces no heading node in the accessibility tree, making long pages tedious to navigate.'
  },
  {
    id: 'ch-input',
    title: 'Challenge 3: Unassociated Form Field',
    context: 'A registration form has visual text adjacent to an input, but no programmatic label connection.',
    brokenCode: `<span>Email Address:</span>\n<input type="text" name="email">`,
    brokenA11yTree: {
      role: 'textbox',
      name: '"" (Empty / unlabelled)',
      focusable: 'YES',
      keys: 'Typing input',
      srSpeech: '"Edit text, blank" (User has no idea what information is requested!)'
    },
    fixedCode: `<label for="user-email">Email Address:</label>\n<input id="user-email" type="email" name="email" required>`,
    fixedA11yTree: {
      role: 'textbox',
      name: '"Email Address"',
      focusable: 'YES',
      keys: 'Typing input + native validation',
      srSpeech: '"Email Address, required, edit text"'
    },
    remediationExplanation: 'The <label for="id"> explicitly calculates the accessible name for the input. Clicking the label also expands the hit target to focus the input, aiding users with motor tremors.'
  },
  {
    id: 'ch-nav',
    title: 'Challenge 4: Landmark Navigation & Lists',
    context: 'A site navigation bar is wrapped in generic divs without landmark semantics.',
    brokenCode: `<div class="menu">\n  <a href="/">Home</a>\n  <a href="/docs">Docs</a>\n</div>`,
    brokenA11yTree: {
      role: 'generic (div)',
      name: '"" (none)',
      focusable: 'Links only',
      keys: 'Tab',
      srSpeech: '"Link, Home. Link, Docs." (No landmark region or list count announced)'
    },
    fixedCode: `<nav aria-label="Main">\n  <ul>\n    <li><a href="/">Home</a></li>\n    <li><a href="/docs">Docs</a></li>\n  </ul>\n</nav>`,
    fixedA11yTree: {
      role: 'navigation landmark',
      name: '"Main"',
      focusable: 'Links inside list',
      keys: 'Landmark jump ("D" key)',
      srSpeech: '"Main, navigation landmark. List with 2 items. Link, Home, 1 of 2."'
    },
    remediationExplanation: '<nav> creates an architectural landmark region that screen reader users can jump to directly. Wrapping items in <ul>/<li> announces the total item count to the user.'
  }
];

export default function SemanticHtmlFixer() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [speechPlaying, setSpeechPlaying] = useState(false);
  const [completedMap, setCompletedMap] = useState({});

  const challenge = CHALLENGES[currentIdx];
  const activeTree = isFixed ? challenge.fixedA11yTree : challenge.brokenA11yTree;

  const handleRemediate = () => {
    soundManager.playCorrect();
    setIsFixed(true);
    setCompletedMap(prev => ({ ...prev, [challenge.id]: true }));
  };

  const handleResetChallenge = () => {
    soundManager.playClick();
    setIsFixed(false);
  };

  const handlePlaySpeech = () => {
    soundManager.playClick();
    setSpeechPlaying(true);
    setTimeout(() => {
      setSpeechPlaying(false);
    }, 2200);
  };

  const handleNextChallenge = () => {
    if (currentIdx < CHALLENGES.length - 1) {
      soundManager.playClick();
      setCurrentIdx(prev => prev + 1);
      setIsFixed(false);
    }
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={22} color="var(--arcade-green)" />
            <span>Semantic HTML vs "Div Soup" Fixer</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Inspect broken inaccessible DOM nodes, test their accessibility tree, and remediate them with native HTML semantics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Mastered: {Object.keys(completedMap).length} / {CHALLENGES.length}
          </span>
        </div>
      </div>

      {/* Challenge Navigator Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {CHALLENGES.map((ch, idx) => {
          const isCurrent = currentIdx === idx;
          const isDone = completedMap[ch.id];
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setCurrentIdx(idx);
                setIsFixed(false);
              }}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: isCurrent ? '2px solid var(--arcade-cyan)' : '1px solid var(--border-color)',
                background: isCurrent ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface-elevated)',
                color: isCurrent ? 'var(--arcade-cyan)' : 'var(--text-secondary)'
              }}
            >
              {isDone && <CheckCircle2 size={14} color="#10b981" />}
              <span>{ch.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Challenge Area */}
      <div
        className="card"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {challenge.title}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {challenge.context}
          </p>
        </div>

        {/* State Toggle Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>DOM STATE:</span>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              background: isFixed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: isFixed ? '#10b981' : '#ef4444'
            }}>
              {isFixed ? 'REMEDIATED (Semantic HTML)' : 'DEFECTIVE (Div Soup Anti-Pattern)'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isFixed ? (
              <button
                type="button"
                onClick={handleRemediate}
                className="primary-btn"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Sparkles size={14} />
                <span>Apply Semantic HTML Fix</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetChallenge}
                className="secondary-btn"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RefreshCw size={14} />
                <span>View Original Div Soup</span>
              </button>
            )}
          </div>
        </div>

        {/* Split View: Code Editor vs Accessibility Tree */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {/* Code Box */}
          <div style={{ background: '#05070e', border: `1px solid ${isFixed ? 'var(--arcade-green)' : 'var(--arcade-crimson)'}`, borderRadius: '6px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isFixed ? 'var(--arcade-green)' : 'var(--arcade-crimson)', textTransform: 'uppercase' }}>
                {isFixed ? '✓ Valid HTML Markup' : '⚠ Non-Semantic Code'}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>HTML / JSX</span>
            </div>
            <pre style={{ margin: 0, padding: '0.75rem', background: '#090d16', borderRadius: '4px', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'monospace', lineHeight: 1.5, overflowX: 'auto' }}>
              <code>{isFixed ? challenge.fixedCode : challenge.brokenCode}</code>
            </pre>
          </div>

          {/* Accessibility Tree Inspector */}
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-cyan)', textTransform: 'uppercase' }}>
                Browser Accessibility Tree
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Chrome / Firefox A11y API</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role:</span>
                <span style={{ fontWeight: 800, color: isFixed ? 'var(--arcade-green)' : 'var(--arcade-crimson)', fontFamily: 'monospace' }}>
                  {activeTree.role}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Accessible Name:</span>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  {activeTree.name}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Focusable:</span>
                <span style={{ fontWeight: 800, color: activeTree.focusable.includes('YES') ? 'var(--arcade-green)' : 'var(--arcade-crimson)' }}>
                  {activeTree.focusable}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Keyboard Triggers:</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {activeTree.keys}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Screen Reader Voice Simulation Box */}
        <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Volume2 size={18} color="var(--arcade-cyan)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--arcade-cyan)', textTransform: 'uppercase' }}>
                Simulated Screen Reader Announcement (NVDA / VoiceOver)
              </span>
            </div>
            <button
              type="button"
              onClick={handlePlaySpeech}
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                borderRadius: '4px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Play size={12} />
              <span>Simulate Audio</span>
            </button>
          </div>

          <div style={{
            padding: '0.75rem',
            background: 'var(--bg-primary)',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: speechPlaying ? 'var(--arcade-gold)' : 'var(--text-primary)',
            borderLeft: `4px solid ${isFixed ? 'var(--arcade-green)' : 'var(--arcade-crimson)'}`,
            transition: 'color 0.2s'
          }}>
            {activeTree.srSpeech}
          </div>
        </div>

        {/* Remediation Takeaway */}
        {isFixed && (
          <div style={{ padding: '1rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', display: 'flex', flexDirection: 'column', gap: '0.5rem', animation: 'fadeIn 0.2s' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>
              💡 Pedagogical Remediation Insight:
            </span>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
              {challenge.remediationExplanation}
            </p>

            {currentIdx < CHALLENGES.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="primary-btn"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>Next Challenge</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
