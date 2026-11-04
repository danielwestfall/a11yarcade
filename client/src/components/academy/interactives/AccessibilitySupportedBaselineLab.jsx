import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Globe,
  Sliders,
  Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const BASELINE_PRESETS = [
  {
    id: 'enterprise-intranet',
    name: 'Enterprise Intranet Managed Environment',
    desc: 'Targeted workforce with standardized hardware, Edge/Chrome on Windows 11, and licensed JAWS/NVDA screen readers.',
    minWcag: 'WCAG 2.1 AA',
    browsers: ['Edge 120+', 'Chrome 120+'],
    atTools: ['JAWS 2024', 'NVDA 2024'],
    features: {
      aria12Combobox: { supported: true, name: 'WAI-ARIA 1.2 Combobox Pattern' },
      dialogElement: { supported: true, name: 'Native HTML5 <dialog> Element' },
      cssSubgrid: { supported: true, name: 'CSS Subgrid Layouts' },
      inertAttribute: { supported: true, name: 'HTML inert Attribute' }
    }
  },
  {
    id: 'global-public-web',
    name: 'Global Public Consumer Web Application',
    desc: 'Uncontrolled user base with legacy browsers, mobile web, Safari on iOS/macOS, NVDA, VoiceOver, and TalkBack.',
    minWcag: 'WCAG 2.2 AA',
    browsers: ['Chrome', 'Safari iOS/macOS', 'Firefox', 'Edge'],
    atTools: ['VoiceOver iOS/macOS', 'NVDA', 'TalkBack Android', 'JAWS'],
    features: {
      aria12Combobox: { supported: true, name: 'WAI-ARIA 1.2 Combobox Pattern' },
      dialogElement: { supported: true, name: 'Native HTML5 <dialog> Element' },
      cssSubgrid: { supported: false, name: 'CSS Subgrid Layouts (requires legacy fallback)' },
      inertAttribute: { supported: true, name: 'HTML inert Attribute (with polyfill)' }
    }
  },
  {
    id: 'legacy-government-portal',
    name: 'Legacy Municipal Public Portal',
    desc: 'Mandated support for older hardware, Windows 10, low-bandwidth connections, and older AT versions.',
    minWcag: 'WCAG 2.1 AA / Section 508',
    browsers: ['Chrome 100+', 'Firefox ESR', 'Edge', 'Safari 15+'],
    atTools: ['NVDA 2021+', 'JAWS 2020+', 'ZoomText 2021'],
    features: {
      aria12Combobox: { supported: false, name: 'WAI-ARIA 1.2 Combobox (fails on JAWS 2020)' },
      dialogElement: { supported: false, name: 'Native HTML5 <dialog> (requires polyfill)' },
      cssSubgrid: { supported: false, name: 'CSS Subgrid Layouts' },
      inertAttribute: { supported: false, name: 'HTML inert Attribute' }
    }
  }
];

