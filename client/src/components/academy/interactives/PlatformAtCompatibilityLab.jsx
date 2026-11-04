import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  Mic,
  Maximize2,
  Radio,
  Eye,
  RotateCcw,
  Sparkles,
  Command
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const AT_MODES = [
  {
    id: 'switch-access',
    name: 'Single-Switch Auto-Scanning',
    icon: Radio,
    color: '#38bdf8',
    desc: 'Users with physical motor disabilities use single or dual switches to cycle through page controls sequentially.',
    simTitle: 'Auto-Scan Sequence Highlighting',
    testPrompt: 'Watch the yellow scan box highlight interactive elements sequentially. Press the Switch (Space/Enter) to activate.',
    simDetails: 'Without Skip Links (WCAG 2.4.1), switch users must step through dozens of repetitive header links on every single page load.'
  },
  {
    id: 'magnifier-zoom',
    name: 'Screen Magnifier 400% Zoom',
    icon: Maximize2,
    color: '#c084fc',
    desc: 'Users with low vision enlarge content up to 400% (WCAG 1.4.10 Reflow). Content must reflow into a single column without horizontal scrolling.',
    simTitle: 'Viewport Reflow & Zoom Emulation',
    testPrompt: 'Toggle 400% Zoom to test whether content wraps vertically without cutting off buttons or creating horizontal scrollbars.',
    simDetails: 'Fixed-width container styles cause content to break off-screen when users zoom.'
  },
  {
    id: 'speech-recognition',
    name: 'Voice Speech Recognition (Voice Control)',
    icon: Mic,
    color: '#10b981',
    desc: 'Speech input users speak on-screen button labels aloud (e.g. "Click Search"). WCAG 2.5.3 requires visible label text to match the programmatic accessible name.',
    simTitle: 'Label in Name Voice Dictation',
    testPrompt: 'Simulate speaking "Click Download Report". If the programmatic aria-label mismatches the visible button text, speech control fails.',
    simDetails: 'WCAG 2.5.3 (Label in Name) mandates that the accessible name contains the visible text.'
  },
  {
    id: 'braille-display',
    name: '40-Cell Refreshable Braille Display',
    icon: Sliders,
    color: '#f59e0b',
    desc: 'Deafblind users and braille readers read tactile dot pins corresponding to Grade 2 contracted braille output.',
    simTitle: 'Tactile Braille Cell Translation',
    testPrompt: 'Examine the simulated 40-cell braille buffer reflecting the active focus control in real-time.',
    simDetails: 'Braille displays read the exact computed accessible name and role from the OS accessibility tree.'
  }
];

