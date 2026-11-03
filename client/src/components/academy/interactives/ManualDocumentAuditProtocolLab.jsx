import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ZoomIn,
  Eye,
  Sliders,
  Maximize2,
  Table,
  Heading,
  ExternalLink,
  Contrast,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const AUDIT_STEPS = [
  {
    id: 'reflow',
    title: 'Acrobat Reflow Mode (Ctrl+4 / Cmd+4)',
    short: 'Reflow 400%',
    icon: ZoomIn,
    desc: 'Simulates Adobe Acrobat Reflow Mode. Magnifies content to 400% and reflows into a single column. Verifies reading order and guarantees no horizontal scrolling or overlapping text boxes.',
    matterhornCheckpoint: 'Matterhorn Protocol 13-001 (Reflow Reading Sequence)',
    testProtocol:
      'In Acrobat Pro, press Ctrl+4 (Windows) or Cmd+4 (Mac). Zoom to 400%. Ensure text flows naturally from column 1 into column 2 without clipping, truncation, or requiring bidirectional scrolling.'
  },
  {
    id: 'rotor',
    title: 'Screen Reader Quick Keys (H, T, L)',
    short: 'AT Rotor Keys',
    icon: Heading,
    desc: 'Simulates manual document navigation with screen reader shortcut keys: H for Headings, T for Tables, L for Links. Verifies true semantic hierarchy.',
    matterhornCheckpoint: 'Matterhorn Protocol 09-001 (Headings) & 15-001 (Data Tables)',
    testProtocol:
      'Listen to the rotor announcements. Check if heading levels follow sequential logical hierarchy without skipping levels (e.g. H1 to H4), and verify that data tables announce column headers before data cells.'
  },
  {
    id: 'initial-view',
    title: 'Document Properties Initial View (Ctrl+D)',
    short: 'Title Bar Display',
    icon: Sliders,
    desc: 'Verifies File -> Properties -> Initial View. Tests whether the window title bar displays the human-readable Document Title instead of the raw file name.',
    matterhornCheckpoint: 'Matterhorn Protocol 06-001 (Document Title in Title Bar)',
    testProtocol:
      'Open Document Properties (Ctrl+D). Under Initial View -> Window Options, inspect "Show". If set to "File Name", screen readers announce cryptic file names like "annual_report_v3_final.pdf" instead of the accessible title.'
  },
  {
    id: 'contrast-invert',
    title: 'High Contrast & Inverted Color Mode',
    short: 'High Contrast Mode',
    icon: Contrast,
    desc: 'Verifies document readability when users enable OS High Contrast or Acrobat Invert Colors (e.g. White text on Black background).',
    matterhornCheckpoint: 'Matterhorn Protocol 14-001 (Color Contrast & Visibility)',
    testProtocol:
      'Activate high contrast mode. Ensure that background images, vector shapes, or watermark artifacts do not invert into white solid blocks that obliterate foreground text.'
  }
];

