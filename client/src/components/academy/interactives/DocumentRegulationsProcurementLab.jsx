import React, { useState } from 'react';
import {
  FileBadge,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Scale,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const PROCUREMENT_CANDIDATES = [
  {
    id: 'vendor-compliant',
    name: 'DocuAccessible Suite Pro',
    atagPartA: 'ATAG 2.0 Part A: Fully Accessible UI with Screen Reader & Keyboard Support',
    atagPartB: 'ATAG 2.0 Part B: Exports PDF/UA-1 compliant tag trees by default',
    vpatRemarks: 'Detailed notes citing NVDA/JAWS audits with specific minor bug fixes scheduled in Q2 SLA',
    recommendation: 'RECOMMENDED FOR PROCUREMENT (Credible, Compliant)',
    compliant: true
  },
  {
    id: 'vendor-greenwashed',
    name: 'AutoConvert AI PDF Engine',
    atagPartA: 'ATAG 2.0 Part A: Flash-based authoring toolbar inaccessible to screen readers',
    atagPartB: 'ATAG 2.0 Part B: Emits untagged raster PDFs without text or tag trees',
    vpatRemarks: 'Suspiciously claims 100% "Supports" across every criteria with no evaluation test notes',
    recommendation: 'REJECT (Procurement Greenwashing & Legal Risk)',
    compliant: false
  }
];

export default function DocumentRegulationsProcurementLab() {
  const [selectedVendorId, setSelectedVendorId] = useState('vendor-compliant');
  const [requireIndemnification, setRequireIndemnification] = useState(true);
  const [procurementEvaluated, setProcurementEvaluated] = useState(false);

  const activeVendor = PROCUREMENT_CANDIDATES.find(v => v.id === selectedVendorId) || PROCUREMENT_CANDIDATES[0];

  const handleEvaluate = () => {
    soundManager.playAuditPing();
    setProcurementEvaluated(true);
    if (activeVendor.compliant && requireIndemnification) {
      soundManager.playCorrect();
      confetti({ particleCount: 45, spread: 60 });
    } else {
      soundManager.playIncorrect();
    }
  };

  const isApproved = activeVendor.compliant && requireIndemnification;

  return (
    <section aria-label="Document Software Procurement & Regulations Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <FileBadge size={20} aria-hidden="true" />
          Consulting on Global Standards, PDF/UA & ICT Procurement
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Procuring document generation and authoring software requires evaluating <strong>ATAG 2.0 (Authoring Tool Accessibility Guidelines)</strong>: the tool must be accessible for authors with disabilities (Part A) and must generate accessible, tagged PDF/UA output (Part B).
        </p>
      </div>

      {/* Vendor Selector */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 1: Evaluate Software RFP Candidates
        </legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {PROCUREMENT_CANDIDATES.map(v => {
            const isSelected = selectedVendorId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setSelectedVendorId(v.id);
                  setProcurementEvaluated(false);
                }}
                style={{
                  minHeight: '44px',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid var(--arcade-yellow)' : '1px solid var(--arcade-border)',
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface-elevated)',
                  color: isSelected ? 'var(--arcade-yellow)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                aria-pressed={isSelected}
              >
                <div>{v.name}</div>
                <div style={{ fontSize: '0.75rem', color: v.compliant ? 'var(--arcade-green)' : '#ef4444', marginTop: '0.2rem' }}>
                  {v.recommendation}
                </div>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Vendor Details */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>
          <strong style={{ color: 'var(--arcade-yellow)' }}>ATAG Part A (Authoring UI): </strong>
          <span style={{ color: 'var(--text-main)' }}>{activeVendor.atagPartA}</span>
        </div>
        <div>
          <strong style={{ color: 'var(--arcade-yellow)' }}>ATAG Part B (Accessible Output): </strong>
          <span style={{ color: 'var(--text-main)' }}>{activeVendor.atagPartB}</span>
        </div>
        <div>
          <strong style={{ color: 'var(--arcade-yellow)' }}>ACR / VPAT Remarks: </strong>
          <span style={{ color: 'var(--text-muted)' }}>{activeVendor.vpatRemarks}</span>
        </div>
      </div>

      {/* Contract Terms */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 2: Procurement Contractual Risk Mitigation
        </legend>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
          <input
            type="checkbox"
            id="chk-indemnity"
            checked={requireIndemnification}
            onChange={(e) => {
              soundManager.playClick();
              setRequireIndemnification(e.target.checked);
              setProcurementEvaluated(false);
            }}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
          />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <strong>Include Mandatory Remediation SLA & Legal Indemnification Clause:</strong> Vendor must repair verified accessibility defects within 30 days and indemnify buyer against non-compliance claims.
          </span>
        </label>
      </fieldset>

      {/* Action */}
      <div>
        <button
          type="button"
          onClick={handleEvaluate}
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
          <Scale size={18} aria-hidden="true" />
          Conduct Procurement Compliance Determination
        </button>
      </div>

      {/* Outcome */}
      {procurementEvaluated && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            border: `2px solid ${isApproved ? 'var(--arcade-green)' : '#ef4444'}`,
            background: isApproved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {isApproved ? (
              <CheckCircle2 size={22} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
            ) : (
              <AlertTriangle size={22} style={{ color: '#ef4444' }} aria-hidden="true" />
            )}
            <h4 style={{ margin: 0, fontSize: '1rem', color: isApproved ? 'var(--arcade-green)' : '#ef4444' }}>
              {isApproved ? 'PROCUREMENT APPROVED: FULL ATAG & PDF/UA COMPLIANCE' : 'PROCUREMENT REJECTED: CRITICAL RISK EXPOSURE'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {isApproved
              ? 'Excellent procurement decision! Selecting software that satisfies both ATAG 2.0 Part A and Part B, backed by binding remediation SLAs and indemnification, ensures compliance while empowering disabled authors to create accessible content.'
              : 'Procurement hazard: Procuring tools with fraudulent VPAT claims (100% "Supports" without remarks) or lacking contractual remediation warranties directly violates ICT procurement standards (Section 508 / EN 301 549).'}
          </p>
        </div>
      )}
    </section>
  );
}