export default function PlatformAtCompatibilityLab() {
  const [selectedAtId, setSelectedAtId] = useState('switch-access');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [switchScanIndex, setSwitchScanIndex] = useState(0);
  const [voiceCommandSpoken, setVoiceCommandSpoken] = useState(false);
  const [tested, setTested] = useState(false);

  const activeAt = AT_MODES.find(m => m.id === selectedAtId) || AT_MODES[0];

  const handleSelectAt = (id) => {
    soundManager.playClick();
    setSelectedAtId(id);
    setVoiceCommandSpoken(false);
    setTested(false);
  };

  const handleStepSwitch = () => {
    soundManager.playClick();
    setSwitchScanIndex(prev => (prev + 1) % 4);
  };

  const handleSimulateVoice = () => {
    soundManager.playAuditPing();
    setVoiceCommandSpoken(true);
    setTested(true);
    soundManager.playCorrect();
    confetti({ particleCount: 35, spread: 60 });
  };

  const handleToggleZoom = () => {
    soundManager.playClick();
    setZoomLevel(prev => (prev === 100 ? 400 : 100));
    setTested(true);
  };

  return (
    <section aria-label="Alternative Assistive Technology Compatibility Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Sliders size={20} aria-hidden="true" />
          Alternative AT & Platform Hardware Accessibility
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Accessibility extends far beyond desktop screen readers. Discover how switch hardware, screen magnifiers (reflow at 400%), speech recognition voice input (Label in Name), and refreshable braille terminals interact with web code.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div role="tablist" onKeyDown={(e) => {
          if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
          e.preventDefault();
          const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'));
          const idx = tabs.indexOf(document.activeElement);
          if (idx === -1) return;
          const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : e.key === 'ArrowLeft' ? (idx - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : tabs.length - 1;
          tabs[nextIdx]?.focus();
          tabs[nextIdx]?.click();
        }} aria-label="Assistive Technology Modes" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
        {AT_MODES.map(mode => {
          const isSelected = selectedAtId === mode.id;
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleSelectAt(mode.id)}
              style={{
                minHeight: '44px',
                padding: '0.75rem',
                borderRadius: '6px',
                border: isSelected ? `2px solid ${mode.color}` : '1px solid var(--arcade-border)',
                background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-surface-elevated)',
                color: isSelected ? mode.color : 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{mode.name}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Simulation Console */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--arcade-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.35rem 0', color: activeAt.color, fontSize: '1rem' }}>{activeAt.simTitle}</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeAt.desc}</p>
        </div>

        {/* Mode-Specific Interactive Sandbox */}
        {selectedAtId === 'switch-access' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#020617', borderRadius: '6px', border: '1px solid var(--arcade-border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sequential Scanning Target (Item {switchScanIndex + 1} of 4):</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['Skip to Content', 'Search Products', 'Filter By Price', 'Add to Cart'].map((label, idx) => {
                const isScanning = switchScanIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '0.6rem 1rem',
                      borderRadius: '4px',
                      background: isScanning ? 'rgba(250, 204, 21, 0.2)' : 'var(--arcade-surface)',
                      border: isScanning ? '3px solid #facc15' : '1px solid var(--arcade-border)',
                      color: isScanning ? '#facc15' : 'var(--text-main)',
                      fontWeight: isScanning ? 800 : 500,
                      fontSize: '0.85rem'
                    }}
                  >
                    {isScanning ? '👉 ' : ''}{label}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleStepSwitch}
              style={{
                alignSelf: 'flex-start',
                minHeight: '44px',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--arcade-cyan)',
                color: '#000',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Step Switch Scan (Spacebar)
            </button>
          </div>
        )}

        {selectedAtId === 'magnifier-zoom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#020617', borderRadius: '6px', border: '1px solid var(--arcade-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Zoom Level: <strong>{zoomLevel}%</strong></span>
              <button
                type="button"
                onClick={handleToggleZoom}
                style={{
                  minHeight: '44px',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--arcade-purple)',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Toggle {zoomLevel === 100 ? '400% Zoom' : '100% Normal'}
              </button>
            </div>
            <div
              style={{
                padding: '1rem',
                border: '1px solid var(--arcade-border)',
                borderRadius: '4px',
                background: 'var(--arcade-surface)',
                maxWidth: zoomLevel === 400 ? '280px' : '100%',
                overflowX: 'auto',
                transition: 'max-width 0.3s ease'
              }}
            >
              <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-cyan)' }}>Responsive Billing Card</h5>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: zoomLevel === 400 ? '1.1rem' : '0.85rem', lineHeight: 1.4 }}>
                At 400% zoom (WCAG 1.4.10), content wraps into a single column. Users should never be forced to scroll horizontally to read lines of text.
              </p>
              <button type="button" style={{ minHeight: '44px', padding: '0.5rem 1rem', background: 'var(--arcade-green)', border: 'none', color: '#000', fontWeight: 700, borderRadius: '4px' }}>
                Confirm Invoice
              </button>
            </div>
          </div>
        )}

        {selectedAtId === 'speech-recognition' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#020617', borderRadius: '6px', border: '1px solid var(--arcade-border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Visible Button Label: "<strong>Download Quarterly Report</strong>"</span>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleSimulateVoice}
                style={{
                  minHeight: '44px',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--arcade-green)',
                  color: '#000',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Mic size={16} aria-hidden="true" />
                Speak: "Click Download Quarterly Report"
              </button>
            </div>
            {voiceCommandSpoken && (
              <div style={{ color: 'var(--arcade-green)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} aria-hidden="true" />
                Voice command successfully triggered button! Visible text matched accessible name (SC 2.5.3 PASSED).
              </div>
            )}
          </div>
        )}

        {selectedAtId === 'braille-display' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#020617', borderRadius: '6px', border: '1px solid var(--arcade-border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Simulated 40-Cell Refreshable Braille Output Buffer:</span>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.25rem',
                letterSpacing: '0.2rem',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                background: '#090d16',
                border: '1px solid var(--arcade-yellow)',
                color: '#facc15'
              }}
            >
              ⠠⠎⠥⠃⠍⠊⠞⠀⠠⠕⠗⠙⠑⠗⠀⠨⠃⠞⠝⠀⠶
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Translation: "Submit Order btn (button)" in Grade 2 English Braille</span>
          </div>
        )}

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--arcade-border)', paddingTop: '0.75rem' }}>
          <strong>Key Engineering Takeaway:</strong> {activeAt.simDetails}
        </div>
      </div>
    </section>
  );
}
