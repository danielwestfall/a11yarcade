import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Sliders,
  Ruler
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

export default function BuiltEnvironmentBlueprintLab() {
  const [activeZone, setActiveZone] = useState('ramp'); // 'ramp' | 'door' | 'turning' | 'sign'

  // Zone 1: Ramp specs
  const [rampRatio, setRampRatio] = useState(8); // 1:8 (steep fail) to 1:16 (pass >= 12)
  const [hasRestingLanding, setHasRestingLanding] = useState(false);

  // Zone 2: Door specs
  const [doorWidth, setDoorWidth] = useState(28); // 28" (fail) to 36" (pass >= 32")
  const [doorHardware, setDoorHardware] = useState('knob'); // 'knob' (fail) | 'lever' (pass)

  // Zone 3: Turning specs
  const [turningDiameter, setTurningDiameter] = useState(48); // 48" (fail) to 66" (pass >= 60")

  // Zone 4: Sign specs
  const [signHeight, setSignHeight] = useState(72); // 72" (fail) to 54" (pass between 48" and 60")
  const [signLocation, setSignLocation] = useState('door-face'); // 'door-face' (fail) | 'latch-wall' (pass)

  // Compliance calculations
  const rampPass = rampRatio >= 12 && hasRestingLanding;
  const doorPass = doorWidth >= 32 && doorHardware === 'lever';
  const turningPass = turningDiameter >= 60;
  const signPass = signHeight >= 48 && signHeight <= 60 && signLocation === 'latch-wall';

  const passedCount = [rampPass, doorPass, turningPass, signPass].filter(Boolean).length;
  const allPassed = passedCount === 4;

  const handleFixAll = () => {
    soundManager.playClick();
    setRampRatio(12);
    setHasRestingLanding(true);
    setDoorWidth(34);
    setDoorHardware('lever');
    setTurningDiameter(60);
    setSignHeight(54);
    setSignLocation('latch-wall');
    soundManager.playCorrect();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    soundManager.playClick();
    setRampRatio(8);
    setHasRestingLanding(false);
    setDoorWidth(28);
    setDoorHardware('knob');
    setTurningDiameter(48);
    setSignHeight(72);
    setSignLocation('door-face');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Info */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Compass size={18} color="var(--arcade-cyan)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Built Environment & Physical Accessibility Blueprint Simulator
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          CPACC Domain 2 encompasses accessibility in the physical built environment governed by ADAAG (2010 ADA Standards)
          and ISO 21542. Adjust architectural dimensions for wheelchair ramps, doorway clearances, turning radius,
          and tactile Braille signage to achieve full building code conformance.
        </p>
      </div>

      {/* Building Code Compliance Status Meter */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              ADAAG / ISO 21542 Architectural Conformance
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: allPassed ? 'var(--arcade-green)' : passedCount >= 2 ? 'var(--arcade-cyan)' : '#ef4444' }}>
              {passedCount} of 4 Building Standards Compliant {allPassed && '— PASSED INSPECTION ✓'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleFixAll}
              className="secondary-btn"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Sparkles size={14} color="var(--arcade-gold)" />
              <span>Apply Compliant Specs</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="secondary-btn"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 4-Segment Progress Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', height: '8px' }}>
          <div style={{ borderRadius: '4px', background: rampPass ? 'var(--arcade-green)' : '#ef4444' }} />
          <div style={{ borderRadius: '4px', background: doorPass ? 'var(--arcade-green)' : '#ef4444' }} />
          <div style={{ borderRadius: '4px', background: turningPass ? 'var(--arcade-green)' : '#ef4444' }} />
          <div style={{ borderRadius: '4px', background: signPass ? 'var(--arcade-green)' : '#ef4444' }} />
        </div>
      </div>

      {/* Architectural Zone Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'ramp', label: '1. Wheelchair Ramp (ADAAG 405)', pass: rampPass },
          { id: 'door', label: '2. Doorway & Hardware (ADAAG 404)', pass: doorPass },
          { id: 'turning', label: '3. 360° Turning Radius (ADAAG 304)', pass: turningPass },
          { id: 'sign', label: '4. Tactile Signage (ADAAG 703)', pass: signPass }
        ].map(zone => (
          <button
            key={zone.id}
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveZone(zone.id);
            }}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid',
              borderColor: activeZone === zone.id ? 'var(--arcade-cyan)' : 'var(--border-color)',
              background: activeZone === zone.id ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-elevated)',
              color: activeZone === zone.id ? 'var(--arcade-cyan)' : 'var(--text-secondary)'
            }}
          >
            {zone.pass ? <CheckCircle2 size={14} color="var(--arcade-green)" /> : <AlertTriangle size={14} color="#ef4444" />}
            <span>{zone.label}</span>
          </button>
        ))}
      </div>

      {/* Main Blueprint & Caliper Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Left: Blueprint Visualization Canvas */}
        <div style={{ background: '#07162c', border: '2px solid #1e3a8a', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', position: 'relative' }}>
          {/* Blueprint Grid Lines Background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(#1e40af 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.35, pointerEvents: 'none' }} />

          {/* ZONE 1: RAMP SVG */}
          {activeZone === 'ramp' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <svg width="280" height="130" viewBox="0 0 280 130" aria-label="Ramp Slope Blueprint Diagram">
                {/* Ground */}
                <line x1="20" y1="110" x2="260" y2="110" stroke="#38bdf8" strokeWidth="2" />
                {/* Landing Top */}
                <rect x="20" y={110 - (160 / rampRatio)} width="40" height={160 / rampRatio} fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="2" />
                {/* Ramp Incline */}
                <polygon
                  points={`60,${110 - (160 / rampRatio)} 220,110 60,110`}
                  fill={rampRatio >= 12 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}
                  stroke={rampRatio >= 12 ? '#10b981' : '#ef4444'}
                  strokeWidth="2"
                />
                {/* Resting landing if present */}
                {hasRestingLanding && (
                  <rect x="220" y="90" width="40" height="20" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />
                )}
                {/* Angle marker text */}
                <text x="130" y={85 - (60 / rampRatio)} fill={rampRatio >= 12 ? '#34d399' : '#f87171'} fontSize="11" fontWeight="bold" textAnchor="middle">
                  Slope 1:{rampRatio} ({((1 / rampRatio) * 100).toFixed(1)}% grade)
                </text>
              </svg>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: rampRatio >= 12 ? 'var(--arcade-green)' : '#ef4444', fontWeight: 800 }}>
                {rampRatio >= 12 ? '✓ COMPLIANT: Maximum 1:12 Slope (8.33% Grade)' : '⚠️ CRITICAL VIOLATION: Slope exceeds 1:12 (Tipping Hazard)'}
              </div>
            </div>
          )}

          {/* ZONE 2: DOORWAY SVG */}
          {activeZone === 'door' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <svg width="260" height="130" viewBox="0 0 260 130" aria-label="Doorway Clearance Diagram">
                {/* Wall Left */}
                <rect x="30" y="20" width="30" height="90" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2" />
                {/* Door Opening Span */}
                <line x1="60" y1="65" x2={60 + (doorWidth * 3.5)} y2="65" stroke={doorWidth >= 32 ? '#10b981' : '#ef4444'} strokeWidth="2" strokeDasharray="4" />
                {/* Wall Right */}
                <rect x={60 + (doorWidth * 3.5)} y="20" width="30" height="90" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2" />
                {/* Door leaf swinging at 90 deg */}
                <line x1="60" y1="20" x2="60" y2="100" stroke="#38bdf8" strokeWidth="4" />
                {/* Dimension label */}
                <text x={60 + ((doorWidth * 3.5) / 2)} y="55" fill={doorWidth >= 32 ? '#34d399' : '#f87171'} fontSize="11" fontWeight="bold" textAnchor="middle">
                  {doorWidth}" Clear Opening
                </text>
              </svg>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: doorPass ? 'var(--arcade-green)' : '#ef4444', fontWeight: 800 }}>
                {doorPass ? '✓ COMPLIANT: ≥32" Clear Width + Lever Handle' : '⚠️ VIOLATION: Door < 32" or Requires Tight Grasping/Twist'}
              </div>
            </div>
          )}

          {/* ZONE 3: 360 TURNING RADIUS SVG */}
          {activeZone === 'turning' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <svg width="220" height="130" viewBox="0 0 220 130" aria-label="Wheelchair 360 Turning Diagram">
                {/* Turning circle */}
                <circle
                  cx="110"
                  cy="65"
                  r={turningDiameter * 0.8}
                  fill={turningDiameter >= 60 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
                  stroke={turningDiameter >= 60 ? '#10b981' : '#ef4444'}
                  strokeWidth="2"
                  strokeDasharray="4"
                />
                {/* Wheelchair icon center */}
                <text x="110" y="70" fill="#38bdf8" fontSize="24" textAnchor="middle">♿</text>
                <text x="110" y="120" fill={turningDiameter >= 60 ? '#34d399' : '#f87171'} fontSize="11" fontWeight="bold" textAnchor="middle">
                  Diameter: {turningDiameter} inches
                </text>
              </svg>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: turningPass ? 'var(--arcade-green)' : '#ef4444', fontWeight: 800 }}>
                {turningPass ? '✓ COMPLIANT: Full 60" Wheelchair Turning Circle' : '⚠️ VIOLATION: Under 60" Diameter (Wheelchair Cannot Turn 360°)'}
              </div>
            </div>
          )}

          {/* ZONE 4: TACTILE SIGNAGE SVG */}
          {activeZone === 'sign' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <svg width="260" height="130" viewBox="0 0 260 130" aria-label="Signage Mounting Height Diagram">
                {/* Finish floor */}
                <line x1="20" y1="110" x2="240" y2="110" stroke="#38bdf8" strokeWidth="2" />
                {/* Door Frame */}
                <rect x="40" y="30" width="70" height="80" fill="none" stroke="#60a5fa" strokeWidth="2" />
                {/* Latch side wall */}
                <rect x="120" y="30" width="80" height="80" fill="none" stroke="#1e3a8a" strokeWidth="1" />
                {/* Sign Plate */}
                <rect
                  x={signLocation === 'door-face' ? 60 : 140}
                  y={110 - (signHeight * 1.05)}
                  width="30"
                  height="16"
                  fill={signPass ? '#10b981' : '#ef4444'}
                  rx="2"
                />
                <text x={signLocation === 'door-face' ? 75 : 155} y={122 - (signHeight * 1.05)} fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                  ROOM
                </text>
                {/* Height line */}
                <line x1={signLocation === 'door-face' ? 95 : 175} y1="110" x2={signLocation === 'door-face' ? 95 : 175} y2={110 - (signHeight * 1.05)} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2" />
                <text x="210" y="80" fill="#f59e0b" fontSize="10" fontWeight="bold">
                  {signHeight}" high
                </text>
              </svg>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: signPass ? 'var(--arcade-green)' : '#ef4444', fontWeight: 800 }}>
                {signPass ? '✓ COMPLIANT: Latch-side wall & 48"-60" baseline' : '⚠️ VIOLATION: Mounted on door or outside 48"-60" range'}
              </div>
            </div>
          )}
        </div>

        {/* Right: Architectural Caliper Controls */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Controls for ZONE 1: RAMP */}
          {activeZone === 'ramp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="ramp-slope-slider" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                  Ramp Slope Ratio (1 : X) — Max Allowed: 1:12
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    id="ramp-slope-slider"
                    type="range"
                    aria-label="Ramp Slope Ratio (1 to X)"
                    min="6"
                    max="16"
                    step="1"
                    value={rampRatio}
                    onChange={(e) => {
                      soundManager.playClick();
                      setRampRatio(parseInt(e.target.value, 10));
                    }}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'monospace', color: rampRatio >= 12 ? 'var(--arcade-green)' : '#ef4444' }}>
                    1:{rampRatio}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasRestingLanding}
                    onChange={(e) => {
                      soundManager.playClick();
                      setHasRestingLanding(e.target.checked);
                    }}
                  />
                  <span>Include 60" × 60" Level Resting Landing (Every 30" rise)</span>
                </label>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <strong>ADAAG 405.2:</strong> Ramp runs shall have a running slope not steeper than 1:12 (8.33%). Cross slope must not exceed 1:48.
              </div>
            </div>
          )}

          {/* Controls for ZONE 2: DOOR */}
          {activeZone === 'door' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="door-width-slider" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                  Door Clear Opening Width (Inches) — Min Required: 32"
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    id="door-width-slider"
                    type="range"
                    aria-label="Door Clear Opening Width in inches"
                    min="26"
                    max="38"
                    step="1"
                    value={doorWidth}
                    onChange={(e) => {
                      soundManager.playClick();
                      setDoorWidth(parseInt(e.target.value, 10));
                    }}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'monospace', color: doorWidth >= 32 ? 'var(--arcade-green)' : '#ef4444' }}>
                    {doorWidth}"
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Operable Door Hardware (ADAAG 404.2.7)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setDoorHardware('knob');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: doorHardware === 'knob' ? '#ef4444' : 'var(--border-color)',
                      background: doorHardware === 'knob' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface)',
                      color: doorHardware === 'knob' ? '#f87171' : 'var(--text-secondary)'
                    }}
                  >
                    Round Twist Knob (Violates Rule)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setDoorHardware('lever');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: doorHardware === 'lever' ? 'var(--arcade-green)' : 'var(--border-color)',
                      background: doorHardware === 'lever' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                      color: doorHardware === 'lever' ? 'var(--arcade-green)' : 'var(--text-secondary)'
                    }}
                  >
                    Lever Handle (Closed-Fist Operable)
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <strong>ADAAG 404.2.3:</strong> Door openings shall provide a clear width of 32 inches minimum measured between the face of the door and opposite stop at 90°.
              </div>
            </div>
          )}

          {/* Controls for ZONE 3: TURNING */}
          {activeZone === 'turning' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="turning-diameter-slider" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                  Turning Space Diameter (Inches) — Min Required: 60"
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    id="turning-diameter-slider"
                    type="range"
                    aria-label="Turning Space Diameter in inches"
                    min="42"
                    max="66"
                    step="2"
                    value={turningDiameter}
                    onChange={(e) => {
                      soundManager.playClick();
                      setTurningDiameter(parseInt(e.target.value, 10));
                    }}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'monospace', color: turningDiameter >= 60 ? 'var(--arcade-green)' : '#ef4444' }}>
                    {turningDiameter}"
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <strong>ADAAG 304.3.1:</strong> The turning space shall be a space of 60 inches (1525 mm) diameter minimum. The space shall be permitted to include knee and toe clearances.
              </div>
            </div>
          )}

          {/* Controls for ZONE 4: SIGNAGE */}
          {activeZone === 'sign' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="sign-height-slider" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                  Mounting Height to Character Baseline (Inches) — Allowed: 48" to 60"
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    id="sign-height-slider"
                    type="range"
                    aria-label="Mounting Height to Character Baseline in inches"
                    min="36"
                    max="72"
                    step="2"
                    value={signHeight}
                    onChange={(e) => {
                      soundManager.playClick();
                      setSignHeight(parseInt(e.target.value, 10));
                    }}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'monospace', color: (signHeight >= 48 && signHeight <= 60) ? 'var(--arcade-green)' : '#ef4444' }}>
                    {signHeight}"
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Sign Placement Location (ADAAG 703.4.2)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSignLocation('door-face');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: signLocation === 'door-face' ? '#ef4444' : 'var(--border-color)',
                      background: signLocation === 'door-face' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface)',
                      color: signLocation === 'door-face' ? '#f87171' : 'var(--text-secondary)'
                    }}
                  >
                    On Face of Door (Hazard!)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSignLocation('latch-wall');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: signLocation === 'latch-wall' ? 'var(--arcade-green)' : 'var(--border-color)',
                      background: signLocation === 'latch-wall' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                      color: signLocation === 'latch-wall' ? 'var(--arcade-green)' : 'var(--text-secondary)'
                    }}
                  >
                    Wall on Latch Side of Door
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <strong>ADAAG 703.4.1 & 703.4.2:</strong> Tactile signs must be on the latch side of the door. Tactile characters must be 48 inches minimum above the finish floor to baseline of lowest tactile character and 60 inches maximum to baseline of highest tactile character.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
