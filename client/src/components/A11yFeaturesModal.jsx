import React, { useEffect, useRef } from 'react';
import {
  X,
  Eye,
  Type,
  Volume2,
  VolumeX,
  Zap,
  Sliders,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Check,
  Sun,
  Moon,
  Compass,
  FileText
} from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function A11yFeaturesModal({
  isOpen,
  onClose,
  preferences,
  setPreferences
}) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Focus trap & Escape key handler
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }

        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updatePref = (key, val) => {
    soundManager.playClick();
    const updated = { ...preferences, [key]: val };
    setPreferences(updated);
    try {
      localStorage.setItem('a11yarcade_preferences', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save preferences to localStorage', e);
    }
  };

  const resetDefaults = () => {
    soundManager.playClick();
    const defaults = {
      theme: 'dark', // 'dark' | 'light' | 'high-contrast'
      fontScale: 100, // 100 | 115 | 130 | 150
      fontFamily: 'atkinson', // 'atkinson' | 'opendyslexic' | 'mono' | 'system'
      textSpacing: false,
      reducedMotion: false,
      soundMuted: false,
      soundVolume: 0.5,
      readingRuler: false,
      focusRingEnhanced: false
    };
    setPreferences(defaults);
    try {
      localStorage.setItem('a11yarcade_preferences', JSON.stringify(defaults));
    } catch (e) {
      console.warn('Could not save preferences', e);
    }
  };

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundManager.playClick();
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-modal-title"
        aria-describedby="a11y-modal-desc"
        className="card"
        style={{
          maxWidth: '780px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '2px solid var(--border-bright)',
          boxShadow: '8px 8px 0px 0px #040810',
          background: 'var(--bg-surface)',
          padding: '1.75rem',
          position: 'relative'
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.5rem' }}>♿</span>
              <h2 id="a11y-modal-title" style={{ fontSize: '1.45rem', fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", color: '#ffffff', margin: 0 }}>
                ACCESSIBILITY & DISPLAY CONTROLS
              </h2>
            </div>
            <p id="a11y-modal-desc" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, fontFamily: "'Space Mono', monospace" }}>
              WCAG 2.2 AA Conforming & WCAG 3.0 (Silver) Multi-Modal Customization Suite
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="a11y-pill-btn"
            style={{ padding: '0.4rem 0.65rem' }}
            aria-label="Close accessibility controls modal (Escape)"
          >
            <X size={20} />
            <span style={{ fontSize: '0.78rem' }}>ESC</span>
          </button>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* SECTION 1: THEME & COLOR SCHEME */}
          <section aria-labelledby="heading-theme">
            <h3 id="heading-theme" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--arcade-cyan)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              <Eye size={16} />
              <span>1. COLOR SCHEME & CONTRAST (WCAG 1.4.3 & 1.4.11)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
              {/* Dark Theme */}
              <button
                type="button"
                className="theme-preview-dark"
                onClick={() => updatePref('theme', 'dark')}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${preferences.theme === 'dark' ? 'var(--arcade-cyan)' : 'var(--border-color)'}`,
                  background: preferences.theme === 'dark' ? '#0b1326' : '#090d16',
                  color: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
                aria-pressed={preferences.theme === 'dark'}
              >
                <Moon size={18} color="#38bdf8" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Dark Cyberpunk</div>
                  <div className="theme-subtext" style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Void black & neon (Default)</div>
                </div>
              </button>

              {/* Light Theme */}
              <button
                type="button"
                onClick={() => updatePref('theme', 'light')}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${preferences.theme === 'light' ? '#0284c7' : 'var(--border-color)'}`,
                  background: preferences.theme === 'light' ? 'rgba(2, 132, 199, 0.15)' : '#f8fafc',
                  color: '#090d16',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
                aria-pressed={preferences.theme === 'light'}
              >
                <Sun size={18} color="#0284c7" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#090d16' }}>Crisp Light Mode</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>High-contrast paper AAA</div>
                </div>
              </button>

              {/* High Contrast */}
              <button
                type="button"
                className="theme-preview-hc"
                onClick={() => updatePref('theme', 'high-contrast')}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${preferences.theme === 'high-contrast' ? '#facc15' : 'var(--border-color)'}`,
                  background: '#000000',
                  color: '#facc15',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
                aria-pressed={preferences.theme === 'high-contrast'}
              >
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>High Contrast</div>
                  <div className="theme-subtext" style={{ fontSize: '0.75rem', color: '#ffffff' }}>Monochrome 12:1 Yellow</div>
                </div>
              </button>
            </div>
          </section>

          {/* SECTION 2: TEXT SIZE SCALING */}
          <section aria-labelledby="heading-font-size">
            <h3 id="heading-font-size" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--arcade-cyan)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              <Type size={16} />
              <span>2. TEXT SIZE SCALING (WCAG 1.4.4 RESIZE TEXT)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {[
                { scale: 100, label: '100%', sub: 'Standard' },
                { scale: 115, label: '115%', sub: 'Comfortable' },
                { scale: 130, label: '130%', sub: 'Large' },
                { scale: 150, label: '150%', sub: 'Low Vision' }
              ].map(f => (
                <button
                  key={f.scale}
                  type="button"
                  onClick={() => updatePref('fontScale', f.scale)}
                  style={{
                    padding: '0.65rem 0.5rem',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${preferences.fontScale === f.scale ? 'var(--arcade-cyan)' : 'var(--border-color)'}`,
                    background: preferences.fontScale === f.scale ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface-elevated)',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                  aria-pressed={preferences.fontScale === f.scale}
                >
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>{f.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{f.sub}</div>
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 3: FONT FAMILY & DYSLEXIA */}
          <section aria-labelledby="heading-font-family">
            <h3 id="heading-font-family" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--arcade-cyan)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              <Compass size={16} />
              <span>3. TYPEFACE & COGNITIVE READABILITY (WCAG 3.0)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
              {[
                { id: 'atkinson', name: 'Atkinson Hyperlegible', desc: 'Braille Institute low-vision design' },
                { id: 'opendyslexic', name: 'Dyslexia-Friendly', desc: 'Weighted bottom letterforms' },
                { id: 'mono', name: 'Space Mono', desc: 'Terminal monospace precision' },
                { id: 'system', name: 'System Sans', desc: 'Standard operating system font' }
              ].map(ff => (
                <button
                  key={ff.id}
                  type="button"
                  onClick={() => updatePref('fontFamily', ff.id)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${preferences.fontFamily === ff.id ? 'var(--arcade-cyan)' : 'var(--border-color)'}`,
                    background: preferences.fontFamily === ff.id ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface-elevated)',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                  aria-pressed={preferences.fontFamily === ff.id}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{ff.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{ff.desc}</div>
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 4: READING RULER, TEXT SPACING & FOCUS */}
          <section aria-labelledby="heading-visual-aids">
            <h3 id="heading-visual-aids" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--arcade-cyan)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              <Sparkles size={16} />
              <span>4. VISUAL GUIDES & FOCUS HALOS (WCAG 1.4.12 & 2.4.13)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
              {/* Text Spacing */}
              <button
                type="button"
                onClick={() => updatePref('textSpacing', !preferences.textSpacing)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${preferences.textSpacing ? '#10b981' : 'var(--border-color)'}`,
                  background: preferences.textSpacing ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-elevated)',
                  color: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                aria-pressed={preferences.textSpacing}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Enhanced Text Spacing</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>1.8 line height / 0.12em tracking</div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: preferences.textSpacing ? '#10b981' : '#94a3b8' }}>
                  {preferences.textSpacing ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Reading Ruler */}
              <button
                type="button"
                onClick={() => updatePref('readingRuler', !preferences.readingRuler)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${preferences.readingRuler ? '#facc15' : 'var(--border-color)'}`,
                  background: preferences.readingRuler ? 'rgba(250, 204, 21, 0.15)' : 'var(--bg-surface-elevated)',
                  color: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                aria-pressed={preferences.readingRuler}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Reading Focus Ruler</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tracks pointer to aid line tracking</div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: preferences.readingRuler ? '#facc15' : '#94a3b8' }}>
                  {preferences.readingRuler ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Enhanced Focus Ring */}
              <button
                type="button"
                onClick={() => updatePref('focusRingEnhanced', !preferences.focusRingEnhanced)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${preferences.focusRingEnhanced ? '#38bdf8' : 'var(--border-color)'}`,
                  background: preferences.focusRingEnhanced ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-elevated)',
                  color: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                aria-pressed={preferences.focusRingEnhanced}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Ultra 5px Focus Halo</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Enhanced electric yellow ring</div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: preferences.focusRingEnhanced ? '#38bdf8' : '#94a3b8' }}>
                  {preferences.focusRingEnhanced ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </section>

          {/* SECTION 5: MOTION & SOUND */}
          <section aria-labelledby="heading-motion-audio">
            <h3 id="heading-motion-audio" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--arcade-cyan)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              <Volume2 size={16} />
              <span>5. MOTION & SYNTHESIZED AUDIO (WCAG 1.4.2 & 2.3.3)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {/* Reduced Motion Toggle */}
              <button
                type="button"
                onClick={() => updatePref('reducedMotion', !preferences.reducedMotion)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${preferences.reducedMotion ? '#c084fc' : 'var(--border-color)'}`,
                  background: preferences.reducedMotion ? 'rgba(192, 132, 252, 0.15)' : 'var(--bg-surface-elevated)',
                  color: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                aria-pressed={preferences.reducedMotion}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={16} color="#c084fc" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Reduced Motion</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Disables flashes & confetti</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: preferences.reducedMotion ? '#c084fc' : '#94a3b8' }}>
                  {preferences.reducedMotion ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Audio Synthesizer Controls */}
              <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.88rem' }}>
                    {preferences.soundMuted ? <VolumeX size={16} color="#ef4444" /> : <Volume2 size={16} color="#10b981" />}
                    <span>Sound Volume: {preferences.soundMuted ? 'Muted' : `${Math.round(preferences.soundVolume * 100)}%`}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !preferences.soundMuted;
                      soundManager.setMuted(next);
                      updatePref('soundMuted', next);
                      if (!next) soundManager.playClick();
                    }}
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    {preferences.soundMuted ? 'Unmute' : 'Mute'}
                  </button>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={preferences.soundMuted ? 0 : preferences.soundVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    soundManager.setVolume(vol);
                    if (preferences.soundMuted && vol > 0) {
                      soundManager.setMuted(false);
                      updatePref('soundMuted', false);
                    }
                    updatePref('soundVolume', vol);
                    soundManager.playTick(1);
                  }}
                  style={{ width: '100%', cursor: 'pointer' }}
                  aria-label="Sound effects volume slider"
                />
              </div>
            </div>
          </section>

          {/* SECTION 6: KEYBOARD HOTKEYS CHEATSHEET */}
          <section aria-labelledby="heading-hotkeys" style={{ background: '#060e20', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <h3 id="heading-hotkeys" style={{ fontSize: '0.92rem', fontWeight: 800, color: '#facc15', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              <HelpCircle size={15} />
              <span>KEYBOARD SHORTCUTS REFERENCE (WCAG 2.1.1 KEYBOARD ACCESSIBLE)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace" }}>
              <div><strong style={{ color: '#ef4444' }}>1 or A:</strong> Red Triangle (▲)</div>
              <div><strong style={{ color: '#38bdf8' }}>2 or B:</strong> Blue Diamond (◆)</div>
              <div><strong style={{ color: '#f59e0b' }}>3 or C:</strong> Amber Circle (●)</div>
              <div><strong style={{ color: '#10b981' }}>4 or D:</strong> Green Square (■)</div>
              <div><strong style={{ color: '#ffffff' }}>Alt + A:</strong> Open A11y Menu</div>
              <div><strong style={{ color: '#ffffff' }}>M:</strong> Toggle Audio Mute</div>
              <div><strong style={{ color: '#ffffff' }}>H:</strong> Cycle Color Theme</div>
              <div><strong style={{ color: '#ffffff' }}>R:</strong> Toggle Motion</div>
              <div><strong style={{ color: '#ffffff' }}>Space/Enter:</strong> Activate Control</div>
              <div><strong style={{ color: '#ffffff' }}>Tab / Shift+Tab:</strong> Linear Focus</div>
            </div>
          </section>
        </div>

        {/* Footer Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '2px solid var(--border-color)', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={resetDefaults}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="btn-primary"
            style={{ padding: '0.65rem 1.75rem', fontSize: '0.95rem' }}
          >
            <Check size={16} />
            <span>Apply & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
