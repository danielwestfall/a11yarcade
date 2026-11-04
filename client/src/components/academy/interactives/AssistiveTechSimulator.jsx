import React, { useState, useEffect } from 'react';
import { Eye, Move, RefreshCw, Volume2, Sparkles, Sliders, Radio, Zap } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

// Grade 1 Braille mapping
const BRAILLE_MAP = {
  a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑', f: '⠋', g: '⠛', h: '⠓', i: '⠊', j: '⠚',
  k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕', p: '⠏', q: '⠟', r: '⠗', s: '⠎', t: '⠞',
  u: '⠥', v: '⠧', w: '⠺', x: '⠭', y: '⠽', z: '⠵', ' ': ' ', '1': '⠂', '2': '⠆',
  '.': '⠲', ',': '⠂', '!': '⠖', '?': '⠦', '-': '⠤'
};

function textToBraille(text) {
  return text
    .toLowerCase()
    .split('')
    .map(ch => BRAILLE_MAP[ch] || ch)
    .join('');
}

const SWITCH_ITEMS = [
  { id: 'item-1', label: 'Play Music', icon: '🎵' },
  { id: 'item-2', label: 'Call Home', icon: '📞' },
  { id: 'item-3', label: 'Adjust Lights', icon: '💡' },
  { id: 'item-4', label: 'Send Message', icon: '💬' },
  { id: 'item-5', label: 'Open Door', icon: '🚪' },
  { id: 'item-6', label: 'Help / Nurse', icon: '🚨' }
];

