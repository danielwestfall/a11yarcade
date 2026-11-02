import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, RefreshCw, BarChart2, Sparkles } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const DIMENSIONS = [
  {
    id: 'gov',
    title: 'Governance & Organizational Policy',
    options: [
      { level: 1, label: 'Level 1 (Ad-hoc): No official policy; accessibility is only considered when a complaint or legal threat arrives.' },
      { level: 3, label: 'Level 3 (Defined): Formal published digital accessibility policy mandating WCAG 2.1 AA across all web & mobile properties.' },
      { level: 5, label: 'Level 5 (Optimizing): Board-level oversight, executive compensation tied to accessibility KPIs, and continuous community co-design.' }
    ]
  },
  {
    id: 'proc',
    title: 'ICT Procurement & Vendor Management',
    options: [
      { level: 1, label: 'Level 1 (Ad-hoc): Vendors selected purely on price; no accessibility clauses or VPAT reviews.' },
      { level: 3, label: 'Level 3 (Defined): Accessibility Conformance Reports (ACRs / VPATs) required in all RFPs; vendors contractually obligated to remediate bugs.' },
      { level: 5, label: 'Level 5 (Optimizing): Vendors undergo live user-testing evaluations and accessibility audits before contract execution.' }
    ]
  },
  {
    id: 'dev',
    title: 'Engineering & QA Integration',
    options: [
      { level: 1, label: 'Level 1 (Ad-hoc): Accessibility never tested; QA relies on visual inspection.' },
      { level: 3, label: 'Level 3 (Defined): Automated CI/CD axe-core testing gates + mandatory manual screen reader QA passes before release.' },
      { level: 5, label: 'Level 5 (Optimizing): People with disabilities actively employed on QA teams testing daily preview builds with custom AT rigs.' }
    ]
  },
  {
    id: 'training',
    title: 'Culture, Training & Professional Development',
    options: [
      { level: 1, label: 'Level 1 (Ad-hoc): No training provided; staff unaware of WCAG.' },
      { level: 3, label: 'Level 3 (Defined): Role-based annual training for designers, developers, and content authors; IAAP certification subsidized.' },
      { level: 5, label: 'Level 5 (Optimizing): Universal design is core enterprise brand identity; company publishes open-source accessibility design systems.' }
    ]
  }
];

export default function A11yMaturityModelAuditor() {
  const [selections, setSelections] = useState({
    gov: 3,
    proc: 1,
    dev: 3,
    training: 1
  });

  const handleSelect = (dimId, level) => {
    soundManager.playClick();
    setSelections(prev => ({
      ...prev,
      [dimId]: level
    }));
  };

  const totalScore = Object.values(selections).reduce((a, b) => a + b, 0);
  const averageLevel = (totalScore / DIMENSIONS.length).toFixed(1);

  const getMaturityStage = (avg) => {
    if (avg < 2) return { stage: 'Level 1: Initial / Ad-Hoc', color: '#ef4444', desc: 'Reactive, uncoordinated, and legally vulnerable.' };
    if (avg < 3.5) return { stage: 'Level 3: Defined & Systematic', color: '#f59e0b', desc: 'Consistent enterprise policies and established baseline testing workflows.' };
    return { stage: 'Level 5: Optimizing & Inclusive Culture', color: '#10b981', desc: 'Industry-leading accessibility culture with pervasive proactive design.' };
  };

  const status = getMaturityStage(averageLevel);

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={22} color="var(--arcade-gold)" />
            <span>Enterprise Accessibility Maturity Model (AMM) Auditor</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Evaluate an organization's maturity across Governance, Procurement, Development, and Culture per CPACC Domain 3 management standards.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0.8rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', border: `1px solid ${status.color}` }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: status.color }}>
            Overall: {averageLevel} / 5.0
          </span>
        </div>
      </div>

      {/* Stage Summary Banner */}
      <div style={{ background: 'var(--bg-surface)', border: `2px solid ${status.color}`, borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: status.color }}>
          {status.stage}
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {status.desc}
        </p>
      </div>

      {/* Audit Dimensions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {DIMENSIONS.map((dim) => (
          <div key={dim.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {dim.title}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dim.options.map((opt) => {
                const isSelected = selections[dim.id] === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => handleSelect(dim.id, opt.level)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-elevated)',
                      border: isSelected ? '2px solid var(--arcade-cyan)' : '1px solid var(--border-color)',
                      color: isSelected ? 'var(--arcade-cyan)' : 'var(--text-secondary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}
                  >
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: isSelected ? '5px solid var(--arcade-cyan)' : '2px solid var(--border-color)', display: 'inline-block' }} />
                    <span style={{ flex: 1 }}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
