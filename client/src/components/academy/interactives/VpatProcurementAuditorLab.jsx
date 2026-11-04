import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileText,
  Search,
  ExternalLink,
  Award,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const VENDORS = [
  {
    id: 'vendor-a',
    name: 'NovaHR Enterprise',
    price: '$450,000 / yr',
    vpatVersion: 'VPAT 2.4 WCAG',
    conformanceClaim: '100% "Supports" across all 50 Success Criteria',
    riskLevel: 'CRITICAL RISK (Vendor Greenwashing)',
    riskColor: '#ef4444',
    analysis: 'Suspiciously claims 100% "Supports" on all criteria with copy-pasted generic text ("Product complies"). Lists SC 1.4.3 Contrast and SC 3.3.1 Error Identification as "Not Applicable". Omits assistive technology test configurations. High likelihood of immediate legal liability.',
    findings: [
      { sc: '1.4.3 Contrast', claim: 'Not Applicable', verdict: 'BLATANT FALSE CLAIM — Web software always has text' },
      { sc: '2.1.1 Keyboard', claim: 'Supports', verdict: 'Vague boilerplate without testing details' },
      { sc: 'Testing Methodology', claim: 'None stated', verdict: 'No screen reader or manual audit recorded' }
    ]
  },
  {
    id: 'vendor-b',
    name: 'TalentAxis Cloud',
    price: '$480,000 / yr',
    vpatVersion: 'VPAT 2.5 508 & WCAG Edition',
    conformanceClaim: 'Detailed "Partially Supports" with Roadmap',
    riskLevel: 'LOW RISK (Trustworthy & Transparent)',
    riskColor: 'var(--arcade-green)',
    analysis: 'Transparent and credible ACR. Accurately reports "Partially Supports" on SC 1.4.3 (notes specific gray text in billing table) and SC 2.4.7 (focus outline missing on datepicker modal). Cites testing on NVDA 2024 with Firefox and JAWS with Chrome. Includes binding engineering remediation release date in Q1.',
    findings: [
      { sc: '1.4.3 Contrast', claim: 'Partially Supports', verdict: 'Accurately documents 3 button edge cases with fix date' },
      { sc: '2.1.1 Keyboard', claim: 'Supports', verdict: 'Tested via NVDA + Firefox and Chrome' },
      { sc: 'Remediation Roadmap', claim: 'Engineering SLA attached', verdict: 'Committed to 30-day Blocker fix SLA' }
    ]
  },
  {
    id: 'vendor-c',
    name: 'LegacyWork Systems',
    price: '$390,000 / yr',
    vpatVersion: 'Legacy VPAT 1.0 (2012 / Section 508 1194.22)',
    conformanceClaim: 'Outdated 1998 Section 508 Standards',
    riskLevel: 'DISQUALIFIED (Obsolete Standard)',
    riskColor: '#f59e0b',
    analysis: 'Submitted a 12-year-old VPAT based on obsolete pre-2017 Section 508 standards (1194.22 rules). Fails to map to modern WCAG 2.1 or 2.2 AA. Disqualified from federal or enterprise procurement compliance.',
    findings: [
      { sc: 'Standard', claim: 'Legacy 1194.22', verdict: 'Obsolete — does not meet WCAG 2.x mandate' },
      { sc: 'Evaluation Date', claim: 'November 2013', verdict: 'ACR must be updated within the past 12 months' },
      { sc: 'Modern AT Support', claim: 'Unknown', verdict: 'Fails ICT baseline requirements' }
    ]
  }
];

