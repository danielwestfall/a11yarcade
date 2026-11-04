import React, { useState } from 'react';
import { Volume2, AlertCircle, CheckCircle2, Play, RefreshCw, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const EVENT_PRESETS = [
  {
    id: 'cart',
    label: 'Add to Cart Confirmation',
    type: 'informational',
    message: 'Wireless Ergonomic Keyboard added to cart. Subtotal: $89.99.',
    recommendedMode: 'polite',
    reason: 'Non-emergency update. The user is browsing, so the screen reader queues this to speak at the next natural pause.'
  },
  {
    id: 'chat',
    label: 'New Customer Chat Message',
    type: 'informational',
    message: 'Support Agent Maya: "I found the warranty document for you."',
    recommendedMode: 'polite',
    reason: 'Polite prevents cutting off whatever sentence the screen reader is currently enunciating.'
  },
  {
    id: 'session-timeout',
    label: 'Critical Session Expiry Warning',
    type: 'urgent',
    message: 'Security Alert: Your banking session will expire in 60 seconds due to inactivity. Press Extend to remain signed in.',
    recommendedMode: 'assertive',
    reason: 'Time-sensitive urgent warning requiring immediate action. Assertive interrupts current speech instantly.'
  },
  {
    id: 'form-error',
    label: 'Credit Card Payment Error',
    type: 'urgent',
    message: 'Payment Failed: Card security code (CVV) does not match.',
    recommendedMode: 'assertive',
    reason: 'High-priority task roadblock. Needs immediate user intervention before workflow can continue.'
  }
];

export default function AriaLiveLab() {
  const [ariaLiveMode, setAriaLiveMode] = useState('polite'); // 'off' | 'polite' | 'assertive'
  const [ariaAtomic, setAriaAtomic] = useState(true);
  const [speechLog, setSpeechLog] = useState([
    {
      time: '12:00:00',
      text: 'Virtual screen reader initialized. Listening for DOM mutations in live regions...',
      mode: 'system'
    }
  ]);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const handleTriggerEvent = (preset) => {
    soundManager.playClick();
    const now = new Date().toLocaleTimeString();

    if (ariaLiveMode === 'off') {
      setSpeechLog(prev => [
        {
          time: now,
          text: `[MUTATION DETECTED, BUT SILENCED]: "${preset.message}" (aria-live="off" ignores DOM mutations)`,
          mode: 'silenced'
        },
        ...prev
      ]);
      return;
    }

    if (ariaLiveMode === 'assertive') {
      soundManager.playTick(2);
      setSpeechLog(prev => [
        {
          time: now,
          text: `🚨 [INTERRUPTING]: "${preset.message}"`,
          mode: 'assertive'
        },
        ...prev
      ]);
    } else {
      soundManager.playCorrect();
      setSpeechLog(prev => [
        {
          time: now,
          text: `💬 [QUEUED & ANNOUNCED]: "${preset.message}"`,
          mode: 'polite'
        },
        ...prev
      ]);
    }
  };

  const handleClearLog = () => {
    soundManager.playClick();
    setSpeechLog([]);
  };

  const toggleAccordion = () => {
    soundManager.playClick();
    setAccordionOpen(!accordionOpen);
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={22} color="var(--arcade-gold)" />
            <span>WAI-ARIA Live Regions & Dynamic States Lab</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Experiment with asynchronous live region modes (`polite` vs `assertive`), inspect speech queues, and test `aria-expanded` widgets.
          </p>
        </div>
      </div>

      {/* Live Region Configuration Bar */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Container ARIA Configuration:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
              {['polite', 'assertive', 'off'].map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setAriaLiveMode(mode);
                  }}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: ariaLiveMode === mode ? '2px solid var(--arcade-cyan)' : '1px solid var(--border-color)',
                    background: ariaLiveMode === mode ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface-elevated)',
                    color: ariaLiveMode === mode ? 'var(--arcade-cyan)' : 'var(--text-secondary)'
                  }}
                >
                  aria-live="{mode}"
                </button>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Atomic Announcement:
            </span>
            <div style={{ marginTop: '0.4rem' }}>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setAriaAtomic(!ariaAtomic);
                }}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  background: ariaAtomic ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-elevated)',
                  color: ariaAtomic ? 'var(--arcade-green)' : 'var(--text-muted)'
                }}
              >
                aria-atomic="{ariaAtomic ? 'true' : 'false'}"
              </button>
            </div>
          </div>
        </div>

        {/* Live Container Code Preview */}
        <div style={{ background: '#090d16', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8' }}>
          &lt;div <span style={{ color: 'var(--arcade-cyan)' }}>aria-live="{ariaLiveMode}"</span> <span style={{ color: 'var(--arcade-green)' }}>aria-atomic="{ariaAtomic ? 'true' : 'false'}"</span> id="status-region"&gt;
        </div>
      </div>

      {/* Trigger Event Buttons Grid */}
      <div role="group" aria-labelledby="aria-live-events-heading">
        <div id="aria-live-events-heading" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
          Dispatch Asynchronous Dynamic Events into DOM:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {EVENT_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleTriggerEvent(p)}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.85rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: p.type === 'urgent' ? 'var(--arcade-crimson)' : 'var(--arcade-cyan)' }}>
                  {p.label}
                </span>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: p.recommendedMode === 'assertive' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)', color: p.recommendedMode === 'assertive' ? '#ef4444' : '#38bdf8' }}>
                  Best: {p.recommendedMode}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {p.reason}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Screen Reader Speech Synthesizer Output */}
      <div style={{ background: '#05070e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={18} color="var(--arcade-cyan)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Simulated Screen Reader Speech Output & Queue
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearLog}
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '4px', cursor: 'pointer' }}
          >
            Clear Log
          </button>
        </div>

        <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {speechLog.map((log, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                background: log.mode === 'assertive'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : log.mode === 'silenced'
                  ? 'rgba(100, 116, 139, 0.1)'
                  : 'rgba(56, 189, 248, 0.08)',
                color: log.mode === 'assertive'
                  ? '#fca5a5'
                  : log.mode === 'silenced'
                  ? '#94a3b8'
                  : '#bae6fd',
                borderLeft: `3px solid ${log.mode === 'assertive' ? '#ef4444' : log.mode === 'silenced' ? '#64748b' : '#38bdf8'}`
              }}
            >
              <span style={{ color: '#64748b', marginRight: '0.5rem' }}>[{log.time}]</span>
              <span>{log.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic State Widget: Accordion */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Interactive Dynamic State: Disclosure Widget (`aria-expanded`)
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
          Notice how the button dynamically communicates state to the accessibility tree.
        </p>

        <div style={{ border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
          <button
            type="button"
            aria-expanded={accordionOpen}
            aria-controls="sect-disclosure"
            id="btn-disclosure"
            onClick={toggleAccordion}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              background: 'var(--bg-surface-elevated)',
              border: 'none',
              color: 'var(--text-primary)',
              fontWeight: 800,
              fontSize: '0.9rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span>What is the First Rule of ARIA?</span>
            <span style={{ color: 'var(--arcade-cyan)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              aria-expanded="{accordionOpen ? 'true' : 'false'}"
            </span>
          </button>

          {accordionOpen && (
            <div
              id="sect-disclosure"
              role="region"
              aria-labelledby="btn-disclosure"
              style={{
                padding: '1rem',
                background: 'var(--bg-primary)',
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)'
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>The First Rule of ARIA:</strong> If you can use a native HTML element or attribute with the semantics and behavior already built in, then do so instead of repurposing an element and adding ARIA.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
