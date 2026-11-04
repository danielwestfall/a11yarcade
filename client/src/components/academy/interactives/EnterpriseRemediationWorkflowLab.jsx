import React, { useState } from 'react';
import {
  Workflow,
  CheckCircle2,
  XCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Split,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

export default function EnterpriseRemediationWorkflowLab() {
  const [hasSourceFile, setHasSourceFile] = useState(true);
  const [remediationPath, setRemediationPath] = useState('source'); // 'source' | 'acrobat-only'
  const [runPacAudit, setRunPacAudit] = useState(true);
  const [workflowExecuted, setWorkflowExecuted] = useState(false);

  const handleExecuteWorkflow = () => {
    soundManager.playAuditPing();
    setWorkflowExecuted(true);
    if (isValidWorkflow) {
      soundManager.playCorrect();
      confetti({ particleCount: 45, spread: 65 });
    } else {
      soundManager.playIncorrect();
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setHasSourceFile(true);
    setRemediationPath('source');
    setRunPacAudit(true);
    setWorkflowExecuted(false);
  };

  // Valid workflow: If source file exists, fixing in source is required to prevent rework on next doc update.
  // Must run automated + manual PAC audit before publishing.
  const isValidWorkflow = (hasSourceFile ? remediationPath === 'source' : remediationPath === 'acrobat-only') && runPacAudit;

  return (
    <section aria-label="Enterprise Document Remediation Workflow Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Workflow size={20} aria-hidden="true" />
          Enterprise Document Ingestion, Remediation & Approvals
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Enterprise remediation requires strict workflow routing. If a source file (Word/InDesign) is available, <strong>fixing at the source</strong> prevents fixes from being overwritten when documents are re-exported. Final approval requires PAC verification and screen reader signoff.
        </p>
      </div>

      {/* Step 1: Ingestion Triage */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 1: Document Ingestion Triage
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <label htmlFor="chk-has-source" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-has-source"
              checked={hasSourceFile}
              onChange={(e) => {
                soundManager.playClick();
                setHasSourceFile(e.target.checked);
                setWorkflowExecuted(false);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <strong>Original Source Document Available:</strong> Editable Word (.docx) or InDesign (.indd) package is located in corporate document repository.
            </span>
          </label>
        </div>
      </fieldset>

      {/* Step 2: Routing Decision */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 2: Remediation Routing Route
        </legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setRemediationPath('source');
              setWorkflowExecuted(false);
            }}
            style={{
              minHeight: '44px',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: remediationPath === 'source' ? '2px solid var(--arcade-green)' : '1px solid var(--arcade-border)',
              background: remediationPath === 'source' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-elevated)',
              color: remediationPath === 'source' ? 'var(--arcade-green)' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
            aria-pressed={remediationPath === 'source'}
          >
            Route A: Fix in Native Source File & Re-Export Tagged PDF
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setRemediationPath('acrobat-only');
              setWorkflowExecuted(false);
            }}
            style={{
              minHeight: '44px',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: remediationPath === 'acrobat-only' ? '2px solid #ef4444' : '1px solid var(--arcade-border)',
              background: remediationPath === 'acrobat-only' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface-elevated)',
              color: remediationPath === 'acrobat-only' ? '#ef4444' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
            aria-pressed={remediationPath === 'acrobat-only'}
          >
            Route B: Perform Acrobat Post-Processing Patching Only
          </button>
        </div>
      </fieldset>

      {/* Step 3: Verification Gate */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Step 3: Quality Gate Signoff
        </legend>
        <label htmlFor="chk-pac-audit" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
          <input
            type="checkbox"
            id="chk-pac-audit"
            checked={runPacAudit}
            onChange={(e) => {
              soundManager.playClick();
              setRunPacAudit(e.target.checked);
              setWorkflowExecuted(false);
            }}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
          />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <strong>PAC & Screen Reader Verification:</strong> Require passing PAC report (ISO 14289-1) and manual NVDA reading verification before publishing to public portal.
          </span>
        </label>
      </fieldset>

      {/* Action */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={handleExecuteWorkflow}
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
          <Workflow size={18} aria-hidden="true" />
          Execute Workflow Approval Engine
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
          Reset Workflow
        </button>
      </div>

      {/* Outcome */}
      {workflowExecuted && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            border: `2px solid ${isValidWorkflow ? 'var(--arcade-green)' : '#ef4444'}`,
            background: isValidWorkflow ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {isValidWorkflow ? (
              <CheckCircle2 size={22} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
            ) : (
              <XCircle size={22} style={{ color: '#ef4444' }} aria-hidden="true" />
            )}
            <h4 style={{ margin: 0, fontSize: '1rem', color: isValidWorkflow ? 'var(--arcade-green)' : '#ef4444' }}>
              {isValidWorkflow ? 'ENTERPRISE WORKFLOW SIGNED OFF & APPROVED' : 'WORKFLOW BLOCKED: HIGH-RISK PROCESS FAILURE'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {isValidWorkflow
              ? 'Exemplary workflow integrity! Fixing headings and tables in the native source document ensures future document revisions inherit full accessibility, while PAC verification guarantees zero PDF/UA syntax errors.'
              : 'Workflow rejected: Applying tags solely inside Acrobat when the source Word/InDesign document exists guarantees that future document updates will completely wipe out remediation work. Always remediate at the source whenever the source file is available.'}
          </p>
        </div>
      )}
    </section>
  );
}