export default function VpatProcurementAuditorLab() {
  const [selectedVendorId, setSelectedVendorId] = useState('vendor-b');
  const [contractClauses, setContractClauses] = useState({
    remediationSla: true,      // 30-day fix for Blocker defects
    indemnification: false,     // Vendor indemnifies buyer against lawsuits
    independentVerification: false // Right to conduct 3rd-party audit
  });
  const [awardDecision, setAwardDecision] = useState(null);

  const selectedVendor = VENDORS.find(v => v.id === selectedVendorId) || VENDORS[1];
  const allClausesActive = contractClauses.remediationSla && contractClauses.indemnification && contractClauses.independentVerification;

  const handleSelectVendor = (id) => {
    soundManager.playClick();
    setSelectedVendorId(id);
  };

  const handleToggleClause = (key) => {
    soundManager.playClick();
    setContractClauses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAwardContract = () => {
    soundManager.playClick();
    if (selectedVendorId === 'vendor-b' && allClausesActive) {
      setAwardDecision('SUCCESS');
      soundManager.playCorrect();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else if (selectedVendorId === 'vendor-a') {
      setAwardDecision('FAIL_GREENWASH');
      soundManager.playIncorrect();
    } else if (selectedVendorId === 'vendor-c') {
      setAwardDecision('FAIL_OBSOLETE');
      soundManager.playIncorrect();
    } else {
      setAwardDecision('FAIL_CLAUSES');
      soundManager.playIncorrect();
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setSelectedVendorId('vendor-b');
    setContractClauses({ remediationSla: true, indemnification: false, independentVerification: false });
    setAwardDecision(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro Header */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Briefcase size={18} color="var(--arcade-cyan)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Enterprise ICT Procurement & VPAT / ACR Auditor Lab
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          WAS Domain 3 covers the accessible procurement lifecycle. Purchasing third-party software without strict accessibility
          vetting introduces massive legal and operational risk. Review 3 competing commercial vendor Accessibility Conformance
          Reports (ACRs), spot "greenwashing" red flags, and draft binding contractual safeguards.
        </p>
      </div>

      {/* Vendor Selection Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
        {VENDORS.map(vendor => {
          const isSelected = selectedVendorId === vendor.id;
          return (
            <button
              key={vendor.id}
              type="button"
              onClick={() => handleSelectVendor(vendor.id)}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: `2px solid ${isSelected ? vendor.riskColor : 'var(--border-color)'}`,
                background: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  {vendor.name}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                  {vendor.price}
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: vendor.riskColor, textTransform: 'uppercase' }}>
                {vendor.riskLevel}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {vendor.conformanceClaim}
              </div>
            </button>
          );
        })}
      </div>

      {/* Forensic ACR Inspection Desk */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Forensic ACR Document Review
            </span>
            <h5 style={{ margin: '0.2rem 0 0 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {selectedVendor.name} — {selectedVendor.vpatVersion}
            </h5>
          </div>

          <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '4px', background: `${selectedVendor.riskColor}22`, color: selectedVendor.riskColor, border: `1px solid ${selectedVendor.riskColor}` }}>
            {selectedVendor.riskLevel}
          </span>
        </div>

        {/* Narrative Analysis */}
        <div style={{ background: 'var(--bg-surface)', padding: '0.9rem', borderRadius: '6px', borderLeft: `4px solid ${selectedVendor.riskColor}`, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          {selectedVendor.analysis}
        </div>

        {/* Criteria Inspection Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Sample Criterion Claims from Submitted ACR
          </span>
          {selectedVendor.findings.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.6rem 0.8rem',
                borderRadius: '4px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                flexWrap: 'wrap',
                gap: '0.4rem'
              }}
            >
              <div>
                <strong>{f.sc}:</strong> <span style={{ color: 'var(--text-secondary)' }}>"{f.claim}"</span>
              </div>
              <div style={{ fontWeight: 700, color: selectedVendor.id === 'vendor-b' ? 'var(--arcade-green)' : '#ef4444' }}>
                {f.verdict}
              </div>
            </div>
          ))}
        </div>

        {/* Contractual Safeguards Checklist */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--arcade-cyan)' }}>
            Required Contractual Safeguards (IAAP Procurement Best Practice)
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem' }}>
            <label htmlFor="chk-clause-sla" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', borderRadius: '4px', background: contractClauses.remediationSla ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-surface)', border: `1px solid ${contractClauses.remediationSla ? 'var(--arcade-green)' : 'var(--border-color)'}`, cursor: 'pointer', fontSize: '0.8rem' }}>
              <input
                id="chk-clause-sla"
                type="checkbox"
                checked={contractClauses.remediationSla}
                onChange={() => handleToggleClause('remediationSla')}
              />
              <span><strong>Remediation SLA:</strong> Vendor must resolve Blocker defects within 30 days.</span>
            </label>

            <label htmlFor="chk-clause-indemn" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', borderRadius: '4px', background: contractClauses.indemnification ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-surface)', border: `1px solid ${contractClauses.indemnification ? 'var(--arcade-green)' : 'var(--border-color)'}`, cursor: 'pointer', fontSize: '0.8rem' }}>
              <input
                id="chk-clause-indemn"
                type="checkbox"
                checked={contractClauses.indemnification}
                onChange={() => handleToggleClause('indemnification')}
              />
              <span><strong>Indemnification Clause:</strong> Vendor indemnifies buyer against accessibility lawsuits.</span>
            </label>

            <label htmlFor="chk-clause-verify" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', borderRadius: '4px', background: contractClauses.independentVerification ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-surface)', border: `1px solid ${contractClauses.independentVerification ? 'var(--arcade-green)' : 'var(--border-color)'}`, cursor: 'pointer', fontSize: '0.8rem' }}>
              <input
                id="chk-clause-verify"
                type="checkbox"
                checked={contractClauses.independentVerification}
                onChange={() => handleToggleClause('independentVerification')}
              />
              <span><strong>Independent Verification:</strong> Buyer retains right to conduct 3rd-party manual audits.</span>
            </label>
          </div>
        </div>

        {/* Action Button & Decision Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={handleAwardContract}
            className="primary-btn"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Scale size={16} />
            <span>Award Procurement Contract</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="secondary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            Reset
          </button>
        </div>

        {/* Decision Result Feedback */}
        {awardDecision === 'SUCCESS' && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--arcade-green)', padding: '1rem', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--arcade-green)', display: 'block', marginBottom: '0.25rem' }}>
              ✓ EXCELLENT PROCUREMENT DECISION!
            </strong>
            You selected <strong>TalentAxis Cloud</strong>, recognizing that an honest, detailed ACR with a committed remediation roadmap is far safer than deceptive 100% claims. Pairing this vendor with all 3 contract clauses (Remediation SLA, Indemnification, and Independent Audits) completely shields your organization from risk.
          </div>
        )}

        {awardDecision === 'FAIL_GREENWASH' && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '1rem', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            <strong style={{ color: '#ef4444', display: 'block', marginBottom: '0.25rem' }}>
              ⚠️ PROCUREMENT TRAP: VENDOR GREENWASHING
            </strong>
            You awarded the contract to <strong>NovaHR Enterprise</strong>. Claiming 100% "Supports" across all 50 criteria with copy-pasted text and marking core criteria as "Not Applicable" is the #1 hallmark of vendor greenwashing. In an audit, this system will fail immediately and expose your organization to lawsuits.
          </div>
        )}

        {awardDecision === 'FAIL_OBSOLETE' && (
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', padding: '1rem', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '0.25rem' }}>
              ⚠️ REJECTED: OBSOLETE ACR SUBMISSION
            </strong>
            <strong>LegacyWork Systems</strong> submitted an obsolete 2012 VPAT covering pre-2017 Section 508 rules without WCAG 2.x mapping. Procuring software with a 12-year-old ACR violates enterprise and federal acquisition regulations.
          </div>
        )}

        {awardDecision === 'FAIL_CLAUSES' && (
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', padding: '1rem', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '0.25rem' }}>
              ⚠️ MISSING CONTRACTUAL SAFEGUARDS
            </strong>
            You selected the correct vendor, but you failed to check all 3 mandatory contractual safeguards! Without indemnification and remediation SLAs, the vendor has zero contractual obligation to fix defects post-deployment.
          </div>
        )}
      </div>
    </div>
  );
}
