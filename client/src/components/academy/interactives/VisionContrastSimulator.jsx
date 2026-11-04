import React, { useState, useMemo } from 'react';
import { Eye, ShieldCheck, AlertTriangle, RefreshCw, Sparkles, Layers, Sliders } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

// Relative Luminance calculation per WCAG 2.1 / 2.2 specs (including 0.04045 erratum)
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex) {
  if (typeof hex !== 'string') return null;
  const clean = hex.trim().replace(/^#/, '');
  // Strictly validate 3 or 6 valid hexadecimal characters
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) {
    return null;
  }
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function getContrastRatio(fgHex, bgHex) {
  try {
    const fg = hexToRgb(fgHex);
    const bg = hexToRgb(bgHex);
    if (!fg || !bg) return null;
    const l1 = getLuminance(fg.r, fg.g, fg.b);
    const l2 = getLuminance(bg.r, bg.g, bg.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return ((lighter + 0.05) / (darker + 0.05));
  } catch {
    return null;
  }
}

const VISION_MODES = [
  { id: 'normal', name: 'Standard Vision', desc: 'Typical trichromatic vision' },
  { id: 'protanopia', name: 'Protanopia', desc: 'Red-blind / L-cone deficiency (~1% of males)' },
  { id: 'deuteranopia', name: 'Deuteranopia', desc: 'Green-blind / M-cone deficiency (~5% of males)' },
  { id: 'tritanopia', name: 'Tritanopia', desc: 'Blue-yellow deficiency (rare, ~0.01%)' },
  { id: 'achromatopsia', name: 'Achromatopsia', desc: 'Complete color blindness (Monochrome)' },
  { id: 'cataracts', name: 'Cataracts', desc: 'Clouded lens with reduced contrast & glare' },
  { id: 'tunnel', name: 'Tunnel Vision', desc: 'Glaucoma / Retinitis Pigmentosa peripheral loss' },
  { id: 'macular', name: 'Macular Degeneration', desc: 'Central vision loss / scotoma' }
];

const COLOR_PRESETS = [
  { name: 'Cyber Blue on Dark (High AAA)', fg: '#38bdf8', bg: '#090d16' },
  { name: 'Emerald on Black (High AAA)', fg: '#10b981', bg: '#050505' },
  { name: 'Slate Gray on Dark (Fails AA)', fg: '#64748b', bg: '#0f172a' },
  { name: 'Subtle Yellow on White (Critical Fail)', fg: '#facc15', bg: '#ffffff' },
  { name: 'Dark Charcoal on White (AAA)', fg: '#1e293b', bg: '#ffffff' },
  { name: 'Crimson on Dark (Fails AA Normal)', fg: '#ef4444', bg: '#090d16' }
];

export default function VisionContrastSimulator() {
  const [visionMode, setVisionMode] = useState('normal');
  const [fgColor, setFgColor] = useState('#38bdf8');
  const [bgColor, setBgColor] = useState('#090d16');
  const [textSize, setTextSize] = useState('normal'); // 'normal' | 'large'

  const ratio = useMemo(() => getContrastRatio(fgColor, bgColor), [fgColor, bgColor]);
  const isValidHex = ratio !== null;
  const formattedRatio = isValidHex ? `${ratio.toFixed(2)}:1` : 'Invalid Hex';

  const passesAaNormal = isValidHex && ratio >= 4.5;
  const passesAaLarge = isValidHex && ratio >= 3.0;
  const passesAaaNormal = isValidHex && ratio >= 7.0;
  const passesAaaLarge = isValidHex && ratio >= 4.5;
  const passesUi = isValidHex && ratio >= 3.0;

  const handleModeChange = (modeId) => {
    soundManager.playClick();
    setVisionMode(modeId);
  };

  const handleApplyPreset = (preset) => {
    soundManager.playClick();
    setFgColor(preset.fg);
    setBgColor(preset.bg);
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* SVG Color Filters Definition */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          {/* Protanopia (Red Weak) */}
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0,     0, 0
                      0.558, 0.442, 0,     0, 0
                      0,     0.242, 0.758, 0, 0
                      0,     0,     0,     1, 0"
            />
          </filter>

          {/* Deuteranopia (Green Weak) */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0,   0, 0
                      0.70,  0.30,  0,   0, 0
                      0,     0.30,  0.70, 0, 0
                      0,     0,     0,   1, 0"
            />
          </filter>

          {/* Tritanopia (Blue Weak) */}
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05,  0,     0, 0
                      0,    0.433, 0.567, 0, 0
                      0,    0.475, 0.525, 0, 0
                      0,    0,     0,     1, 0"
            />
          </filter>

          {/* Achromatopsia (Monochrome) */}
          <filter id="achromatopsia-filter">
            <feColorMatrix
              type="matrix"
              values="0.299, 0.587, 0.114, 0, 0
                      0.299, 0.587, 0.114, 0, 0
                      0.299, 0.587, 0.114, 0, 0
                      0,     0,     0,     1, 0"
            />
          </filter>

          {/* Cataracts (Blur + contrast reduction) */}
          <filter id="cataracts-filter">
            <feGaussianBlur stdDeviation="2.2" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.85" intercept="0.1" />
              <feFuncG type="linear" slope="0.85" intercept="0.1" />
              <feFuncB type="linear" slope="0.85" intercept="0.1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={22} color="var(--arcade-cyan)" />
            <span>Vision & Contrast Lab</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Test WCAG 2.1/2.2 relative luminance ratios and simulate how color blindness and low-vision conditions impact readability.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'var(--bg-surface-elevated)',
            border: `2px solid ${passesAaNormal ? 'var(--arcade-green)' : 'var(--arcade-crimson)'}`,
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>RATIO:</span>
            <span style={{ color: passesAaNormal ? 'var(--arcade-green)' : 'var(--arcade-crimson)', fontSize: '1.15rem' }}>
              {formattedRatio}
            </span>
          </div>
        </div>
      </div>

      {/* Vision Mode Filter Tabs */}
      <div role="group" aria-labelledby="vision-condition-heading">
        <div id="vision-condition-heading" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
          Simulated Vision Condition:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {VISION_MODES.map(mode => {
            const isActive = visionMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeChange(mode.id)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isActive ? '2px solid var(--arcade-cyan)' : '1px solid var(--border-color)',
                  background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface-elevated)',
                  color: isActive ? 'var(--arcade-cyan)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
                title={mode.desc}
              >
                {mode.name}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontStyle: 'italic' }}>
          Active filter: {VISION_MODES.find(m => m.id === visionMode)?.desc}
        </p>
      </div>

      {/* Color Controls & Preset Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Custom Pickers */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
            🎨 Color Palette Pickers
          </h4>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label htmlFor="fg-color-input" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Foreground (Text / Icon)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  id="fg-color-input"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  style={{ width: '40px', height: '36px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', background: 'transparent', padding: 0 }}
                />
                <input
                  id="fg-hex-text"
                  type="text"
                  aria-label="Foreground Hex Color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label htmlFor="bg-color-input" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Background (Surface)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  id="bg-color-input"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: '40px', height: '36px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', background: 'transparent', padding: 0 }}
                />
                <input
                  id="bg-hex-text"
                  type="text"
                  aria-label="Background Hex Color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
            ⚡ Real-World Test Presets
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            {COLOR_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                style={{
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  borderRadius: '4px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: p.fg, border: '1px solid #ffffff' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WCAG Conformance Scorecard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WCAG AA Normal Text (4.5:1)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: passesAaNormal ? 'var(--arcade-green)' : 'var(--arcade-crimson)' }}>
            {passesAaNormal ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{passesAaNormal ? 'PASS (AA)' : 'FAIL (< 4.5:1)'}</span>
          </div>
        </div>

        <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WCAG AA Large Text (3.0:1)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: passesAaLarge ? 'var(--arcade-green)' : 'var(--arcade-crimson)' }}>
            {passesAaLarge ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{passesAaLarge ? 'PASS (AA Large)' : 'FAIL (< 3.0:1)'}</span>
          </div>
        </div>

        <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WCAG AAA Normal Text (7.0:1)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: passesAaaNormal ? 'var(--arcade-green)' : 'var(--arcade-amber)' }}>
            {passesAaaNormal ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{passesAaaNormal ? 'PASS (AAA)' : 'FAIL (< 7.0:1)'}</span>
          </div>
        </div>

        <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UI & Icons SC 1.4.11 (3.0:1)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: passesUi ? 'var(--arcade-green)' : 'var(--arcade-crimson)' }}>
            {passesUi ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{passesUi ? 'PASS (UI)' : 'FAIL (< 3.0:1)'}</span>
          </div>
        </div>
      </div>

      {/* Live Visual Simulation Canvas */}
      <div
        className="card"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--arcade-cyan)', textTransform: 'uppercase' }}>
            Live Render Viewport (Simulating {VISION_MODES.find(m => m.id === visionMode)?.name})
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            SVG matrix applied directly to viewport
          </span>
        </div>

        {/* Viewport Frame with Filter Applied */}
        <div
          style={{
            background: bgColor,
            color: fgColor,
            padding: '2rem',
            borderRadius: '6px',
            border: `2px solid ${passesAaNormal ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            position: 'relative',
            filter:
              visionMode === 'protanopia'
                ? 'url(#protanopia-filter)'
                : visionMode === 'deuteranopia'
                ? 'url(#deuteranopia-filter)'
                : visionMode === 'tritanopia'
                ? 'url(#tritanopia-filter)'
                : visionMode === 'achromatopsia'
                ? 'url(#achromatopsia-filter)'
                : visionMode === 'cataracts'
                ? 'url(#cataracts-filter)'
                : 'none',
            transition: 'background 0.2s, color 0.2s'
          }}
        >
          {/* Tunnel Vision Overlay */}
          {visionMode === 'tunnel' && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.92) 55%, black 100%)',
                pointerEvents: 'none',
                zIndex: 5
              }}
            />
          )}

          {/* Macular Degeneration Overlay */}
          {visionMode === 'macular' && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, rgba(15,15,15,0.95) 0%, rgba(30,30,30,0.8) 25%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: 5
              }}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: fgColor }}>
              Digital Accessibility For Everyone
            </h2>

            <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, maxWidth: '680px', color: fgColor }}>
              Accessibility is essential for developers, designers, and organizations that want to build high-quality websites and tools, and not exclude people from using their products and services.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                style={{
                  background: fgColor,
                  color: bgColor,
                  border: 'none',
                  padding: '0.6rem 1.25rem',
                  fontWeight: 800,
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Accessible Action Button
              </button>

              <span style={{ fontSize: '0.85rem', color: fgColor, borderBottom: `1px solid ${fgColor}` }}>
                Secondary Text Link
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
