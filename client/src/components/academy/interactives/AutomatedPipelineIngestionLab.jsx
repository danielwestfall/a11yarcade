import React, { useState } from 'react';
import {
  Server,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Settings,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

export default function AutomatedPipelineIngestionLab() {
  const [enableTaggedPdfFlag, setEnableTaggedPdfFlag] = useState(false);
  const [injectDocumentTitle, setInjectDocumentTitle] = useState(false);
  const [semanticTableTemplate, setSemanticTableTemplate] = useState(false);
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const handleRunVeraPdfAudit = () => {
    soundManager.playAuditPing();
    setAuditRunning(true);

    setTimeout(() => {
      setAuditRunning(false);
      const isCompliant = enableTaggedPdfFlag && injectDocumentTitle && semanticTableTemplate;

      if (isCompliant) {
        soundManager.playCorrect();
        confetti({ particleCount: 45, spread: 65 });
        setAuditResult({
          status: 'PASS',
          title: 'veraPDF Automated Validation: 100% PDF/UA-1 Compliant',
          details: 'All emitted monthly statements now contain valid StructTreeRoot, PDF Document Title metadata, and semantic TH/TD cell bindings.'
        });
      } else {
        soundManager.playIncorrect();
        setAuditResult({
          status: 'FAIL',
          title: 'veraPDF Audit Failure: Non-Compliant Documents Emitted',
          details: 'Backend PDF generator emits untagged documents. Automated billing pipelines producing 100,000 statements/day must fix the server-side generation template.'
        });
      }
    }, 600);
  };

  const handleReset = () => {
    soundManager.playClick();
    setEnableTaggedPdfFlag(false);
    setInjectDocumentTitle(false);
    setSemanticTableTemplate(false);
    setAuditResult(null);
  };

  return (
    <section aria-label="Automated Document Pipeline Auditor Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Server size={20} aria-hidden="true" />
          Auditing Automated Systems Emitting Inaccessible Documents
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Enterprises produce millions of transactional documents (bank statements, utility invoices, medical claims) via backend server engines. Fixing inaccessible outputs requires reconfiguring the <strong>server-side generation template and engine flags</strong>, validated through command-line tools like <strong>veraPDF</strong>.
        </p>
      </div>

      {/* Backend Engine Configuration Form */}
      <fieldset style={{ border: '1px solid var(--arcade-border)', borderRadius: '8px', padding: '1rem', background: 'var(--arcade-surface)' }}>
        <legend style={{ color: 'var(--arcade-yellow)', fontWeight: 700, padding: '0 0.5rem', fontSize: '0.95rem' }}>
          Server PDF Engine Generation Parameters
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-flag-tagged"
              checked={enableTaggedPdfFlag}
              onChange={(e) => {
                soundManager.playClick();
                setEnableTaggedPdfFlag(e.target.checked);
                setAuditResult(null);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              Enable <code>engine.setGenerateTaggedPdf(true)</code> in PDF rendering pipeline
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-meta-title"
              checked={injectDocumentTitle}
              onChange={(e) => {
                soundManager.playClick();
                setInjectDocumentTitle(e.target.checked);
                setAuditResult(null);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              Inject dynamic Document Title metadata (<code>/Title (Monthly Statement - March 2026)</code>)
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minHeight: '44px', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="chk-table-template"
              checked={semanticTableTemplate}
              onChange={(e) => {
                soundManager.playClick();
                setSemanticTableTemplate(e.target.checked);
                setAuditResult(null);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--arcade-yellow)' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              Update transactional statement HTML template to output semantic <code>&lt;th scope="col"&gt;</code> table headers
            </span>
          </label>
        </div>
      </fieldset>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={handleRunVeraPdfAudit}
          disabled={auditRunning}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--arcade-yellow)',
            color: '#000',
            fontWeight: 800,
            cursor: auditRunning ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Terminal size={18} aria-hidden="true" />
          {auditRunning ? 'Running veraPDF Engine Audit...' : 'Execute veraPDF CLI Automated Audit'}
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
          Reset Parameters
        </button>
      </div>

      {/* veraPDF Result Panel */}
      {auditResult && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            border: `2px solid ${auditResult.status === 'PASS' ? 'var(--arcade-green)' : '#ef4444'}`,
            background: auditResult.status === 'PASS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {auditResult.status === 'PASS' ? (
              <CheckCircle2 size={22} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
            ) : (
              <XCircle size={22} style={{ color: '#ef4444' }} aria-hidden="true" />
            )}
            <h4 style={{ margin: 0, fontSize: '1rem', color: auditResult.status === 'PASS' ? 'var(--arcade-green)' : '#ef4444' }}>
              {auditResult.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {auditResult.details}
          </p>
        </div>
      )}
    </section>
  );
}
