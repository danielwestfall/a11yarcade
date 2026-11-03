import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  XCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Shield,
  Clock,
  Landmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

export default function DocumentPolicyGovernanceLab() {
  const [technicalStandard, setTechnicalStandard] = useState('pdf-ua'); // 'pdf-ua' | 'vague'
  const [legacyExceptionSla, setLegacyExceptionSla] = useState(true); // 48-hour SLA for legacy docs
  const [executiveSponsor, setExecutiveSponsor] = useState(true);
  const [policyEvaluated, setPolicyEvaluated] = useState(false);

  const handleEvaluatePolicy = () => {
    soundManager.playAuditPing();
    setPolicyEvaluated(true);
    if (isRobustPolicy) {
      soundManager.playCorrect();
      confetti({ particleCount: 45, spread: 60 });
    } else {
      soundManager.playIncorrect();
    }
  };

  const isRobustPolicy = technicalStandard === 'pdf-ua' && legacyExceptionSla && executiveSponsor;

  return (
    <section aria-label="Enterprise Document Policy & Governance Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Scale size={20} aria-hidden="true" />
          Advising Leadership on Enterprise Document Policy & Governance
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          An enterprise document accessibility policy protects organizations from systemic legal exposure. Key pillars include defining explicit technical benchmarks (<strong>PDF/UA & WCAG 2.1 AA</strong>), formalizing on-demand exception SLAs for legacy repositories, and establishing executive leadership governance.
        </p>
      </div>

      {/* Policy Governance Clauses Form */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Enterprise Electronic Document Policy Directives
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          {/* Clause 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="select-standard" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
              1. Designated Technical Benchmark Standard:
            </label>
            <select
              id="select-standard"
              value={technicalStandard}
              onChange={(e) => {
                soundManager.playClick();
                setTechnicalStandard(e.target.value);
                setPolicyEvaluated(false);
              }}
              style={{
                minHeight: '44px',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--arcade-border)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            >
              <option value="pdf-ua">ISO 14289-1 (PDF/UA-1) & W3C WCAG 2.1 Level AA (Clear, Enforceable)</option>
              <option value="vague">"Commercially reasonable accessibility efforts" (Vague, Legally Indefensible)</option>
            </select>
          </div>

          {/* Clause 2 */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-legacy-sla"
              checked={legacyExceptionSla}
              onChange={(e) => {
                soundManager.playClick();
                setLegacyExceptionSla(e.target.checked);
                setPolicyEvaluated(false);
              }}
              style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
            />
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>2. Legacy Archive Exception Protocol with 48-Hour SLA:</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Historical archives are exempt from immediate mass remediation, provided an on-demand accessible conversion request SLA (48-72 hrs) is published.</div>
            </div>
          </label>

          {/* Clause 3 */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-exec-sponsor"
              checked={executiveSponsor}
              onChange={(e) => {
                soundManager.playClick();
                setExecutiveSponsor(e.target.checked);
                setPolicyEvaluated(false);
              }}
              style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
            />
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>3. Executive Leadership Sponsorship & Resource Allocation:</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>C-suite sponsor designated to allocate training budgets, procurement oversight, and cross-departmental accountability.</div>
            </div>
          </label>
        </div>
      </fieldset>

      {/* Button */}
      <div>
        <button
          type="button"
          onClick={handleEvaluatePolicy}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--arcade-yellow)',
            color: '#000',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Landmark size={18} aria-hidden="true" />
          Audit Policy Governance Credibility
        </button>
      </div>

      {/* Outcome */}
      {policyEvaluated && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            border: `2px solid ${isRobustPolicy ? 'var(--arcade-green)' : '#ef4444'}`,
            background: isRobustPolicy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {isRobustPolicy ? (
              <CheckCircle2 size={22} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
            ) : (
              <XCircle size={22} style={{ color: '#ef4444' }} aria-hidden="true" />
            )}
            <h4 style={{ margin: 0, fontSize: '1rem', color: isRobustPolicy ? 'var(--arcade-green)' : '#ef4444' }}>
              {isRobustPolicy ? 'ENTERPRISE GOVERNANCE POLICY RATED: ROBUST & DEFENSIBLE' : 'POLICY VULNERABILITIES DETECTED: LEGAL EXPOSURE RISK'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {isRobustPolicy
              ? 'Outstanding policy architecture! Referencing ISO 14289-1 and WCAG 2.1 AA provides unambiguous technical criteria, the 48-hour legacy SLA shields against unreasonable mass-conversion burdens, and executive sponsorship ensures sustainable compliance.'
              : 'Policy deficient: Vague commitments or ignoring legacy archives leaves the enterprise vulnerable to civil rights complaints and ADA Title II/III lawsuits. Policies require concrete technical standards and published alternative format protocols.'}
          </p>
        </div>
      )}
    </section>
  );
}