const SCENARIOS = [
  {
    id: 'case-1',
    title: 'Multi-Column Reflow Reading Sequence Collapse',
    category: 'Reflow Mode (Ctrl+4)',
    scenario:
      'An annual report features a two-column layout with a sidebar callout box on the right. When opening Acrobat Reflow Mode (Ctrl+4), the screen reader reads the first line of column 1, then jumps horizontally to read the first line of the sidebar callout, then back to line 2 of column 1.',
    question: 'What is the underlying defect and how is it manually discovered and resolved?',
    options: [
      {
        id: 'A',
        text: 'The Tags Tree reading order does not match visual layout. The sidebar tags are intermingled with paragraph text. Automated PAC checks pass because all text is tagged, but manual Reflow mode reveals the broken reading sequence. Remediation: Reorder tags sequentially in the Tags tree or Content panel.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Reflow mode is deprecated and users should simply be instructed to read the document with a physical magnifying glass.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'The font size must be locked to 10pt with DRM protection to prevent reflowing.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Automated validators always catch this defect automatically, so manual testing is redundant.',
        isCorrect: false
      }
    ],
    explanation:
      'Automated checkers verify syntax (e.g., that text is tagged as <P>), but cannot determine whether the reading order makes logical sense. Testing in Reflow Mode (Ctrl+4) forces Acrobat to linearize content according to the tag tree order, instantly exposing reading order sequence defects.'
  },
  {
    id: 'case-2',
    title: 'Screen Reader Quick Keys Heading Navigation Disconnect',
    category: 'Rotor Navigation (H, T, L)',
    scenario:
      'A technical manual visually presents Section 1, followed by Subsection 1.1, followed by a minor tip. When pressing "H" in NVDA, the screen reader announces "Section 1, Heading Level 1", then pressing "H" again announces "Tip, Heading Level 4", skipping Levels 2 and 3.',
    question: 'What is the manual audit finding under Matterhorn Protocol 09-001?',
    options: [
      {
        id: 'A',
        text: 'Failure: Heading levels do not reflect logical structure. The tip was tagged with <H4> merely to make the text smaller visually. Remediation: Re-tag Subsection as <H2> and tag the tip as a regular <P> or semantic blockquote.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Pass: Skipping heading levels is encouraged by PDF/UA to create whitespace in audio speech.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Warning: Screen readers should only use Arrow Down; using Quick Key "H" is not supported in PDF.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Pass: As long as the text is bolded, heading tags are ignored by assistive tech.',
        isCorrect: false
      }
    ],
    explanation:
      'Heading levels must represent a hierarchical outline of the document. Skipping levels (e.g. H1 to H4) confuses screen reader users building a mental model of document structure. Automated tools often do not flag skipped heading levels unless configured with custom rule thresholds, making manual rotor navigation essential.'
  },
  {
    id: 'case-3',
    title: 'Window Title Bar Display Setting in Document Properties',
    category: 'Initial View (Ctrl+D)',
    scenario:
      'A federal agency publishes a PDF named "OMB_DRAFT_CIRCULAR_A130_2024_REV4_FINAL.pdf". When opened in Acrobat or a web browser, the application window title bar displays that exact filename, even though Document Properties has Title set to "Managing Information as a Strategic Resource".',
    question: 'How do you fix this in Adobe Acrobat Pro Document Properties?',
    options: [
      {
        id: 'A',
        text: 'Press Ctrl+D -> Initial View tab -> Under "Window Options", change the "Show" dropdown from "File Name" to "Document Title", then save the PDF.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Rename the file in Windows File Explorer and re-upload it.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Set the PDF password protection to read-only.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Delete the document title so that Acrobat defaults to showing the author\'s email address.',
        isCorrect: false
      }
    ],
    explanation:
      'Under WCAG 2.4.2 (Page Titled) and Matterhorn Protocol 06-001 (ISO 14289-1), the document title must be displayed in the application window bar. Setting Document Title in metadata is insufficient on its own; the document\'s Initial View dictionary must explicitly specify /ViewerPreferences << /DisplayDocTitle true >>.'
  },
  {
    id: 'case-4',
    title: 'High Contrast Mode Whiteout & Opaque Artifacts',
    category: 'High Contrast & Inverted Color',
    scenario:
      'A PDF chart has black text overlaying a decorative gradient container box. When tested in Windows High Contrast White-on-Black mode, the gradient container turns into a solid white opaque rectangle that completely conceals the white text inside it.',
    question: 'What manual testing revelation and PDF remediation does this require?',
    options: [
      {
        id: 'A',
        text: 'The decorative background vector shape was not properly tagged as an /Artifact or has an opaque non-standard blending mode. In high contrast mode, it obscures foreground text. Remediation: Mark decorative background graphics as /Artifact and verify transparency/contrast across inverted themes.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Users who need high contrast mode are not supported in PDF/UA specifications.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Convert all text into a static JPEG image so it cannot invert.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Remove all charts and diagrams from all accessible publications.',
        isCorrect: false
      }
    ],
    explanation:
      'Manual testing in High Contrast / Inverted Colors ensures that low-vision users who invert palettes can read all content. Opaque vector fills or untagged decorative objects frequently render as blinding white blocks over white text unless properly artifacted or configured with transparent backgrounds.'
  }
];

