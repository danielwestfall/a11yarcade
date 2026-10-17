import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, Zap, Sliders, Sun, Moon, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';
import A11yFeaturesModal from './A11yFeaturesModal';

const DEFAULT_PREFS = {
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

export default function A11yHeader({ activeMode, setActiveMode }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('a11yarcade_preferences');
      if (saved) return { ...DEFAULT_PREFS, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed reading preferences', e);
    }
    // Check OS preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return {
      ...DEFAULT_PREFS,
      reducedMotion: prefersReducedMotion
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rulerTop, setRulerTop] = useState(150);

  // Sync DOM classes whenever preferences change
  useEffect(() => {
    const body = document.body;

    // 1. Theme
    body.classList.remove('light-mode', 'high-contrast');
    if (preferences.theme === 'light') {
      body.classList.add('light-mode');
    } else if (preferences.theme === 'high-contrast') {
      body.classList.add('high-contrast');
    }

    // 2. Font Scale
    body.classList.remove('font-scale-115', 'font-scale-130', 'font-scale-150');
    if (preferences.fontScale > 100) {
      body.classList.add(`font-scale-${preferences.fontScale}`);
    }

    // 3. Font Family
    body.classList.remove('font-atkinson', 'font-opendyslexic', 'font-mono', 'font-system');
    body.classList.add(`font-${preferences.fontFamily}`);

    // 4. Text Spacing
    if (preferences.textSpacing) {
      body.classList.add('text-spacing-enhanced');
    } else {
      body.classList.remove('text-spacing-enhanced');
    }

    // 5. Reduced Motion
    if (preferences.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }

    // 6. Focus Ring
    if (preferences.focusRingEnhanced) {
      body.classList.add('focus-ring-enhanced');
    } else {
      body.classList.remove('focus-ring-enhanced');
    }

    // 7. Sound Manager
    soundManager.setMuted(preferences.soundMuted);
    soundManager.setVolume(preferences.soundVolume);
  }, [preferences]);

  // Pointer and keyboard focus tracking for reading ruler
  useEffect(() => {
    if (!preferences.readingRuler) return;

    const handlePointerMove = (e) => {
      setRulerTop(e.clientY - 22);
    };

    const handleFocusIn = (e) => {
      if (e.target && typeof e.target.getBoundingClientRect === 'function') {
        const rect = e.target.getBoundingClientRect();
        setRulerTop(rect.top + rect.height / 2 - 22);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('focusin', handleFocusIn);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('focusin', handleFocusIn);
    };
  }, [preferences.readingRuler]);

  // Global hotkeys (Alt+A for menu, M for sound, H for theme, R for motion)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Alt+A: Open Accessibility Menu
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        soundManager.playClick();
        setIsModalOpen(prev => !prev);
        return;
      }

      // Quick hotkeys (single key only if not in modal)
      if (!isModalOpen) {
        if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          const next = !preferences.soundMuted;
          soundManager.setMuted(next);
          const updated = { ...preferences, soundMuted: next };
          setPreferences(updated);
          localStorage.setItem('a11yarcade_preferences', JSON.stringify(updated));
          if (!next) soundManager.playClick();
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          soundManager.playClick();
          const themes = ['dark', 'light', 'high-contrast'];
          const nextIdx = (themes.indexOf(preferences.theme) + 1) % themes.length;
          const updated = { ...preferences, theme: themes[nextIdx] };
          setPreferences(updated);
          localStorage.setItem('a11yarcade_preferences', JSON.stringify(updated));
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          soundManager.playClick();
          const next = !preferences.reducedMotion;
          const updated = { ...preferences, reducedMotion: next };
          setPreferences(updated);
          localStorage.setItem('a11yarcade_preferences', JSON.stringify(updated));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [preferences, isModalOpen]);

  const cycleTheme = () => {
    soundManager.playClick();
    const themes = ['dark', 'light', 'high-contrast'];
    const nextIdx = (themes.indexOf(preferences.theme) + 1) % themes.length;
    const updated = { ...preferences, theme: themes[nextIdx] };
    setPreferences(updated);
    try {
      localStorage.setItem('a11yarcade_preferences', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save theme', e);
    }
  };

  const toggleSound = () => {
    const next = !preferences.soundMuted;
    soundManager.setMuted(next);
    const updated = { ...preferences, soundMuted: next };
    setPreferences(updated);
    try {
      localStorage.setItem('a11yarcade_preferences', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save sound pref', e);
    }
    if (!next) soundManager.playClick();
  };

  const toggleMotion = () => {
    soundManager.playClick();
    const next = !preferences.reducedMotion;
    const updated = { ...preferences, reducedMotion: next };
    setPreferences(updated);
    try {
      localStorage.setItem('a11yarcade_preferences', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save motion pref', e);
    }
  };

  return (
    <>
      {/* Optional Visual Reading Focus Ruler */}
      {preferences.readingRuler && (
        <div
          className="reading-ruler-guide"
          style={{ top: `${rulerTop}px` }}
          aria-hidden="true"
        />
      )}

      <header className="header-nav" role="banner">
        <div className="brand-group">
          <span style={{ fontSize: '2rem' }} role="img" aria-label="Arcade Joystick">🕹️</span>
          <div>
            <h1 className="brand-title">A11y Arcade</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: "'Space Mono', monospace" }}>
              Neo-Arcade CPACC Training & Battle Engine
            </p>
          </div>
          <span className="brand-badge">WCAG 2.2 AA & 3.0 READY</span>
        </div>

        <div className="controls-group" role="region" aria-label="Accessibility quick settings">
          {/* Main A11y Controls Menu Trigger */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setIsModalOpen(true);
            }}
            className="a11y-pill-btn active"
            aria-label="Open comprehensive accessibility & display controls (Alt + A)"
            title="Open Accessibility Controls (Alt + A)"
            style={{
              background: '#facc15',
              borderColor: '#facc15',
              color: '#090d16',
              fontWeight: 900
            }}
          >
            <Sliders size={16} />
            <span>♿ A11y Menu (Alt+A)</span>
          </button>

          {/* Theme Quick Switcher Pill */}
          <button
            type="button"
            onClick={cycleTheme}
            className="a11y-pill-btn"
            aria-label={`Cycle color theme. Current theme is ${preferences.theme}. Hotkey H.`}
            title="Cycle Theme (H)"
          >
            {preferences.theme === 'light' ? (
              <Sun size={16} color="#0284c7" />
            ) : preferences.theme === 'high-contrast' ? (
              <span style={{ fontSize: '1rem', color: '#facc15' }}>⚡</span>
            ) : (
              <Moon size={16} color="#38bdf8" />
            )}
            <span>
              {preferences.theme === 'light'
                ? 'Light Mode'
                : preferences.theme === 'high-contrast'
                ? 'High Contrast'
                : 'Dark Mode'}
            </span>
          </button>

          {/* Sound Mute Quick Pill */}
          <button
            type="button"
            onClick={toggleSound}
            className={`a11y-pill-btn ${preferences.soundMuted ? '' : 'active'}`}
            aria-label={preferences.soundMuted ? 'Unmute game audio effects (M)' : 'Mute game audio effects (M)'}
            title="Toggle Sound Effects (M)"
          >
            {preferences.soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{preferences.soundMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          {/* Motion Quick Pill */}
          <button
            type="button"
            onClick={toggleMotion}
            className={`a11y-pill-btn ${preferences.reducedMotion ? 'active' : ''}`}
            aria-pressed={preferences.reducedMotion}
            aria-label="Toggle Reduced Motion (R)"
            title="Toggle Reduced Motion (R)"
          >
            <Zap size={16} />
            <span>{preferences.reducedMotion ? 'Motion: Reduced' : 'Motion: Standard'}</span>
          </button>
        </div>

        {/* The Comprehensive A11y Features Modal */}
        <A11yFeaturesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          preferences={preferences}
          setPreferences={setPreferences}
        />
      </header>
    </>
  );
}
