import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, Zap, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function A11yHeader({ activeMode, setActiveMode }) {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Check user's OS preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      document.body.classList.add('reduced-motion');
    }
  }, []);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const handleToggleContrast = () => {
    soundManager.playClick();
    const next = !isHighContrast;
    setIsHighContrast(next);
    if (next) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const handleToggleMotion = () => {
    soundManager.playClick();
    const next = !isReducedMotion;
    setIsReducedMotion(next);
    if (next) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  };

  return (
    <header className="header-nav" role="banner">
      <div className="brand-group">
        <span style={{ fontSize: '2rem' }} role="img" aria-label="Game controller">🎮</span>
        <div>
          <h1 className="brand-title">A11y Arcade</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            The Mario Party of Accessibility & CPACC Mastery
          </p>
        </div>
        <span className="brand-badge">IAAP CPACC BoK</span>
      </div>

      <div className="controls-group" role="region" aria-label="Accessibility settings">
        <button
          type="button"
          onClick={handleToggleMute}
          className={`a11y-pill-btn ${isMuted ? '' : 'active'}`}
          aria-label={isMuted ? 'Unmute game audio effects' : 'Mute game audio effects'}
          title="Toggle Audio Effects (M)"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{isMuted ? 'Muted' : 'Sound On'}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleContrast}
          className={`a11y-pill-btn ${isHighContrast ? 'active' : ''}`}
          aria-pressed={isHighContrast}
          aria-label="Toggle High Contrast Mode"
          title="Toggle High Contrast Mode (H)"
        >
          <Eye size={16} />
          <span>High Contrast</span>
        </button>

        <button
          type="button"
          onClick={handleToggleMotion}
          className={`a11y-pill-btn ${isReducedMotion ? 'active' : ''}`}
          aria-pressed={isReducedMotion}
          aria-label="Toggle Reduced Motion"
          title="Toggle Reduced Motion (R)"
        >
          <Zap size={16} />
          <span>{isReducedMotion ? 'Reduced Motion: ON' : 'Motion: Standard'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setShowHelp(true);
          }}
          className="a11y-pill-btn"
          aria-label="Open Keyboard Shortcuts and Accessibility Help"
          title="Keyboard shortcuts & help (?)"
        >
          <HelpCircle size={16} />
          <span>Help</span>
        </button>
      </div>

      {showHelp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-dialog-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowHelp(false);
          }}
        >
          <div className="card" style={{ maxWidth: '520px', width: '100%' }}>
            <h2 id="help-dialog-title" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
              ⌨️ Accessibility & Keyboard Hotkeys
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <li><strong>1 or A:</strong> Select Red Triangle (▲)</li>
              <li><strong>2 or B:</strong> Select Blue Diamond (◆)</li>
              <li><strong>3 or C:</strong> Select Yellow Circle (●)</li>
              <li><strong>4 or D:</strong> Select Green Square (■)</li>
              <li><strong>Tab / Shift+Tab:</strong> Standard sequential focus navigation</li>
              <li><strong>Space / Enter:</strong> Activate highlighted control</li>
            </ul>
            <div className="explanation-box" style={{ marginTop: 0, marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
                <strong>Screen Reader Note:</strong> Questions, countdown warnings, and live score announcements are broadcast to screen readers via <code>aria-live</code> polite and assertive regions.
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={() => setShowHelp(false)}
            >
              Got it, let's play!
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
