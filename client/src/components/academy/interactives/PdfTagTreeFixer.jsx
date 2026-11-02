import React, { useState } from 'react';
import { FileText, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const INITIAL_NODES = [
  {
    id: 'node-swoosh',
    title: 'Top Header Graphic (Decorative Swoosh)',
    currentTag: 'Unmarked Content',
    targetTag: '/Artifact',
    isRemediated: false,
    severity: 'Critical PAC Failure',
    explanation: 'Untagged content in PDF/UA causes screen readers to announce unpredictable raw paths or fail conformance. Purely decorative elements must be marked as an Artifact.'
  },
  {
    id: 'node-h1',
    title: 'Document Title: "Annual Accessibility Report"',
    currentTag: '<H1>',
    targetTag: '<H1>',
    isRemediated: true,
    severity: 'Pass',
    explanation: 'Correct top-level primary document heading.'
  },
  {
    id: 'node-h4',
    title: 'Section Title: "Executive Summary"',
    currentTag: '<H4>',
    targetTag: '<H2>',
    isRemediated: false,
    severity: 'Matterhorn Checkpoint 14-001 Failure',
    explanation: 'Skipping heading levels (H1 directly to H4) breaks sequential screen reader heading navigation. Remediate to <H2>.'
  },
  {
    id: 'node-table',
    title: 'Compliance Data Table Headers',
    currentTag: '<TD> (Standard Data Cell)',
    targetTag: '<TH scope="col"> (Header Cell)',
    isRemediated: false,
    severity: 'Critical PAC Failure',
    explanation: 'First row of data table lacks <TH> header tags and scope, preventing screen readers from announcing column associations when navigating data cells.'
  },
  {
    id: 'node-footer-line',
    title: 'Footer Horizontal Divider Line',
    currentTag: 'Unmarked Path Element',
    targetTag: '/Artifact',
    isRemediated: false,
    severity: 'PAC Warning',
    explanation: 'Visual line separator must be tagged as an Artifact so screen readers do not announce "Path" or "Line graphic".'
  }
];

export default function PdfTagTreeFixer() {
  const [nodes, setNodes] = useState(INITIAL_NODES);

  const remediatedCount = nodes.filter(n => n.isRemediated).length;
  const pacScore = Math.round((remediatedCount / nodes.length) * 100);
  const isAllPassed = pacScore === 100;

  const handleFixNode = (id) => {
    soundManager.playCorrect();
    const updated = nodes.map(n => {
      if (n.id === id) {
        return {
          ...n,
          currentTag: n.targetTag,
          isRemediated: true
        };
      }
      return n;
    });
    setNodes(updated);

    const newRemediated = updated.filter(n => n.isRemediated).length;
    if (newRemediated === updated.length) {
      soundManager.playFanfare?.();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setNodes(INITIAL_NODES);
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={22} color="var(--arcade-amber)" />
            <span>PDF/UA Document Tag Tree Remediator</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Inspect a defective document structure tree, fix heading hierarchies, assign table header semantics, and mark artifacts for ISO 14289 conformance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="secondary-btn"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <RefreshCw size={14} />
          <span>Reset Document</span>
        </button>
      </div>

      {/* PAC Conformance Meter */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color={isAllPassed ? 'var(--arcade-green)' : 'var(--arcade-amber)'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              PAC (PDF Accessibility Checker) Automated Conformance Score
            </span>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isAllPassed ? 'var(--arcade-green)' : 'var(--arcade-amber)' }}>
            {pacScore}% {isAllPassed ? '· PDF/UA COMPLIANT ✓' : '· FAILED CHECKS'}
          </span>
        </div>

        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${pacScore}%`,
              height: '100%',
              background: isAllPassed ? 'var(--arcade-green)' : 'var(--arcade-amber)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* Split View: Visual Document vs Tags Tree */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Visual Document Layout */}
        <div style={{ background: '#ffffff', color: '#0f172a', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Visual Page Preview (Acrobat Document Page 1)
            </span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PDF/UA-1</span>
          </div>

          {/* Decorative Swoosh */}
          <div style={{ height: '24px', background: 'linear-gradient(90deg, #38bdf8 0%, #c084fc 100%)', borderRadius: '4px', opacity: 0.8 }} />

          {/* H1 */}
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#090d16' }}>
            Annual Accessibility Report
          </h1>

          {/* H4 vs H2 */}
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem' }}>
            Executive Summary
            <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '3px', background: nodes.find(n => n.id === 'node-h4')?.isRemediated ? '#dcfce7' : '#fee2e2', color: nodes.find(n => n.id === 'node-h4')?.isRemediated ? '#166534' : '#991b1b', fontFamily: 'monospace' }}>
              Current Tag: {nodes.find(n => n.id === 'node-h4')?.currentTag}
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0, color: '#334155' }}>
            This annual report details enterprise digital accessibility remediation progress across web, mobile, and electronic document assets.
          </p>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: nodes.find(n => n.id === 'node-table')?.isRemediated ? '#e0f2fe' : '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                  <td style={{ padding: '0.4rem', fontWeight: 800 }}>Department</td>
                  <td style={{ padding: '0.4rem', fontWeight: 800 }}>Violations</td>
                  <td style={{ padding: '0.4rem', fontWeight: 800 }}>Status</td>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem' }}>E-Commerce Portal</td>
                  <td style={{ padding: '0.4rem' }}>0</td>
                  <td style={{ padding: '0.4rem', color: '#16a34a' }}>Compliant</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.4rem' }}>Employee Intranet</td>
                  <td style={{ padding: '0.4rem' }}>3</td>
                  <td style={{ padding: '0.4rem', color: '#d97706' }}>In Progress</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Line */}
          <div style={{ height: '2px', background: '#e2e8f0', marginTop: 'auto' }} />
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>
            Page 1 of 12 · Confidential
          </div>
        </div>

        {/* Tags Tree Inspector & Remediation Actions */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-cyan)', textTransform: 'uppercase' }}>
            Logical Tags Tree Panel (Acrobat Pro / PAC)
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {nodes.map((node) => (
              <div
                key={node.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: `1px solid ${node.isRemediated ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  borderRadius: '6px',
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {node.title}
                  </span>
                  {node.isRemediated ? (
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700 }}>
                      ✓ Tagged as {node.targetTag}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleFixNode(node.id)}
                      className="primary-btn"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Sparkles size={12} />
                      <span>Remediate to {node.targetTag}</span>
                    </button>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {node.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
