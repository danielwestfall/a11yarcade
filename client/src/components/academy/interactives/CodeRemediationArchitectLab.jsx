import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  TrendingDown,
  Building,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const STRATEGIES = [
  {
    id: 'design-system',
    title: 'Design System Central Component Remediation',
    cost: 'Medium Upfront ($25k)',
    scalability: 'Instant propagation to 140+ internal applications',
    sustainability: 'Permanent solution at the root DOM level',
    legalRisk: 'Low (Eliminates underlying compliance defects)',
    recommended: true
  },
  {
    id: 'overlay-vendor',
    title: 'Third-Party JavaScript Accessibility Overlay Widget',
    cost: 'High Ongoing Recurring ($30k/yr)',
    scalability: 'Superficial DOM layer only (no server/source fix)',
    sustainability: 'Brittle (Overwritten by framework updates, hated by AT users)',
    legalRisk: 'High (Over 800+ lawsuits filed against sites with overlays in 2023-2024)',
    recommended: false
  },
  {
    id: 'scattered-patching',
    title: 'Fragmented Page-by-Page Hotfixes in Sprints',
    cost: 'Very High ($120k engineering time)',
    scalability: 'Near zero (Every team reinvents the fix separately)',
    sustainability: 'Poor (Regresses on every new frontend deployment)',
    legalRisk: 'Medium (Inconsistent compliance across views)',
    recommended: false
  }
];

export default function CodeRemediationArchitectLab() {
  const [selectedStrategyId, setSelectedStrategyId] = useState('design-system');
  const [dodPolicyEnforced, setDodPolicyEnforced] = useState(true);
  const [calculated, setCalculated] = useState(false);

  const activeStrategy = STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0];

  const handleSelectStrategy = (id) => {
    soundManager.playClick();
    setSelectedStrategyId(id);
    setCalculated(false);
  };

  const handleSimulateArchitecture = () => {
    soundManager.playAuditPing();
    setCalculated(true);
    if (activeStrategy.recommended && dodPolicyEnforced) {
      soundManager.playCorrect();
      confetti({ particleCount: 50, spread: 70 });
    } else {
      soundManager.playIncorrect();
    }
  };

  const isOptimal = activeStrategy.recommended && dodPolicyEnforced;

  return (
    <section aria-label="Enterprise Code Remediation Architecture Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-green)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Wrench size={20} aria-hidden="true" />
          Architecting Enterprise Code Remediation Strategies
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Enterprise remediation requires strategic architectural decisions. Fixing components inside a shared <strong>Design System</strong> yields exponential scalability, whereas <strong>third-party overlay widgets</strong> introduce critical legal vulnerabilities without resolving source code barriers.
        </p>
      </div>

      {/* Strategy Selector */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-green)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 1: Choose Enterprise Remediation Architecture
        </legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {STRATEGIES.map(strat => {
            const isSelected = selectedStrategyId === strat.id;
            return (
              <button
                key={strat.id}
                type="button"
                onClick={() => handleSelectStrategy(strat.id)}
                style={{
                  minHeight: '44px',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid var(--arcade-green)' : '1px solid var(--arcade-border)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-elevated)',
                  color: isSelected ? 'var(--arcade-green)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
                aria-pressed={isSelected}
              >
                <span>{strat.title}</span>
                <span style={{ fontSize: '0.75rem', color: strat.recommended ? 'var(--arcade-green)' : '#f59e0b' }}>
                  {strat.recommended ? '★ RECOMMENDED ARCHITECTURE' : '⚠️ HIGH RISK ARCHITECTURE'}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Architecture Metrics Table */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)', fontSize: '0.85rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Estimated 3-Year Cost:</span>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{activeStrategy.cost}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Organizational Scalability:</span>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{activeStrategy.scalability}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Technical Sustainability:</span>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{activeStrategy.sustainability}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Legal Risk Exposure:</span>
            <div style={{ fontWeight: 700, color: activeStrategy.legalRisk.includes('Low') ? 'var(--arcade-green)' : '#ef4444' }}>
              {activeStrategy.legalRisk}
            </div>
          </div>
        </div>
      </div>

      {/* Definition of Done Check */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-green)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 2: Agile Sprint Governance
        </legend>
        <label htmlFor="chk-dod" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
          <input
            type="checkbox"
            id="chk-dod"
            checked={dodPolicyEnforced}
            onChange={(e) => {
              soundManager.playClick();
              setDodPolicyEnforced(e.target.checked);
              setCalculated(false);
            }}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-green)' }}
          />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <strong>Sprint Definition of Done (DoD) Gate:</strong> Block pull requests from merging to production if they introduce automated or keyboard accessibility regressions.
          </span>
        </label>
      </fieldset>

      {/* Button */}
      <div>
        <button
          type="button"
          onClick={handleSimulateArchitecture}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--arcade-green)',
            color: '#000',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Zap size={18} aria-hidden="true" />
          Simulate 3-Year Technical Debt Burndown
        </button>
      </div>

      {/* Outcome */}
      {calculated && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            border: `2px solid ${isOptimal ? 'var(--arcade-green)' : '#ef4444'}`,
            background: isOptimal ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {isOptimal ? (
              <CheckCircle2 size={22} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
            ) : (
              <AlertTriangle size={22} style={{ color: '#ef4444' }} aria-hidden="true" />
            )}
            <h4 style={{ margin: 0, fontSize: '1rem', color: isOptimal ? 'var(--arcade-green)' : '#ef4444' }}>
              {isOptimal ? 'STRATEGIC ARCHITECTURE APPROVED: MAXIMAL SUSTAINABILITY' : 'ARCHITECTURAL DEFECT DETECTED: UNSUSTAINABLE STRATEGY'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {isOptimal
              ? 'Exemplary architectural leadership! Investing in the core Design System components solves accessibility once for all consumers, while an enforced Sprint Definition of Done prevents future regressions from creeping back into codebases.'
              : 'Architectural warning: Relying on overlays or scattered ad-hoc fixes wastes engineering resources and exposes the company to severe legal liability. The only robust path is source code remediation inside shared design system component libraries.'}
          </p>
        </div>
      )}
    </section>
  );
}
