import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Eye, Move, HelpCircle, Layers } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const CRITERIA = [
  {
    id: 'sc-258',
    code: 'SC 2.5.8',
    name: 'Target Size (Minimum) (Level AA)',
    principle: 'Operable',
    summary: 'Targets must have a minimum size of 24×24 CSS pixels, or sufficient spacing between adjacent targets so a 24px diameter circle centered on each target does not intersect any other target.',
    brokenScenario: 'A mobile toolbar has 14×14 pixel touch buttons spaced only 2 pixels apart, causing frequent accidental mis-taps for users with tremors or larger fingers.',
    fixedScenario: 'Buttons are sized to at least 24×24 pixels (or padded to 44×44px hit areas) with 8px margins between adjacent touch boundaries.',
    brokenRender: {
      type: 'target-size',
      size: 14,
      gap: 2
    },
    fixedRender: {
      type: 'target-size',
      size: 32,
      gap: 12
    },
    examTip: 'Remember the exceptions to 2.5.8: inline links in sentences, browser-default controls, and elements where the presentation of the target is essential (e.g. map pins).'
  },
  {
    id: 'sc-337',
    code: 'SC 3.3.7',
    name: 'Redundant Entry (Level A)',
    principle: 'Understandable',
    summary: 'Information previously entered by or provided to the user in the same process must either be auto-populated or available for the user to select, rather than requiring re-typing.',
    brokenScenario: 'A multi-step checkout form forces the customer to manually re-type their entire 5-line physical address on Step 3 for shipping, even though they already entered it on Step 1 for billing.',
    fixedScenario: 'Step 3 provides a simple checkbox: "Shipping address same as billing address" or auto-populates the fields with an option to edit.',
    brokenRender: {
      type: 'redundant-entry',
      autoPopulated: false
    },
    fixedRender: {
      type: 'redundant-entry',
      autoPopulated: true
    },
    examTip: 'This criterion particularly assists users with cognitive disabilities, memory limitations, and motor impairments who find re-entering lengthy data exhausting and error-prone.'
  },
  {
    id: 'sc-257',
    code: 'SC 2.5.7',
    name: 'Dragging Movements (Level AA)',
    principle: 'Operable',
    summary: 'All functionality that uses a dragging movement must be achievable by a single pointer without dragging (such as clicking arrows, dropdowns, or typing numbers).',
    brokenScenario: 'A project board requires dragging and dropping task cards between columns with a mouse/finger, impossible for users who cannot sustain a click-and-drag gesture.',
    fixedScenario: 'Each task card includes "Move Left" and "Move Right" action buttons, or a dropdown menu to select the destination column directly with single clicks.',
    brokenRender: {
      type: 'dragging',
      hasButtons: false
    },
    fixedRender: {
      type: 'dragging',
      hasButtons: true
    },
    examTip: 'Dragging movements require both starting a press, moving to a target, and releasing. A single-pointer alternative requires only simple taps or clicks.'
  },
  {
    id: 'sc-326',
    code: 'SC 3.2.6',
    name: 'Consistent Help (Level A)',
    principle: 'Understandable',
    summary: 'If a web page contains help mechanisms (contact info, support link, self-help FAQs, or chat widget), they must appear in the same relative order across pages.',
    brokenScenario: 'On the homepage, the "Customer Support" chat is in the bottom-right corner. On the search page, it moves to the top header. On the product page, it is buried in the footer.',
    fixedScenario: 'The "Customer Support" chat button resides in the consistent bottom-right fixed anchor across all pages of the application.',
    brokenRender: {
      type: 'consistent-help',
      consistent: false
    },
    fixedRender: {
      type: 'consistent-help',
      consistent: true
    },
    examTip: 'Consistent Help does not require pages to have help; it mandates that IF help is provided across multiple pages, it must occur in the same relative visual and tab order.'
  }
];

