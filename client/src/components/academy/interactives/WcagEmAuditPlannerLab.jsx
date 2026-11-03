import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileCheck,
  ListOrdered,
  Search,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const STEPS = [
  { id: 1, title: 'Step 1: Define Scope', summary: 'Define evaluation target, baseline, and website boundary.' },
  { id: 2, title: 'Step 2: Explore Website', summary: 'Identify key pages, complete processes, and diverse page types.' },
  { id: 3, title: 'Step 3: Select Sample', summary: 'Curate a representative sample (structured + random pages).' },
  { id: 4, title: 'Step 4: Audit Sample', summary: 'Evaluate WCAG success criteria and log reproducible findings.' },
  { id: 5, title: 'Step 5: Report Findings', summary: 'Synthesize audit metrics into a formal conformance statement.' }
];

export default function WcagEmAuditPlannerLab() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 State: Scope
  const [targetStandard, setTargetStandard] = useState('wcag22-aa'); // 'wcag21-aa' | 'wcag22-aa'
  const [scopeBoundary, setScopeBoundary] = useState('full-domain'); // 'full-domain' | 'custom-exclude'

  // Step 2 State: Identified elements
  const [exploredProcesses, setExploredProcesses] = useState({
    checkout: true,
    login: true,
    dataGrid: false
  });

  // Step 3 State: Representative Sample
  const [selectedPages, setSelectedPages] = useState({
    home: true,
    catalog: true,
    productDetail: true,
    cart: true,
    payment: true,
    confirmation: true,
    randomPage1: false,
    randomPage2: false
  });

  // Step 4 State: Audited criteria
  const [auditedCriteria, setAuditedCriteria] = useState({
    sc111: true,  // Non-text Content (Pass)
    sc143: false, // Contrast (Fail found)
    sc211: true,  // Keyboard (Pass)
    sc258: false, // Target Size Min (Fail found)
    sc412: true   // Name, Role, Value (Pass)
  });

  // Step 5 State: Final statement generated
  const [statementGenerated, setStatementGenerated] = useState(false);

  const pagesCount = Object.values(selectedPages).filter(Boolean).length;
  const isProcessComplete = selectedPages.cart && selectedPages.payment && selectedPages.confirmation;
  const hasRandomSample = selectedPages.randomPage1 || selectedPages.randomPage2;
  const isSampleValid = pagesCount >= 6 && isProcessComplete && hasRandomSample;

  const handleTogglePage = (key) => {
    soundManager.playClick();
    setSelectedPages(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleAudit = (key) => {
    soundManager.playClick();
    setAuditedCriteria(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerateReport = () => {
    soundManager.playClick();
    setStatementGenerated(true);
    soundManager.playCorrect();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    soundManager.playClick();
    setCurrentStep(1);
    setTargetStandard('wcag22-aa');
    setScopeBoundary('full-domain');
    setSelectedPages({
      home: true,
      catalog: true,
      productDetail: true,
      cart: true,
      payment: true,
      confirmation: true,
      randomPage1: false,
      randomPage2: false
    });
    setStatementGenerated(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro Header */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <ClipboardList size={18} color="var(--arcade-green)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            W3C WCAG-EM 1.0 Conformance Evaluation & Audit Planner Lab
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          The Website Accessibility Conformance Evaluation Methodology (WCAG-EM) is the official W3C international
          procedure for conducting comprehensive, statistically valid accessibility audits. Walk through all 5 methodological steps:
          scoping, site exploration, representative sampling, technical evaluation, and conformance statement generation.
        </p>
      </div>

      {/* 5-Step Stepper Bar */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
          {STEPS.map(step => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id || (step.id === 5 && statementGenerated);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setCurrentStep(step.id);
                }}
                style={{
                  padding: '0.6rem 0.5rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--arcade-green)' : isCompleted ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
                  background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                  color: isActive ? 'var(--arcade-green)' : isCompleted ? '#34d399' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{step.title.split(':')[0]}</span>
                  {isCompleted && <CheckCircle2 size={12} color="var(--arcade-green)" />}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {step.title.split(':')[1]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Workspace Content */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* STEP 1: DEFINE EVALUATION SCOPE */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Step 1: Define the Evaluation Scope (WCAG-EM 1.0)
              </h5>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Specify the target conformance level, accessibility baseline, and clear domain boundaries.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  1. Target Conformance Standard
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="conformanceTarget"
                      checked={targetStandard === 'wcag22-aa'}
                      onChange={() => setTargetStandard('wcag22-aa')}
                    />
                    <span>WCAG 2.2 Level AA (Current Official Standard)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="conformanceTarget"
                      checked={targetStandard === 'wcag21-aa'}
                      onChange={() => setTargetStandard('wcag21-aa')}
                    />
                    <span>WCAG 2.1 Level AA (Legacy Regulatory Baseline)</span>
                  </label>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  2. Scope Boundary & URL Definition
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="scopeBoundary"
                      checked={scopeBoundary === 'full-domain'}
                      onChange={() => setScopeBoundary('full-domain')}
                    />
                    <span>Full Website: https://shop.arcade.com/* (All sub-pages)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="scopeBoundary"
                      checked={scopeBoundary === 'custom-exclude'}
                      onChange={() => setScopeBoundary('custom-exclude')}
                    />
                    <span>Defined Subset (Explicitly exclude 3rd-party payment iframe)</span>
                  </label>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderLeft: '4px solid var(--arcade-cyan)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
              <strong>WCAG-EM Rule:</strong> Complete processes cannot be scoped out. If checkout is evaluated, all steps from cart to order confirmation must be within scope.
            </div>
          </div>
        )}

        {/* STEP 2: EXPLORE THE TARGET WEBSITE */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Step 2: Explore the Target Website
              </h5>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Identify diverse web page types, complete transactional processes, and varied functionality.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-gold)', textTransform: 'uppercase' }}>
                  A. Key Web Pages
                </span>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  Homepage, Site Map, Contact Us, About Us, Privacy Policy, Search Results.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-cyan)', textTransform: 'uppercase' }}>
                  B. Complete Processes
                </span>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  User Registration, Authentication Login, Multi-Step Checkout Flow, Form Submission.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-green)', textTransform: 'uppercase' }}>
                  C. Diverse Page Types
                </span>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  Interactive Dashboard (Data Grid), Media Player (Captions/Audio Description), Modal Dialogs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT REPRESENTATIVE SAMPLE */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Step 3: Select a Representative Sample
                </h5>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Curate the sample mix: structured core pages + complete process paths + randomly selected URLs.
                </p>
              </div>

              <div style={{ padding: '0.3rem 0.75rem', borderRadius: '4px', background: isSampleValid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${isSampleValid ? 'var(--arcade-green)' : '#ef4444'}`, fontSize: '0.8rem', fontWeight: 800, color: isSampleValid ? 'var(--arcade-green)' : '#f87171' }}>
                {isSampleValid ? '✓ Valid Representative Sample' : '⚠️ Incomplete Sample (Add Random URL & Checkout Steps)'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
              {[
                { key: 'home', label: 'Homepage', type: 'Core Page' },
                { key: 'catalog', label: 'Product Catalog', type: 'Diverse Layout' },
                { key: 'productDetail', label: 'Product Details', type: 'Interactive' },
                { key: 'cart', label: 'Cart Step 1', type: 'Complete Process' },
                { key: 'payment', label: 'Payment Step 2', type: 'Complete Process' },
                { key: 'confirmation', label: 'Order Confirmation', type: 'Complete Process' },
                { key: 'randomPage1', label: 'Random URL A (/faq/returns)', type: 'Random Sample' },
                { key: 'randomPage2', label: 'Random URL B (/blog/entry-42)', type: 'Random Sample' }
              ].map(item => (
                <label
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: selectedPages[item.key] ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                    border: `1px solid ${selectedPages[item.key] ? 'var(--arcade-green)' : 'var(--border-color)'}`,
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedPages[item.key]}
                    onChange={() => handleTogglePage(item.key)}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {item.type}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <strong>WCAG-EM Mandate:</strong> Audits must include approximately 10% randomly selected web pages to reveal unexpected accessibility barriers not found in curated key templates.
            </div>
          </div>
        )}

        {/* STEP 4: AUDIT THE SELECTED SAMPLE */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Step 4: Audit the Selected Sample
              </h5>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Evaluate WCAG 2.2 criteria across all pages in the sample and document specific barrier instances.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { key: 'sc111', sc: 'SC 1.1.1 Non-text Content (Level A)', status: auditedCriteria.sc111 ? 'PASS' : 'FAIL', details: 'All decorative icons have alt="" or aria-hidden="true". Hero images have descriptive alt.' },
                { key: 'sc143', sc: 'SC 1.4.3 Contrast Minimum (Level AA)', status: auditedCriteria.sc143 ? 'PASS' : 'FAIL', details: 'Warning: Gray text (#94a3b8 on white) achieves only 2.4:1 ratio on Checkout form.' },
                { key: 'sc211', sc: 'SC 2.1.1 Keyboard (Level A)', status: auditedCriteria.sc211 ? 'PASS' : 'FAIL', details: 'All form fields, links, and cart buttons operable via Tab, Enter, and Space.' },
                { key: 'sc258', sc: 'SC 2.5.8 Target Size Minimum (Level AA)', status: auditedCriteria.sc258 ? 'PASS' : 'FAIL', details: 'Warning: Quantity adjustment icons (- / +) are only 18x18px with 2px spacing.' },
                { key: 'sc412', sc: 'SC 4.1.2 Name, Role, Value (Level A)', status: auditedCriteria.sc412 ? 'PASS' : 'FAIL', details: 'Custom accordion elements properly convey aria-expanded and aria-controls.' }
              ].map(crit => (
                <div
                  key={crit.key}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '6px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {crit.sc}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {crit.details}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAudit(crit.key)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: crit.status === 'PASS' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: crit.status === 'PASS' ? 'var(--arcade-green)' : '#f87171'
                    }}
                  >
                    Status: {crit.status} (Click to toggle)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: REPORT EVALUATION FINDINGS */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Step 5: Report Evaluation Findings & Conformance Statement
                </h5>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Generate the formal W3C Conformance Statement and executive summary.
                </p>
              </div>

              {!statementGenerated && (
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className="primary-btn"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <FileCheck size={16} />
                  <span>Generate WCAG-EM Conformance Report</span>
                </button>
              )}
            </div>

            {statementGenerated ? (
              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '6px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem' }}>
                  <ShieldCheck size={18} color="var(--arcade-green)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#38bdf8' }}>
                    OFFICIAL WCAG-EM 1.0 EVALUATION CONFORMANCE STATEMENT
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  <div><strong>Target Standard:</strong> {targetStandard === 'wcag22-aa' ? 'W3C WCAG 2.2 Level AA' : 'W3C WCAG 2.1 Level AA'}</div>
                  <div><strong>Scope Boundary:</strong> https://shop.arcade.com/* (Includes Complete Checkout Flow)</div>
                  <div><strong>Sample Size:</strong> {pagesCount} Pages (Structured: 6, Random Sample: {hasRandomSample ? '2' : '0'})</div>
                  <div><strong>Evaluated Criteria:</strong> 50 Success Criteria Evaluated</div>
                  <div>
                    <strong>Overall Conformance Claim:</strong>{' '}
                    <span style={{ color: auditedCriteria.sc143 && auditedCriteria.sc258 ? '#4ade80' : '#facc15', fontWeight: 800 }}>
                      {auditedCriteria.sc143 && auditedCriteria.sc258 ? 'Full Conformance (WCAG 2.2 AA)' : 'Partial Conformance (Remediation Required)'}
                    </span>
                  </div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid #f59e0b', padding: '0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: '#fef08a' }}>
                  Note: Under WCAG 2.2, a website cannot claim full conformance unless ALL pages in the defined scope satisfy all Level A & AA Success Criteria or provide an accessible alternative version.
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px dashed var(--border-color)' }}>
                <ClipboardList size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Audit Data Ready for Synthesis
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Click "Generate WCAG-EM Conformance Report" above to compile the formal executive statement.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next / Previous Stepper Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => {
              soundManager.playClick();
              setCurrentStep(prev => prev - 1);
            }}
            className="secondary-btn"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
          >
            ← Previous Step
          </button>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Step {currentStep} of 5
          </span>

          <button
            type="button"
            disabled={currentStep === 5}
            onClick={() => {
              soundManager.playClick();
              setCurrentStep(prev => prev + 1);
            }}
            className="primary-btn"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
}
