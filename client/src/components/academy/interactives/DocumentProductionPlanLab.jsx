import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Calculator,
  RotateCcw,
  Sparkles,
  DollarSign,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

export default function DocumentProductionPlanLab() {
  const [pageCount, setPageCount] = useState(120);
  const [complexityLevel, setComplexityLevel] = useState('medium'); // 'simple' | 'medium' | 'complex'
  const [vendorOutsourcing, setVendorOutsourcing] = useState(false);
  const [calculated, setCalculated] = useState(false);

  // Rate estimates
  // Simple: 6-8 pages/hr
  // Medium (tables, charts): 3-4 pages/hr
  // Complex (STEM, forms, multi-layer graphics): 1-2 pages/hr
  const pagesPerHour = complexityLevel === 'simple' ? 7 : complexityLevel === 'medium' ? 3.5 : 1.5;
  const estimatedHours = Math.ceil(pageCount / pagesPerHour);
  const internalCost = estimatedHours * 65; // $65/hr fully loaded internal rate
  const vendorCost = pageCount * (complexityLevel === 'simple' ? 8 : complexityLevel === 'medium' ? 18 : 38);

  const handleCalculate = () => {
    soundManager.playAuditPing();
    setCalculated(true);
    soundManager.playCorrect();
    confetti({ particleCount: 35, spread: 60 });
  };

  return (
    <section aria-label="Document Production Capacity Planner Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Calendar size={20} aria-hidden="true" />
          Strategic Planning for Accessible Document Production
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Large-scale PDF remediation requires realistic capacity planning. Document complexity (nested data tables, STEM equations, interactive form fields) dramatically alters remediation velocity, from 7 pages/hour for simple text down to 1.5 pages/hour for complex regulatory publications.
        </p>
      </div>

      {/* Input Parameters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {/* Page Count */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="input-pages" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
            Document Batch Volume (Pages):
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="number"
              id="input-pages"
              min="10"
              max="2000"
              step="10"
              value={pageCount}
              onChange={(e) => {
                setPageCount(Math.max(1, parseInt(e.target.value) || 1));
                setCalculated(false);
              }}
              style={{
                minHeight: '44px',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--arcade-border)',
                background: 'var(--arcade-surface)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                width: '120px'
              }}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>pages total</span>
          </div>
        </div>

        {/* Complexity Selector */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="select-complexity" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
            Structural Document Complexity:
          </label>
          <select
            id="select-complexity"
            value={complexityLevel}
            onChange={(e) => {
              soundManager.playClick();
              setComplexityLevel(e.target.value);
              setCalculated(false);
            }}
            style={{
              minHeight: '44px',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--arcade-border)',
              background: 'var(--arcade-surface)',
              color: 'var(--text-main)',
              fontSize: '0.9rem'
            }}
          >
            <option value="simple">Simple Text & Single Headings (7 pages/hr)</option>
            <option value="medium">Standard Reports with Tables & Charts (3.5 pages/hr)</option>
            <option value="complex">Complex STEM, MathML & Multi-Level Forms (1.5 pages/hr)</option>
          </select>
        </div>
      </div>

      {/* Calculate Button */}
      <div>
        <button
          type="button"
          onClick={handleCalculate}
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
          <Calculator size={18} aria-hidden="true" />
          Generate Production Plan & SLA Forecast
        </button>
      </div>

      {/* Calculation Results */}
      {calculated && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            background: 'var(--bg-surface-elevated)',
            border: '2px solid var(--arcade-yellow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <h4 style={{ margin: 0, color: 'var(--arcade-yellow)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet size={18} aria-hidden="true" />
            Remediation Capacity & Budget Breakdown
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--arcade-surface)', borderRadius: '6px', border: '1px solid var(--arcade-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Labor:</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--arcade-cyan)' }}>{estimatedHours} Hours</div>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--arcade-surface)', borderRadius: '6px', border: '1px solid var(--arcade-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Internal Production Cost:</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--arcade-green)' }}>${internalCost.toLocaleString()}</div>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--arcade-surface)', borderRadius: '6px', border: '1px solid var(--arcade-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Outsourced Vendor Quote:</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--arcade-yellow)' }}>${vendorCost.toLocaleString()}</div>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong>Strategic Planning Rule:</strong> For recurring batches exceeding 500 pages/month, investing in accessible authoring templates and backend pipeline generation tools reduces remediation costs by over 75% compared to manual per-page remediation.
          </p>
        </div>
      )}
    </section>
  );
}