export default function AccessibilitySupportedBaselineLab() {
  const [selectedPresetId, setSelectedPresetId] = useState('global-public-web');
  const [polyfillActive, setPolyfillActive] = useState(false);
  const [semanticFallback, setSemanticFallback] = useState(false);
  const [tested, setTested] = useState(false);

  const currentPreset = BASELINE_PRESETS.find(p => p.id === selectedPresetId) || BASELINE_PRESETS[0];

  const handleSelectPreset = (id) => {
    soundManager.playClick();
    setSelectedPresetId(id);
    setTested(false);
  };

  const handleRunEvaluation = () => {
    soundManager.playAuditPing();
    setTested(true);
    if (isConforming) {
      soundManager.playCorrect();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.85 } });
    } else {
      soundManager.playIncorrect();
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setPolyfillActive(false);
    setSemanticFallback(false);
    setTested(false);
  };

  // Evaluation logic
  const failsWithoutFallback = selectedPresetId === 'legacy-government-portal' || (selectedPresetId === 'global-public-web' && !semanticFallback);
  const isConforming = !failsWithoutFallback || (polyfillActive && semanticFallback);

  return (
    <section aria-label="Accessibility Supported Baseline Simulator" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Info */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Layers size={20} aria-hidden="true" />
          Accessibility-Supported Technologies & Conformance Baselines
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Under WCAG 2.1/2.2 Conformance Requirement 4, web technologies used on a page must be <strong>accessibility-supported</strong> by users' assistive technologies and browsers in the defined organizational baseline. Test how environmental baselines dictate whether cutting-edge web features pass or fail conformance.
        </p>
      </div>

      {/* Target Baseline Selector */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-cyan)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 1: Select Target Conformance Baseline
        </legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {BASELINE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                style={{
                  minHeight: '44px',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid var(--arcade-cyan)' : '1px solid var(--arcade-border)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-surface-elevated)',
                  color: isSelected ? 'var(--arcade-cyan)' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
                aria-pressed={isSelected}
              >
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{preset.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{preset.minWcag}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Baseline Details */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Laptop size={16} aria-hidden="true" />
          Active Environment Profile: <span style={{ color: 'var(--arcade-cyan)' }}>{currentPreset.name}</span>
        </h4>
        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentPreset.desc}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
          <div>
            <strong style={{ color: 'var(--arcade-purple)' }}>Supported Browsers:</strong>
            <ul style={{ margin: '0.25rem 0 0 1.25rem', padding: 0, color: 'var(--text-muted)' }}>
              {currentPreset.browsers.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
          <div>
            <strong style={{ color: 'var(--arcade-purple)' }}>Assumed Assistive Technologies:</strong>
            <ul style={{ margin: '0.25rem 0 0 1.25rem', padding: 0, color: 'var(--text-muted)' }}>
              {currentPreset.atTools.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Remediation / Architecture Controls */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-cyan)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 2: Architecture Mitigation Strategies
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <label htmlFor="chk-polyfill" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-polyfill"
              checked={polyfillActive}
              onChange={(e) => {
                soundManager.playClick();
                setPolyfillActive(e.target.checked);
                setTested(false);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-cyan)' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              Inject W3C accessibility polyfills (e.g. <code>inert</code> polyfill & dialog focus trap shim)
            </span>
          </label>

          <label htmlFor="chk-semantic" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-semantic"
              checked={semanticFallback}
              onChange={(e) => {
                soundManager.playClick();
                setSemanticFallback(e.target.checked);
                setTested(false);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-cyan)' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              Implement progressive enhancement semantic fallback (clean HTML markup rendering when modern JS/CSS fails)
            </span>
          </label>
        </div>
      </fieldset>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={handleRunEvaluation}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--arcade-cyan)',
            color: '#000',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ShieldCheck size={18} aria-hidden="true" />
          Audit Conformance Against Baseline
        </button>

        <button
          type="button"
          onClick={handleReset}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            border: '1px solid var(--arcade-border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <RotateCcw size={16} aria-hidden="true" />
          Reset Controls
        </button>
      </div>

      {/* Audit Outcome Panel */}
      {tested && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            border: `2px solid ${isConforming ? 'var(--arcade-green)' : '#ef4444'}`,
            background: isConforming ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {isConforming ? (
              <CheckCircle2 size={24} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
            ) : (
              <XCircle size={24} style={{ color: '#ef4444' }} aria-hidden="true" />
            )}
            <h4 style={{ margin: 0, fontSize: '1.05rem', color: isConforming ? 'var(--arcade-green)' : '#ef4444' }}>
              {isConforming ? 'CONFORMANCE AUDIT PASSED (Accessibility Supported)' : 'CONFORMANCE FAILURE (Requirement 4 Violation)'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {isConforming
              ? 'Excellent architectural posture! By pairing progressive enhancement semantic fallbacks with standard polyfills, all core interactions are accessibility-supported across every browser and assistive technology combinations in the declared baseline.'
              : 'Conformance failed: Relying on unsupported browser capabilities without polyfills or progressive fallbacks breaks accessibility for users on older screen readers or legacy browser engines within the specified baseline. WCAG Requirement 4 requires relying only on technologies supported by the actual baseline user agents.'}
          </p>
        </div>
      )}
    </section>
  );
}
