import React, { useState } from 'react';
import { FileSearch, CheckCircle2, XCircle, AlertTriangle, Volume2, ShieldCheck, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const AUDIT_ELEMENTS = [
  {
    id: 'fig-alt',
    title: 'Figure 1: Quarterly Sales Revenue Growth',
    type: 'Image / Figure Tag',
    pacResult: {
      status: 'PASS',
      pacMessage: 'Figure tag contains an /Alt property string (Syntactically valid PDF/UA-1).'
    },
    screenReaderOutput: 'Graphic: "chart_final_v3_export.png"',
    verdict: 'false-pass',
    matterhornCheckpoint: 'Matterhorn Protocol 13-004: Alternative text does not represent the purpose or information conveyed by the figure.',
    remediation: 'Replace the filename with descriptive data summary: "Bar chart showing Q3 sales revenue rose 18% to $4.2M, driven by enterprise subscriptions."'
  },
  {
    id: 'table-headers',
    title: 'Financial Breakdown Table (Multi-Tier Headers)',
    type: 'Table Tag Structure',
    pacResult: {
      status: 'PASS',
      pacMessage: 'Table structure contains valid <Table>, <TR>, <TH>, and <TD> tags with no empty cells.'
    },
    screenReaderOutput: 'Table 4 columns, 6 rows. "Row 2, Column 3: 14.2%". (Screen reader announces data cell with no associated column or row header context).',
    verdict: 'false-pass',
    matterhornCheckpoint: 'Matterhorn Protocol 15-004: A data cell does not have an associated header cell via Scope, ColumnSpan, or Headers attributes.',
    remediation: 'Assign Scope="Column" to tier 1 headers and configure Headers attribute references for multi-level headers in Acrobat Pro Table Editor.'
  },
  {
    id: 'reading-order',
    title: 'Two-Column Policy Article Layout',
    type: 'Document Reading Order',
    pacResult: {
      status: 'PASS',
      pacMessage: 'All text content is enclosed within structural tags in the Logical Structure Tree.'
    },
    screenReaderOutput: 'Reads line 1 column 1, then line 1 column 2: "Our remote work policy all team members must submit requires quarterly manager approval hardware requests by Friday."',
    verdict: 'false-pass',
    matterhornCheckpoint: 'Matterhorn Protocol 09-001: Content is not in the logical reading order represented by the structure tree.',
    remediation: 'Re-order tags in the Adobe Acrobat Tag Tree so that Column 1 content is read completely before Column 2 begins.'
  },
  {
    id: 'form-label',
    title: 'Contact Information: Employee ID Field',
    type: 'Interactive Form Field',
    pacResult: {
      status: 'PASS',
      pacMessage: 'Form field /Widget has a valid /TU (Tooltip) description attribute.'
    },
    screenReaderOutput: 'Edit text: "Employee Identification Number (6-digit format, e.g., 123456)".',
    verdict: 'true-pass',
    matterhornCheckpoint: 'Matterhorn Protocol 17-001: Form field tooltip accurately describes expected input and formatting constraints.',
    remediation: 'No remediation required. Both automated syntax and human manual audit pass.'
  }
];

export default function PacAutomatedAuditLab() {
  const [selectedElementId, setSelectedElementId] = useState(AUDIT_ELEMENTS[0].id);
  const [userVerdicts, setUserVerdicts] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const activeElement = AUDIT_ELEMENTS.find(el => el.id === selectedElementId);

  const handleSelectElement = (id) => {
    soundManager.playClick();
    setSelectedElementId(id);
  };

  const handleSetVerdict = (elementId, verdict) => {
    if (submitted) return;
    soundManager.playClick();
    setUserVerdicts(prev => ({
      ...prev,
      [elementId]: verdict
    }));
  };

  const handlePlaySpeech = () => {
    soundManager.playClick();
    setAudioPlaying(true);
    setTimeout(() => {
      setAudioPlaying(false);
    }, 2000);
  };

  const handleSubmitAudit = () => {
    soundManager.playClick();
    let correctCount = 0;
    AUDIT_ELEMENTS.forEach(el => {
      if (userVerdicts[el.id] === el.verdict) {
        correctCount++;
      }
    });

    if (correctCount === AUDIT_ELEMENTS.length) {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }
    setSubmitted(true);
  };

  const handleResetAudit = () => {
    soundManager.playClick();
    setUserVerdicts({});
    setSubmitted(false);
  };

  const answeredCount = Object.keys(userVerdicts).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <FileSearch size={20} color="#f59e0b" aria-hidden="true" />
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b' }}>
              PAC Automated vs Screen Reader Manual Audit Lab
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Investigate PDF documents that pass automated PAC (PDF Accessibility Checker) tests with 100% green checkmarks to catch automated false passes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Audited: {answeredCount} / {AUDIT_ELEMENTS.length}
          </span>
        </div>
      </div>

      {/* Main Audit Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Document Elements Selector */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Document Sample Elements
          </span>

          {AUDIT_ELEMENTS.map((el, idx) => {
            const isSelected = el.id === selectedElementId;
            const currentVerdict = userVerdicts[el.id];
            const isCorrect = submitted && currentVerdict === el.verdict;

            return (
              <button
                key={el.id}
                type="button"
                onClick={() => handleSelectElement(el.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface-elevated)',
                  border: isSelected ? '2px solid #f59e0b' : '1px solid var(--border-color)',
                  color: isSelected ? '#f59e0b' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    #{idx + 1}. {el.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {el.type}
                  </span>
                </div>

                {submitted ? (
                  isCorrect ? (
                    <CheckCircle2 size={18} color="#10b981" aria-label="Audited correctly" />
                  ) : (
                    <XCircle size={18} color="#ef4444" aria-label="Audit verdict incorrect" />
                  )
                ) : currentVerdict ? (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', background: currentVerdict === 'true-pass' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: currentVerdict === 'true-pass' ? '#10b981' : '#ef4444' }}>
                    {currentVerdict === 'true-pass' ? 'Pass' : 'False Pass'}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Detailed Inspection Panel */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
              Inspect Element #{AUDIT_ELEMENTS.findIndex(e => e.id === activeElement.id) + 1}
            </span>
            <h5 style={{ margin: '0.25rem 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeElement.title}
            </h5>
          </div>

          {/* PAC 2024 Automated Result */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="#10b981" aria-hidden="true" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>
                PAC 2024 Automated Check: PASS (100% Green Checkmark)
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {activeElement.pacResult.pacMessage}
            </p>
          </div>

          {/* Screen Reader Simulation */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Volume2 size={16} color="#38bdf8" aria-hidden="true" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>
                  Manual Screen Reader (NVDA / JAWS) Speech Output
                </span>
              </div>
              <button
                type="button"
                onClick={handlePlaySpeech}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: audioPlaying ? '#10b981' : '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Volume2 size={14} />
                <span>{audioPlaying ? 'Speaking...' : 'Simulate Speech'}</span>
              </button>
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                background: 'rgba(0,0,0,0.3)',
                padding: '0.6rem 0.8rem',
                borderRadius: '4px',
                borderLeft: '3px solid #38bdf8'
              }}
            >
              "{activeElement.screenReaderOutput}"
            </div>
          </div>

          {/* User Audit Judgment */}
          <fieldset
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '0.85rem 1rem',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <legend style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-primary)', padding: '0 0.25rem' }}>
              Your Audit Verdict (Human Verification)
            </legend>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={submitted}
                onClick={() => handleSetVerdict(activeElement.id, 'true-pass')}
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  borderRadius: '6px',
                  border: userVerdicts[activeElement.id] === 'true-pass' ? '2px solid #10b981' : '1px solid var(--border-color)',
                  background: userVerdicts[activeElement.id] === 'true-pass' ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface)',
                  color: userVerdicts[activeElement.id] === 'true-pass' ? '#10b981' : 'var(--text-secondary)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: submitted ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <CheckCircle2 size={16} />
                <span>Genuine Accessible Pass</span>
              </button>

              <button
                type="button"
                disabled={submitted}
                onClick={() => handleSetVerdict(activeElement.id, 'false-pass')}
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  borderRadius: '6px',
                  border: userVerdicts[activeElement.id] === 'false-pass' ? '2px solid #ef4444' : '1px solid var(--border-color)',
                  background: userVerdicts[activeElement.id] === 'false-pass' ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)',
                  color: userVerdicts[activeElement.id] === 'false-pass' ? '#ef4444' : 'var(--text-secondary)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: submitted ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <XCircle size={16} />
                <span>Automated False Pass (Fails Human Test)</span>
              </button>
            </div>
          </fieldset>

          {/* Detailed Matterhorn Citation on Submit */}
          {submitted && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '6px',
                background: userVerdicts[activeElement.id] === activeElement.verdict ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderLeft: `4px solid ${userVerdicts[activeElement.id] === activeElement.verdict ? '#10b981' : '#ef4444'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ fontWeight: 800, color: userVerdicts[activeElement.id] === activeElement.verdict ? '#10b981' : '#ef4444' }}>
                {userVerdicts[activeElement.id] === activeElement.verdict ? 'Verdict Confirmed!' : 'Audit Discrepancy!'}
              </div>
              <div style={{ color: 'var(--text-primary)' }}>
                <strong>Standard:</strong> {activeElement.matterhornCheckpoint}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                <strong>Remediation:</strong> {activeElement.remediation}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmitAudit}
            disabled={answeredCount < AUDIT_ELEMENTS.length}
            className="primary-btn"
            style={{
              padding: '0.65rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              opacity: answeredCount === AUDIT_ELEMENTS.length ? 1 : 0.5,
              cursor: answeredCount === AUDIT_ELEMENTS.length ? 'pointer' : 'not-allowed'
            }}
          >
            Verify Complete Audit Findings
          </button>
        ) : (
          <button
            type="button"
            onClick={handleResetAudit}
            className="secondary-btn"
            style={{
              padding: '0.65rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <RefreshCw size={16} />
            <span>Re-Audit Sample Document</span>
          </button>
        )}
      </div>
    </div>
  );
}
