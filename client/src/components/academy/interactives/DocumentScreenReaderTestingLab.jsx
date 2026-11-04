import React, { useState } from 'react';
import {
  FileText,
  Volume2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Columns,
  Table,
  FormInput
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const PDF_AUDIT_TESTS = [
  {
    id: 'form-tooltip',
    title: 'PDF Form Field Accessible Name (Tooltip Property)',
    icon: FormInput,
    desc: 'In PDF interactive forms, screen readers announce the form field "Tooltip" property as the accessible name.',
    testSnippet: 'Form Field: Name="txtFirstName", Tooltip="Legal First Name (Required)"',
    goodSpeech: 'Legal First Name (Required), edit text',
    badSpeech: 'txtFirstName, edit text (Fails: Missing Tooltip causes screen reader to speak raw internal variable name)',
    status: 'PASS'
  },
  {
    id: 'column-order',
    title: 'Multi-Column Reading Order Linearization',
    icon: Columns,
    desc: 'Visual columns must be tagged sequentially in the logical tag tree, not linearized horizontally across lines.',
    testSnippet: 'Two-column newspaper layout: Column 1 text followed by Column 2 text.',
    goodSpeech: 'Column 1 Line 1... Column 1 Line 2... Column 2 Line 1... (Correct column flow)',
    badSpeech: 'Column 1 Line 1 Column 2 Line 1... (Fails: Visual horizontal lines read instead of vertical story columns)',
    status: 'PASS'
  },
  {
    id: 'table-headers',
    title: 'Data Table Header & Cell Association (TH / TD)',
    icon: Table,
    desc: 'Each data cell in a PDF table must be enclosed in <TD> with corresponding <TH> row and column headers.',
    testSnippet: 'Quarterly Sales Table: Row 3, Column 2 -> Q2 Revenue: $1,420,000',
    goodSpeech: 'Row 3, Regional Ops, Column 2, Q2 Revenue, $1,420,000',
    badSpeech: '$1,420,000 (Fails: Untagged headers leave data cell devoid of context)',
    status: 'PASS'
  }
];

export default function DocumentScreenReaderTestingLab() {
  const [activeTestIndex, setActiveTestIndex] = useState(0);
  const [useTaggedTree, setUseTaggedTree] = useState(true);
  const [speechLog, setSpeechLog] = useState([PDF_AUDIT_TESTS[0].goodSpeech]);
  const [completed, setCompleted] = useState(false);

  const activeTest = PDF_AUDIT_TESTS[activeTestIndex];

  const handleSelectTest = (idx) => {
    soundManager.playClick();
    setActiveTestIndex(idx);
    const spoken = useTaggedTree ? PDF_AUDIT_TESTS[idx].goodSpeech : PDF_AUDIT_TESTS[idx].badSpeech;
    setSpeechLog(prev => [spoken, ...prev.slice(0, 4)]);
  };

  const handleToggleTaggedTree = () => {
    soundManager.playClick();
    const nextState = !useTaggedTree;
    setUseTaggedTree(nextState);
    const spoken = nextState ? activeTest.goodSpeech : activeTest.badSpeech;
    setSpeechLog(prev => [spoken, ...prev.slice(0, 4)]);
    if (nextState) {
      soundManager.playCorrect();
      confetti({ particleCount: 35, spread: 60 });
      setCompleted(true);
    } else {
      soundManager.playIncorrect();
    }
  };

  return (
    <section aria-label="PDF Screen Reader Testing Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <FileText size={20} aria-hidden="true" />
          Assistive Tech PDF Auditing with NVDA, JAWS & VoiceOver
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Screen readers render PDFs through an off-screen <strong>Virtual Buffer</strong> generated from the underlying PDF tag tree. Experience how JAWS and NVDA announce form tooltips, multi-column reading flows, and data table headers.
        </p>
      </div>

      {/* Test Scenarios Selector */}
      <div role="tablist" onKeyDown={(e) => {
          if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
          e.preventDefault();
          const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'));
          const idx = tabs.indexOf(document.activeElement);
          if (idx === -1) return;
          const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : e.key === 'ArrowLeft' ? (idx - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : tabs.length - 1;
          tabs[nextIdx]?.focus();
          tabs[nextIdx]?.click();
        }} aria-label="PDF Audit Scenarios" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
        {PDF_AUDIT_TESTS.map((test, idx) => {
          const isSelected = activeTestIndex === idx;
          const Icon = test.icon;
          return (
            <button
              key={test.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleSelectTest(idx)}
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{test.title}</span>
            </button>
          );
        })}
      </div>

      {/* Screen Reader Speech Simulator Console */}
      <div style={{ background: '#020617', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--arcade-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={16} aria-hidden="true" />
            NVDA / JAWS Virtual Buffer Speech Readout
          </span>
          <button
            type="button"
            onClick={handleToggleTaggedTree}
            style={{
              minHeight: '36px',
              padding: '0.4rem 0.85rem',
              borderRadius: '4px',
              border: 'none',
              background: useTaggedTree ? 'var(--arcade-green)' : '#ef4444',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {useTaggedTree ? '✓ Logical PDF Tag Tree Active' : '✕ Untagged Visual Stream'}
          </button>
        </div>

        {/* Spoken Text Box */}
        <div
          role="status"
          aria-live="assertive"
          style={{
            padding: '1rem',
            borderRadius: '6px',
            background: '#090d16',
            border: `2px solid ${useTaggedTree ? 'var(--arcade-yellow)' : '#ef4444'}`,
            color: '#facc15',
            fontFamily: 'monospace',
            fontSize: '0.95rem',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          🔊 "{useTaggedTree ? activeTest.goodSpeech : activeTest.badSpeech}"
        </div>

        {/* Scenario Explanation */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div><strong>Test Condition:</strong> {activeTest.desc}</div>
          <div style={{ marginTop: '0.35rem' }}><strong>Target Structure:</strong> {activeTest.testSnippet}</div>
        </div>
      </div>
    </section>
  );
}