export default function ManualDocumentAuditProtocolLab() {
  const [activeStepId, setActiveStepId] = useState('reflow');
  const [isReflowZoomActive, setIsReflowZoomActive] = useState(false);
  const [isInvertedActive, setIsInvertedActive] = useState(false);
  const [showDocTitle, setShowDocTitle] = useState(false);
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [caseAnswers, setCaseAnswers] = useState({});
  const [score, setScore] = useState(0);

  const activeStep = AUDIT_STEPS.find(s => s.id === activeStepId) || AUDIT_STEPS[0];
  const currentCase = SCENARIOS[activeCaseIdx];
  const selectedOption = caseAnswers[currentCase.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && currentCase.options.find(o => o.id === selectedOption)?.isCorrect;

  const handleSelectOption = (optId) => {
    if (isAnswered) return;
    const opt = currentCase.options.find(o => o.id === optId);
    const newAnswers = { ...caseAnswers, [currentCase.id]: optId };
    setCaseAnswers(newAnswers);

    if (opt?.isCorrect) {
      soundManager.playCorrect();
      const newScore = score + 25;
      setScore(newScore);
      if (Object.keys(newAnswers).length === SCENARIOS.length) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      soundManager.playIncorrect();
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setCaseAnswers({});
    setScore(0);
    setActiveCaseIdx(0);
    setIsReflowZoomActive(false);
    setIsInvertedActive(false);
    setShowDocTitle(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12), rgba(59, 130, 246, 0.08))',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(234, 88, 12, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(234, 88, 12, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ea580c'
            }}
          >
            <FileSearch size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Manual Document Accessibility & Reflow Protocol Lab
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Master the 4 essential manual testing techniques: Acrobat Reflow (Ctrl+4), Rotor Keys, Initial View, and High Contrast
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Audit Protocol Mastery
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: score === 100 ? 'var(--arcade-green)' : 'var(--arcade-yellow)' }}>
              {score}% ({Object.keys(caseAnswers).length}/{SCENARIOS.length} Audited)
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="secondary-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
            title="Reset lab"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Protocol Navigation Tabs */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Select Manual Testing Phase:
        </div>
        <div
          role="tablist"
          aria-label="Manual Audit Phases"
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
        >
          {AUDIT_STEPS.map((s) => {
            const isSelected = s.id === activeStepId;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  soundManager.playClick();
                  setActiveStepId(s.id);
                }}
                className={`tab-btn ${isSelected ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: '6px',
                  background: isSelected ? 'var(--card-bg)' : 'transparent',
                  border: isSelected ? '1px solid #ea580c' : '1px solid var(--border-color)',
                  color: isSelected ? '#ea580c' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} />
                <span>{s.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Protocol Guide Card */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeStep.title}
            </span>
            <span
              style={{
                background: 'rgba(234, 88, 12, 0.15)',
                color: '#ea580c',
                fontSize: '0.7rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 600
              }}
            >
              {activeStep.matterhornCheckpoint}
            </span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', borderLeft: '4px solid #ea580c', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          {activeStep.desc}
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Audit Procedure:</strong> {activeStep.testProtocol}
        </div>
      </div>

      {/* Interactive PDF Document Simulator Workbench */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Interactive Document Inspection Workbench
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Simulated Adobe Acrobat Document Viewer
            </h4>
          </div>

          {/* Interactive Inspection Controls */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsReflowZoomActive(prev => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                borderRadius: '4px',
                background: isReflowZoomActive ? '#ea580c' : 'var(--bg-secondary)',
                color: isReflowZoomActive ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <ZoomIn size={13} /> Reflow Zoom (400%) {isReflowZoomActive ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setShowDocTitle(prev => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                borderRadius: '4px',
                background: showDocTitle ? 'var(--arcade-green)' : 'var(--bg-secondary)',
                color: showDocTitle ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <Sliders size={13} /> {showDocTitle ? 'Show: Document Title' : 'Show: File Name'}
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsInvertedActive(prev => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                borderRadius: '4px',
                background: isInvertedActive ? '#3b82f6' : 'var(--bg-secondary)',
                color: isInvertedActive ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <Contrast size={13} /> High Contrast {isInvertedActive ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Acrobat Window Simulation */}
        <div
          style={{
            border: '2px solid var(--border-color)',
            borderRadius: '6px',
            overflow: 'hidden',
            background: isInvertedActive ? '#000000' : '#ffffff',
            color: isInvertedActive ? '#ffffff' : '#1e293b'
          }}
        >
          {/* Title Bar */}
          <div
            style={{
              background: isInvertedActive ? '#111827' : '#e2e8f0',
              padding: '0.4rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              borderBottom: '1px solid var(--border-color)',
              color: isInvertedActive ? '#ffffff' : '#334155',
              fontWeight: 600
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#ea580c', fontWeight: 800 }}>PDF</span>
              <span>
                {showDocTitle
                  ? 'Q4 2024 Global Digital Accessibility Audit & Conformance Report — Adobe Acrobat Pro'
                  : 'DOC_AUDIT_FINAL_v4_draft_2024.pdf — Adobe Acrobat Pro'}
              </span>
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                padding: '0.1rem 0.4rem',
                borderRadius: '3px',
                background: showDocTitle ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: showDocTitle ? 'var(--arcade-green)' : '#ef4444'
              }}
            >
              {showDocTitle ? '✓ WCAG 2.4.2 Conforming' : '✗ File Name Displayed'}
            </span>
          </div>

          {/* Document Content View */}
          <div
            style={{
              padding: isReflowZoomActive ? '1.5rem' : '1.25rem',
              fontSize: isReflowZoomActive ? '1.15rem' : '0.85rem',
              lineHeight: 1.5,
              display: isReflowZoomActive ? 'block' : 'grid',
              gridTemplateColumns: isReflowZoomActive ? '1fr' : '2fr 1fr',
              gap: '1.25rem'
            }}
          >
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: isReflowZoomActive ? '1.5rem' : '1.2rem', fontWeight: 800, color: isInvertedActive ? '#38bdf8' : '#0f172a' }}>
                Executive Accessibility Summary
              </h1>
              <p style={{ margin: '0 0 0.75rem 0' }}>
                This quarterly audit confirms compliance across 48 digital properties. Automated checkers detected 62% of surface errors, while manual testing caught critical reflow reading order failures.
              </p>
              <h2 style={{ margin: '0.75rem 0 0.35rem 0', fontSize: isReflowZoomActive ? '1.25rem' : '1rem', fontWeight: 700, color: isInvertedActive ? '#facc15' : '#1e3a8a' }}>
                Section 1.2: Conformance Findings
              </h2>
              <p style={{ margin: 0 }}>
                Screen reader users utilizing NVDA and JAWS confirmed that multi-column articles reflow cleanly into single-column responsive feeds when zoomed to 400% without horizontal panning.
              </p>
            </div>

            {/* Sidebar Column */}
            <div
              style={{
                background: isInvertedActive ? '#1e293b' : '#f8fafc',
                padding: '0.85rem',
                borderRadius: '6px',
                border: isInvertedActive ? '1px solid #334155' : '1px solid #cbd5e1',
                marginTop: isReflowZoomActive ? '1rem' : 0
              }}
            >
              <div style={{ fontWeight: 700, fontSize: isReflowZoomActive ? '1.05rem' : '0.85rem', color: isInvertedActive ? '#38bdf8' : '#0f172a', marginBottom: '0.35rem' }}>
                📌 Key Metric Callout
              </div>
              <p style={{ margin: 0, fontSize: isReflowZoomActive ? '0.95rem' : '0.78rem' }}>
                100% of tested tables now feature properly declared <code>&lt;TH id&gt;</code> and <code>&lt;TD headers&gt;</code> relationships.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Audit Scenarios Bench */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Manual Audit Case Examiner
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Case {activeCaseIdx + 1} of {SCENARIOS.length}: {currentCase.title}
            </h4>
          </div>

          <span
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'rgba(234, 88, 12, 0.15)',
              color: '#ea580c'
            }}
          >
            {currentCase.category}
          </span>
        </div>

        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ marginBottom: '0.65rem' }}>
            <strong>Inspection Scenario:</strong> {currentCase.scenario}
          </div>
          <div style={{ fontWeight: 700, color: '#ea580c' }}>
            {currentCase.question}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {currentCase.options.map((opt) => {
            const isChosen = selectedOption === opt.id;
            let optBorder = 'var(--border-color)';
            let optBg = 'var(--bg-secondary)';

            if (isAnswered) {
              if (opt.isCorrect) {
                optBorder = 'var(--arcade-green)';
                optBg = 'rgba(16, 185, 129, 0.12)';
              } else if (isChosen && !opt.isCorrect) {
                optBorder = '#ef4444';
                optBg = 'rgba(239, 68, 68, 0.12)';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswered}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  background: optBg,
                  border: `1px solid ${optBorder}`,
                  textAlign: 'left',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    background: isAnswered && opt.isCorrect ? 'var(--arcade-green)' : isAnswered && isChosen ? '#ef4444' : 'rgba(255,255,255,0.1)',
                    color: isAnswered && (opt.isCorrect || isChosen) ? '#ffffff' : 'var(--text-primary)'
                  }}
                >
                  {opt.id}
                </div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--text-primary)' }}>
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Rationale */}
        {isAnswered && (
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '6px',
              background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${isCorrect ? 'var(--arcade-green)' : '#ef4444'}`,
              fontSize: '0.85rem',
              lineHeight: 1.5,
              color: 'var(--text-primary)'
            }}
          >
            <strong>{isCorrect ? '✓ Correct Auditor Finding:' : '✗ Incorrect Audit Finding:'}</strong> {currentCase.explanation}
          </div>
        )}

        {/* Stepper Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <button
            type="button"
            disabled={activeCaseIdx === 0}
            onClick={() => {
              soundManager.playClick();
              setActiveCaseIdx(prev => prev - 1);
            }}
            className="secondary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            ← Previous Case
          </button>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Case {activeCaseIdx + 1} of {SCENARIOS.length}
          </span>

          <button
            type="button"
            disabled={activeCaseIdx === SCENARIOS.length - 1}
            onClick={() => {
              soundManager.playClick();
              setActiveCaseIdx(prev => prev + 1);
            }}
            className="primary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            Next Case →
          </button>
        </div>
      </div>
    </div>
  );
}