export default function AssistiveTechSimulator() {
  const [activeTab, setActiveTab] = useState('switch'); // 'switch' | 'braille' | 'magnifier'

  // Switch state
  const [scanIndex, setScanIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  // Braille state
  const [brailleInput, setBrailleInput] = useState('Universal Design for Everyone');

  // Magnifier state
  const [zoomLevel, setZoomLevel] = useState(3);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });

  // Switch auto-scanner timer
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanIndex(prev => (prev + 1) % SWITCH_ITEMS.length);
      soundManager.playTick(1);
    }, 1200);
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleStartScan = () => {
    soundManager.playClick();
    setIsScanning(true);
    setSelectedAction(null);
  };

  const handleSwitchTrigger = () => {
    if (!isScanning) return;
    soundManager.playCorrect();
    setIsScanning(false);
    setSelectedAction(SWITCH_ITEMS[scanIndex]);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={22} color="var(--arcade-purple)" />
            <span>Assistive Technology & Adaptive Strategies Lab</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Hands-on simulation of specialized hardware and adaptive workflows: Switch Access scanning, Refreshable Braille displays, and Screen Magnification viewports.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'switch', label: '1. Switch Access & Scanning' },
          { id: 'braille', label: '2. Refreshable Braille Display' },
          { id: 'magnifier', label: '3. Screen Magnifier Viewport' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab(tab.id);
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: activeTab === tab.id ? '2px solid var(--arcade-purple)' : '1px solid var(--border-color)',
              background: activeTab === tab.id ? 'rgba(192, 132, 252, 0.2)' : 'var(--bg-surface)',
              color: activeTab === tab.id ? 'var(--arcade-purple)' : 'var(--text-secondary)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LAB 1: SWITCH ACCESS */}
      {activeTab === 'switch' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Single-Switch Step Scanning Simulator
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Used by people with severe motor paralysis, ALS, or spinal cord injuries. The software sequentially cycles through options. The user activates their single switch (puff, head button, or eye blink) when the target is highlighted.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {!isScanning ? (
              <button
                type="button"
                onClick={handleStartScan}
                className="primary-btn"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
              >
                Start Auto-Scanner
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSwitchTrigger}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 900,
                  background: 'var(--arcade-gold)',
                  color: '#000000',
                  border: '3px solid #ffffff',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(250, 204, 21, 0.6)',
                  animation: 'pulse 1s infinite'
                }}
              >
                [PRESS SWITCH TRIGGER]
              </button>
            )}

            {isScanning && (
              <span style={{ fontSize: '0.8rem', color: 'var(--arcade-gold)', fontWeight: 700 }}>
                Scanning at 1.2s intervals... Click yellow trigger when ready!
              </span>
            )}
          </div>

          {/* Grid of Switch Targets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {SWITCH_ITEMS.map((item, idx) => {
              const isHighlighted = isScanning && scanIndex === idx;
              const isChosen = selectedAction?.id === item.id;
              return (
                <div
                  key={item.id}
                  style={{
                    background: isHighlighted ? 'rgba(250, 204, 21, 0.25)' : isChosen ? 'rgba(16, 185, 129, 0.25)' : 'var(--bg-surface-elevated)',
                    border: isHighlighted ? '3px solid var(--arcade-gold)' : isChosen ? '3px solid var(--arcade-green)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transform: isHighlighted ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: isHighlighted ? 'var(--arcade-gold)' : '#fff' }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {selectedAction && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '6px', color: '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>
              ✓ Switch Activated: Successfully triggered "{selectedAction.label}"!
            </div>
          )}
        </div>
      )}

      {/* LAB 2: REFRESHABLE BRAILLE */}
      {activeTab === 'braille' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Refreshable Braille Terminal Simulator
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Deafblind users and blind programmers use refreshable Braille displays featuring electromagnetic pins that dynamically raise and lower 6-dot or 8-dot Braille cells.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="braille-input-field" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Type text or code to see refreshable Braille pin representation:
            </label>
            <input
              id="braille-input-field"
              type="text"
              value={brailleInput}
              onChange={(e) => setBrailleInput(e.target.value)}
              style={{
                padding: '0.75rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {/* Physical Braille Display Hardware Simulation */}
          <div style={{ background: '#090d16', border: '3px solid #334155', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.1em' }}>
                40-CELL TACTILE BRAILLE DISPLAY // FOCUS 40 BLUE
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--arcade-green)' }}>
                ● ONLINE (USB/BLUETOOTH)
              </span>
            </div>

            <div style={{ fontSize: '2.5rem', letterSpacing: '0.3rem', color: 'var(--arcade-cyan)', fontFamily: 'monospace', minHeight: '60px', display: 'flex', alignItems: 'center', overflowX: 'auto', whiteSpace: 'nowrap', padding: '0.5rem 0' }}>
              {textToBraille(brailleInput) || '⠀'}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', paddingTop: '0.5rem' }}>
              {['NAV PREV', 'WHICH CHAR', 'ROTOR', 'PAN LEFT', 'PAN RIGHT'].map(btn => (
                <span key={btn} style={{ padding: '0.2rem 0.6rem', background: '#1e293b', color: '#94a3b8', fontSize: '0.65rem', borderRadius: '3px', fontWeight: 700 }}>
                  {btn}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LAB 3: SCREEN MAGNIFIER */}
      {activeTab === 'magnifier' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Screen Magnifier Field-of-View Simulator
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Low-vision users operating ZoomText or Windows Magnifier at 400% zoom only see a small "keyhole" of the webpage. Move your cursor across the canvas to experience how dispersed content causes lost context.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label htmlFor="magnifier-zoom-slider" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Zoom Level: {zoomLevel}00%
            </label>
            <input
              id="magnifier-zoom-slider"
              type="range"
              min="2"
              max="5"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value, 10))}
              style={{ width: '150px' }}
            />
          </div>

          {/* Interactive Magnifier Viewport Frame */}
          <div
            onMouseMove={handleMouseMove}
            style={{
              height: '240px',
              background: '#090d16',
              border: '2px solid var(--border-color)',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'crosshair',
              padding: '1.5rem'
            }}
          >
            {/* Virtual full page content */}
            <div
              style={{
                width: `${zoomLevel * 100}%`,
                height: `${zoomLevel * 100}%`,
                position: 'absolute',
                top: `${-lensPos.y * (zoomLevel - 1)}%`,
                left: `${-lensPos.x * (zoomLevel - 1)}%`,
                transition: 'top 0.05s ease-out, left 0.05s ease-out',
                padding: '2rem'
              }}
            >
              <h2 style={{ fontSize: `${zoomLevel * 0.9}rem`, color: 'var(--arcade-cyan)' }}>
                Enterprise Checkout Portal
              </h2>
              <p style={{ fontSize: `${zoomLevel * 0.55}rem`, color: '#cbd5e1', maxWidth: '600px' }}>
                Order #98421: Please review billing details carefully before confirming payment.
              </p>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', background: '#1e293b', borderRadius: '6px' }}>
                  <div style={{ fontSize: `${zoomLevel * 0.5}rem`, fontWeight: 800 }}>Item: Ergonomic Chair</div>
                  <div style={{ fontSize: `${zoomLevel * 0.45}rem`, color: 'var(--arcade-green)' }}>$399.00</div>
                </div>
                <div style={{ padding: '1rem', background: '#3b0764', borderRadius: '6px' }}>
                  <div style={{ fontSize: `${zoomLevel * 0.5}rem`, color: '#fca5a5' }}>⚠ Error Alert (Far Right)</div>
                  <div style={{ fontSize: `${zoomLevel * 0.4}rem`, color: '#f8fafc' }}>CVV Code Required</div>
                </div>
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Notice: If an error banner is located on the far right edge of the screen, the magnified user cannot see it while looking at the input field on the left!
          </span>
        </div>
      )}
    </div>
  );
}
