import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, CheckCircle2, AlertTriangle, X, ShieldCheck, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

export default function KeyboardNavigationSandbox() {
  const [modalOpen, setModalOpen] = useState(false);
  const [focusStyle, setFocusStyle] = useState('wcag-halo'); // 'none' | 'browser' | 'wcag-halo'
  const [skipLinkFocused, setSkipLinkFocused] = useState(false);
  const [lastFocusedElement, setLastFocusedElement] = useState(null);

  const openModalBtnRef = useRef(null);
  const modalFirstInputRef = useRef(null);
  const modalCloseBtnRef = useRef(null);
  const mainContentRef = useRef(null);

  // Manage focus trap and Escape key
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      } else if (e.key === 'Tab') {
        const focusable = [modalFirstInputRef.current, modalCloseBtnRef.current].filter(Boolean);
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  const openModal = () => {
    soundManager.playClick();
    setLastFocusedElement(document.activeElement);
    setModalOpen(true);
    setTimeout(() => {
      modalFirstInputRef.current?.focus();
    }, 50);
  };

  const closeModal = () => {
    soundManager.playClick();
    setModalOpen(false);
    setTimeout(() => {
      openModalBtnRef.current?.focus();
    }, 50);
  };

  const handleSkipToContent = (e) => {
    e.preventDefault();
    soundManager.playCorrect();
    mainContentRef.current?.focus();
  };

  const getFocusStyleObject = () => {
    if (focusStyle === 'none') {
      return { outline: 'none' };
    }
    if (focusStyle === 'browser') {
      return { outline: '1px dotted #888' };
    }
    return {
      outline: '3px solid #facc15',
      outlineOffset: '2px',
      boxShadow: '0 0 0 5px rgba(0,0,0,0.8)'
    };
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Keyboard size={22} color="var(--arcade-cyan)" />
            <span>Keyboard Focus Management Sandbox</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Test keyboard focus trapping, bypass blocks (Skip Links), and WCAG 2.2 focus visible indicators.
          </p>
        </div>
      </div>

      {/* Focus Indicator Style Switcher */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
            Focus Indicator Styling (WCAG SC 2.4.7 & 2.4.13 Focus Appearance):
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'wcag-halo', label: 'WCAG 2.2 3:1 Halo (Compliant)', color: '#10b981' },
              { id: 'browser', label: 'Default Browser Faint Ring', color: '#f59e0b' },
              { id: 'none', label: 'outline: none (FAIL)', color: '#ef4444' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setFocusStyle(item.id);
                }}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: focusStyle === item.id ? `2px solid ${item.color}` : '1px solid var(--border-color)',
                  background: focusStyle === item.id ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: focusStyle === item.id ? item.color : 'var(--text-muted)'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {focusStyle === 'none' && '🚨 CRITICAL FAILURE: Sighted keyboard users lose track of where they are on the page.'}
          {focusStyle === 'browser' && '⚠ WEAK: Many default browser outlines fail the 3:1 contrast requirement against dark backgrounds.'}
          {focusStyle === 'wcag-halo' && '✓ AAA CONFORMANCE: High-contrast 3px halo with dark offset provides > 10:1 contrast on any surface.'}
        </p>
      </div>

      {/* Simulated Interactive Page Shell */}
      <div style={{ background: '#05070e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        {/* Skip Link */}
        <div style={{ position: 'relative', height: '24px' }}>
          <a
            href="#main-demo-content"
            onClick={handleSkipToContent}
            onFocus={() => setSkipLinkFocused(true)}
            onBlur={() => setSkipLinkFocused(false)}
            style={{
              position: 'absolute',
              top: skipLinkFocused ? '0' : '-100px',
              left: '0',
              background: 'var(--arcade-gold)',
              color: '#000000',
              padding: '0.4rem 0.8rem',
              fontWeight: 800,
              fontSize: '0.8rem',
              borderRadius: '4px',
              textDecoration: 'none',
              zIndex: 100,
              transition: 'top 0.2s',
              ...getFocusStyleObject()
            }}
          >
            Skip to Main Content [Press Enter]
          </a>
          {!skipLinkFocused && (
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
              (Tab into this area to reveal hidden "Skip to Main Content" bypass link)
            </span>
          )}
        </div>

        {/* Dummy Top Nav to Skip */}
        <nav aria-label="Demo Nav" style={{ display: 'flex', gap: '0.75rem', background: 'var(--bg-surface-elevated)', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          {['Dashboard', 'Analytics', 'Settings', 'Profile'].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={(e) => e.preventDefault()}
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '0.2rem 0.4rem',
                borderRadius: '3px',
                ...getFocusStyleObject()
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Main Content Target */}
        <main
          ref={mainContentRef}
          id="main-demo-content"
          tabIndex={-1}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            ...getFocusStyleObject()
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Main Stage: Modal Focus Trap Demonstration
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--arcade-cyan)' }}>
              #main-demo-content
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Click or press Space/Enter on the button below to launch an accessible modal dialog. Observe how:
            1) Focus is trapped within the dialog; 2) Pressing Escape dismisses the dialog; 3) Focus returns to this trigger button.
          </p>

          <div>
            <button
              ref={openModalBtnRef}
              type="button"
              onClick={openModal}
              className="primary-btn"
              style={{
                padding: '0.6rem 1.25rem',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                ...getFocusStyleObject()
              }}
            >
              <Sparkles size={14} />
              <span>Launch Accessible Modal Dialog</span>
            </button>
          </div>
        </main>
      </div>

      {/* Accessible Modal Overlay */}
      {modalOpen && (
        <div
          role="presentation"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-demo-title"
            style={{
              background: 'var(--bg-surface)',
              border: '2px solid var(--arcade-cyan)',
              borderRadius: '8px',
              padding: '1.5rem',
              maxWidth: '480px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 id="modal-demo-title" style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Keyboard Focus Trapped Dialog
              </h3>
              <button
                ref={modalCloseBtnRef}
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...getFocusStyleObject()
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Try pressing <kbd style={{ background: '#090d16', padding: '0.2rem 0.4rem', borderRadius: '3px', border: '1px solid #334155' }}>Tab</kbd> or <kbd style={{ background: '#090d16', padding: '0.2rem 0.4rem', borderRadius: '3px', border: '1px solid #334155' }}>Shift+Tab</kbd>. Notice that focus cycles exclusively between the input field and the close button.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label htmlFor="modal-name-input" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Your Name:
              </label>
              <input
                ref={modalFirstInputRef}
                id="modal-name-input"
                type="text"
                placeholder="Focus landed here on open..."
                style={{
                  padding: '0.6rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: '4px',
                  ...getFocusStyleObject()
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={closeModal}
                className="secondary-btn"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', ...getFocusStyleObject() }}
              >
                Cancel (or press Escape)
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="primary-btn"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', ...getFocusStyleObject() }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