export default function Wcag22NewCriteriaLab() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRemediated, setIsRemediated] = useState(false);
  const [simulatedColumn, setSimulatedColumn] = useState('To Do');

  const criteria = CRITERIA[currentIdx];

  const handleSelectCriteria = (idx) => {
    soundManager.playClick();
    setCurrentIdx(idx);
    setIsRemediated(false);
    setSimulatedColumn('To Do');
  };

  const handleToggleRemediate = () => {
    soundManager.playClick();
    if (!isRemediated) {
      soundManager.playCorrect();
    }
    setIsRemediated(!isRemediated);
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={22} color="var(--arcade-cyan)" />
            <span>WCAG 2.2 New Success Criteria Lab</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Explore and remediate real-world interactive implementations of WCAG 2.2: Target Size Minimum, Redundant Entry, Dragging Movements, and Consistent Help.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleRemediate}
          className="primary-btn"
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <span>{isRemediated ? 'Show Defective State' : 'Apply WCAG 2.2 Fix'}</span>
        </button>
      </div>

      {/* Criteria Selector Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {CRITERIA.map((sc, idx) => {
          const isActive = currentIdx === idx;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectCriteria(idx)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: isActive ? '2px solid var(--arcade-cyan)' : '1px solid var(--border-color)',
                background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface-elevated)',
                color: isActive ? 'var(--arcade-cyan)' : 'var(--text-secondary)'
              }}
            >
              <span>{sc.code}: {sc.name.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* State Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', background: 'var(--bg-surface-elevated)', padding: '0.6rem 1rem', borderRadius: '6px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {criteria.code} — {criteria.name}
            </span>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Principle: {criteria.principle}
            </span>
          </div>

          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            background: isRemediated ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: isRemediated ? '#10b981' : '#ef4444'
          }}>
            {isRemediated ? '✓ WCAG 2.2 COMPLIANT' : '⚠ VIOLATION DETECTED'}
          </span>
        </div>

        <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
          {isRemediated ? criteria.fixedScenario : criteria.brokenScenario}
        </p>

        {/* Live Interactive Sandbox Viewport */}
        <div style={{ minHeight: '220px', background: '#05070e', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* 1. Target Size (2.5.8) */}
          {criteria.id === 'sc-258' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Simulated Touch Toolbar ({isRemediated ? 'Target size: 32×32px with 12px gap' : 'Target size: 14×14px with 2px gap'})
              </span>
              <div style={{ display: 'flex', gap: `${isRemediated ? criteria.fixedRender.gap : criteria.brokenRender.gap}px`, alignItems: 'center', background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px dashed #334155' }}>
                {['Bold', 'Italic', 'Underline', 'Link', 'Undo'].map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => soundManager.playClick()}
                    title={action}
                    style={{
                      width: `${isRemediated ? criteria.fixedRender.size : criteria.brokenRender.size}px`,
                      height: `${isRemediated ? criteria.fixedRender.size : criteria.brokenRender.size}px`,
                      background: isRemediated ? 'var(--arcade-cyan)' : '#ef4444',
                      color: isRemediated ? '#000000' : '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: isRemediated ? '0.8rem' : '0.6rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    {action[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Redundant Entry (3.3.7) */}
          {criteria.id === 'sc-337' && (
            <div style={{ maxWidth: '420px', width: '100%', background: '#090d16', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Step 3: Shipping Address
              </span>

              {isRemediated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="chk-same-billing" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--arcade-green)', cursor: 'pointer', fontWeight: 700 }}>
                    <input id="chk-same-billing" type="checkbox" defaultChecked />
                    <span>✓ Same as billing address (Auto-populate 123 Main St, Seattle WA)</span>
                  </label>
                  <label htmlFor="shipping-auto-address" className="sr-only">
                    Auto-populated Shipping Address
                  </label>
                  <input
                    id="shipping-auto-address"
                    type="text"
                    disabled
                    value="123 Main St, Apt 4B, Seattle, WA 98101"
                    style={{ padding: '0.5rem', background: '#1e293b', border: '1px solid #475569', color: '#94a3b8', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                    ⚠ No auto-fill provided. User must manually re-type all 5 fields.
                  </span>
                  <label htmlFor="shipping-manual-street" className="sr-only">
                    Street Address
                  </label>
                  <input
                    id="shipping-manual-street"
                    type="text"
                    placeholder="Enter Street Address manually..."
                    style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #ef4444', color: '#fff', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                  <label htmlFor="shipping-manual-city" className="sr-only">
                    City, State, and Zip Code
                  </label>
                  <input
                    id="shipping-manual-city"
                    type="text"
                    placeholder="Enter City, State, Zip manually..."
                    style={{ padding: '0.5rem', background: '#0f172a', border: '1px solid #ef4444', color: '#fff', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* 3. Dragging Movements (2.5.7) */}
          {criteria.id === 'sc-257' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '520px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Kanban Task Board (Current Column: <strong style={{ color: 'var(--arcade-cyan)' }}>{simulatedColumn}</strong>)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {['To Do', 'In Progress', 'Done'].map(col => (
                  <div key={col} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.75rem', minHeight: '120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>{col}</span>
                    {simulatedColumn === col && (
                      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--arcade-cyan)', borderRadius: '4px', padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Audit WCAG 2.2</span>
                        {isRemediated ? (
                          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.25rem' }}>
                            <button
                              type="button"
                              onClick={() => {
                                soundManager.playClick();
                                setSimulatedColumn(col === 'Done' ? 'In Progress' : 'To Do');
                              }}
                              disabled={col === 'To Do'}
                              style={{ flex: 1, padding: '0.2rem', fontSize: '0.7rem', background: '#334155', border: 'none', color: '#fff', borderRadius: '2px', cursor: col === 'To Do' ? 'default' : 'pointer' }}
                            >
                              ← Move
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                soundManager.playClick();
                                setSimulatedColumn(col === 'To Do' ? 'In Progress' : 'Done');
                              }}
                              disabled={col === 'Done'}
                              style={{ flex: 1, padding: '0.2rem', fontSize: '0.7rem', background: '#334155', border: 'none', color: '#fff', borderRadius: '2px', cursor: col === 'Done' ? 'default' : 'pointer' }}
                            >
                              Move →
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#ef4444', fontStyle: 'italic' }}>
                            [Drag card to move - No button alternative]
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Consistent Help (3.2.6) */}
          {criteria.id === 'sc-326' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '480px' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Multi-Page Application Frame ({isRemediated ? 'Help widget pinned consistently in bottom-right' : 'Help widget moves inconsistently on each view'})
              </span>
              <div style={{ height: '140px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', position: 'relative', padding: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Primary Viewport Area</div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: isRemediated ? '12px' : '45px',
                    right: isRemediated ? '12px' : '180px',
                    background: isRemediated ? 'var(--arcade-green)' : '#ef4444',
                    color: '#000',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s'
                  }}
                >
                  <HelpCircle size={14} />
                  <span>Support Chat</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Exam Tip Card */}
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: '6px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
            💡 IAAP WAS Exam Core Rule
          </span>
          <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
            {criteria.examTip}
          </p>
        </div>
      </div>
    </div>
  );
}
