import React, { useState } from 'react';
import {
  FileText,
  Layers,
  ArrowRight,
  Anchor,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Tag,
  Columns,
  Sliders,
  AlignLeft,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const ARCHITECTURE_MODES = [
  {
    id: 'story-threading',
    title: 'Threaded Story Frames vs Floating Boxes',
    short: 'Story Threading',
    icon: Columns,
    desc: 'Demonstrates how unthreaded text frames export in random Z-order, whereas threading text frames links them into a continuous semantic story flow.',
    rule: 'Matterhorn Protocol 13-001 & InDesign Text Flow',
    proTip: 'Always link multi-column or multi-page editorial frames by clicking the text frame out-port and in-port before exporting to PDF.'
  },
  {
    id: 'articles-panel',
    title: 'InDesign Articles Panel & Tagging Sequence',
    short: 'Articles Panel',
    icon: Layers,
    desc: 'The Articles Panel allows layout designers to drag stories and images into an explicit reading sequence with "Use for Tagging Order" enabled.',
    rule: 'ISO 14289-1 PDF/UA Tagging Order',
    proTip: 'By default, InDesign exports tags based on visual layer stacking order. Checking "Use for Tagging Order" overrides layer chaos with structured intent.'
  },
  {
    id: 'export-tagging',
    title: 'Paragraph Style Export Tagging Rules',
    short: 'Export Tagging',
    icon: Tag,
    desc: 'Maps visual Paragraph Styles (e.g. Chapter_Title, Subheader_24pt) directly to semantic PDF tags (<H1>, <H2>, <P>, <Blockquote>).',
    rule: 'WCAG 1.3.1 (Info and Relationships) & PDF/UA',
    proTip: 'Set Export Tagging in the Paragraph Style Options dialog once; every instance of that style throughout a 200-page book will auto-tag properly.'
  },
  {
    id: 'anchored-objects',
    title: 'Anchored Objects vs Floating Pasteboard Graphics',
    short: 'Anchored Objects',
    icon: Anchor,
    desc: 'Floating figures on the canvas export at the end of the page or in disconnected tags. Anchoring figures inline ensures screen readers read them in context.',
    rule: 'Matterhorn Protocol 01-001 (Artifact vs Content)',
    proTip: 'Drag the blue anchor widget from the top-right of the image frame directly into the text frame at the exact sentence where it is referenced.'
  }
];

const SCENARIOS = [
  {
    id: 'case-1',
    title: 'InDesign Articles Panel "Use for Tagging Order" Checkbox',
    category: 'Articles Panel (InDesign)',
    scenario:
      'A graphic designer meticulously builds a 30-page magazine in Adobe InDesign. She drags every article, callout, and chart into the Articles panel in perfect logical reading order. However, upon exporting to Interactive or Print PDF and checking in Acrobat, the tags are still jumbled according to the visual Layers panel.',
    question: 'What critical option was omitted in the InDesign Articles panel menu?',
    options: [
      {
        id: 'A',
        text: 'The designer forgot to open the Articles Panel flyout menu and check "Use for Tagging Order in Tagged PDF". Without this toggle, InDesign completely ignores the Articles panel and defaults to visual layer order.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'InDesign only supports tagging if the document is saved as a Microsoft Word DOCX file first.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'The designer must export as a series of 30 single-page JPEG images.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'The Articles panel only works on computers running Linux.',
        isCorrect: false
      }
    ],
    explanation:
      'Populating the Articles panel in Adobe InDesign does not affect PDF tagging unless the panel option "Use for Tagging Order in Tagged PDF" is explicitly checked. This is the #1 reason why InDesign PDFs export with scrambled reading sequences.'
  },
  {
    id: 'case-2',
    title: 'Unthreaded Multi-Column Text Frame Export Disconnect',
    category: 'Text Frame Threading',
    scenario:
      'An editorial layout features a 3-column article. The designer created three separate, independent text boxes on the page and manually pasted one paragraph into Column 1, the next into Column 2, and the third into Column 3 without linking them with InDesign\'s text threads.',
    question: 'How will Adobe Acrobat and screen readers interpret this unthreaded layout upon PDF export?',
    options: [
      {
        id: 'A',
        text: 'The PDF will create three separate unlinked <Story> or <Part> tag structures in the order the boxes were drawn or arranged on the visual layer, breaking sentence continuity when text flows across column breaks.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Acrobat uses artificial intelligence to automatically re-stitch all unthreaded text into a single paragraph without error.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Unthreaded boxes are automatically deleted by the PDF distiller.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Screen readers automatically refuse to read unthreaded pages and shut down.',
        isCorrect: false
      }
    ],
    explanation:
      'When text frames are not threaded, authoring tools treat each box as an isolated content container. Content that wraps or breaks across columns gets split into distinct semantic fragments, scrambling reading order during reflow (<Ctrl+4>) or screen reader recitation.'
  },
  {
    id: 'case-3',
    title: 'Paragraph Style Export Tagging vs Automatic Defaults',
    category: 'Export Tagging Rules',
    scenario:
      'A corporate white paper has 12 chapters with headings styled as "Hero_Heading_32pt". By default, InDesign\'s Export Tagging is set to "[Automatic]". When exported to Tagged PDF, PAC 2024 flags heading structure errors because all headings were tagged as <P> instead of <H1>.',
    question: 'How should the author configure Paragraph Style Export Tagging in InDesign or Word?',
    options: [
      {
        id: 'A',
        text: 'Edit the Paragraph Style -> Export Tagging -> Under PDF, change "Tag:" from "[Automatic]" to "H1". In Word, ensure the visual text uses the built-in "Heading 1" style rather than merely bolding Normal text.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Manually retag every single heading inside Adobe Acrobat Pro after every single PDF re-export.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Delete the heading and paste it as a bitmap PNG graphic with alt text.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Set all text in the document to Comic Sans font.',
        isCorrect: false
      }
    ],
    explanation:
      'Relying on "[Automatic]" export tagging in InDesign frequently results in custom heading styles falling back to generic <P> tags. Explicitly mapping paragraph styles to semantic PDF tags (<H1> through <H6>) in the authoring environment guarantees permanent, correct tag generation on every subsequent export.'
  },
  {
    id: 'case-4',
    title: 'Floating Figure Pasteboard Placement & Reading Continuity',
    category: 'Anchored Objects',
    scenario:
      'A technical research document features a chart illustrating Section 2. The author dragged the chart frame onto the margin of Page 4 as a floating unanchored object. When a blind researcher reads the document with JAWS, the chart is announced at the very end of Page 4, after the footnotes.',
    question: 'Why did the chart export out of logical reading sequence, and how is it remediated in the source document?',
    options: [
      {
        id: 'A',
        text: 'Floating unanchored objects are placed at the end of the page\'s content stream. Remediation: Anchor the chart inline directly following the sentence referencing it (e.g. by dragging the anchor icon in InDesign, or setting text wrapping to "Inline with Text" in Word).',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Charts are prohibited in accessible documents under Section 508.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'The screen reader volume was too low to detect images at the top of the page.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'The chart must be printed on embossed cardboard and mailed to the user.',
        isCorrect: false
      }
    ],
    explanation:
      'In both InDesign and Word, floating graphics that are not anchored inline into the text story flow export to PDF outside the narrative sequence (often at the end of the page). Anchoring figures inline guarantees that assistive technologies encounter the graphic and its alt text in proper reading context.'
  }
];

export default function ExportArchitectureLab() {
  const [activeModeId, setActiveModeId] = useState('story-threading');
  const [isThreaded, setIsThreaded] = useState(false);
  const [useArticlesTagging, setUseArticlesTagging] = useState(false);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const activeMode = ARCHITECTURE_MODES.find(m => m.id === activeModeId) || ARCHITECTURE_MODES[0];
  const currentScenario = SCENARIOS[activeScenarioIdx];
  const selectedOption = userAnswers[currentScenario.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && currentScenario.options.find(o => o.id === selectedOption)?.isCorrect;

  const handleSelectOption = (optId) => {
    if (isAnswered) return;
    const opt = currentScenario.options.find(o => o.id === optId);
    const newAnswers = { ...userAnswers, [currentScenario.id]: optId };
    setUserAnswers(newAnswers);

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
    setUserAnswers({});
    setScore(0);
    setActiveScenarioIdx(0);
    setIsThreaded(false);
    setUseArticlesTagging(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(59, 130, 246, 0.08))',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
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
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--arcade-amber)'
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              InDesign & Word Authoring Layout Architecture Remediator
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Master Story Threading, InDesign Articles Panel order, Paragraph Style Export Tagging, and Anchored Figures
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Architecture Score
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: score === 100 ? 'var(--arcade-green)' : 'var(--arcade-yellow)' }}>
              {score}% ({Object.keys(userAnswers).length}/{SCENARIOS.length} Solved)
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

      {/* Mode Tabs */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Select Authoring Architecture Phase:
        </div>
        <div role="tablist" aria-label="Authoring Architecture Modes" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {ARCHITECTURE_MODES.map((mode) => {
            const isSelected = mode.id === activeModeId;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  soundManager.playClick();
                  setActiveModeId(mode.id);
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
                  border: isSelected ? '1px solid var(--arcade-amber)' : '1px solid var(--border-color)',
                  color: isSelected ? 'var(--arcade-amber)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} />
                <span>{mode.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Card */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {activeMode.title}
          </span>
          <span
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--arcade-amber)'
            }}
          >
            {activeMode.rule}
          </span>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', borderLeft: '4px solid var(--arcade-amber)', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          {activeMode.desc}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Authoring Best Practice:</strong> {activeMode.proTip}
        </div>
      </div>

      {/* Interactive Workbench Canvas */}
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
              Interactive Layout Workbench
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {activeModeId === 'story-threading' && 'Story Frame Threading Simulator'}
              {activeModeId === 'articles-panel' && 'InDesign Articles Panel Tagging Order'}
              {activeModeId === 'export-tagging' && 'Paragraph Style Export Tagging Matrix'}
              {activeModeId === 'anchored-objects' && 'Anchored Object Inline Placement'}
            </h4>
          </div>

          {activeModeId === 'story-threading' && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsThreaded(prev => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                borderRadius: '4px',
                background: isThreaded ? 'var(--arcade-green)' : 'var(--bg-secondary)',
                color: isThreaded ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <Columns size={14} />
              Story Threading: {isThreaded ? 'THREADED ✓' : 'UNTHREADED (Separate Frames)'}
            </button>
          )}

          {activeModeId === 'articles-panel' && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setUseArticlesTagging(prev => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                borderRadius: '4px',
                background: useArticlesTagging ? 'var(--arcade-green)' : 'var(--bg-secondary)',
                color: useArticlesTagging ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <Layers size={14} />
              "Use for Tagging Order": {useArticlesTagging ? 'CHECKED ✓' : 'UNCHECKED ✗'}
            </button>
          )}
        </div>

        {/* Workbench Visual Workspace */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1.25rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            minHeight: '180px',
            position: 'relative'
          }}
        >
          {/* Story Threading Simulation */}
          {activeModeId === 'story-threading' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'var(--card-bg)', padding: '0.85rem', borderRadius: '6px', border: isThreaded ? '2px solid var(--arcade-green)' : '1px solid var(--border-color)', position: 'relative' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '3px', background: isThreaded ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: isThreaded ? 'var(--arcade-green)' : '#ef4444', fontWeight: 700 }}>
                    {isThreaded ? 'Story Sequence: Step 1' : 'Frame 1 (Z-Order #3)'}
                  </span>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.82rem', lineHeight: 1.45 }}>
                    "The annual accessibility audit showed remarkable improvement across all major web applications..."
                  </p>
                </div>

                <div style={{ background: 'var(--card-bg)', padding: '0.85rem', borderRadius: '6px', border: isThreaded ? '2px solid var(--arcade-green)' : '1px solid var(--border-color)', position: 'relative' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '3px', background: isThreaded ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: isThreaded ? 'var(--arcade-green)' : '#ef4444', fontWeight: 700 }}>
                    {isThreaded ? 'Story Sequence: Step 2' : 'Frame 2 (Z-Order #1)'}
                  </span>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.82rem', lineHeight: 1.45 }}>
                    "...with over 88% of critical WCAG 2.1 AA barriers resolved prior to public release."
                  </p>
                </div>
              </div>

              <div style={{ padding: '0.75rem', borderRadius: '6px', background: isThreaded ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: `1px solid ${isThreaded ? 'var(--arcade-green)' : '#ef4444'}`, fontSize: '0.82rem', lineHeight: 1.45 }}>
                {isThreaded ? (
                  <span>✓ <strong>Threaded Flow:</strong> Screen readers and Acrobat Reflow mode read Frame 1 into Frame 2 continuously as a unified semantic paragraph without sentence fragmentation.</span>
                ) : (
                  <span>✗ <strong>Unthreaded Fragmentation:</strong> Screen readers read Frame 2 before Frame 1 because Frame 2 has a higher Z-index layer stack, rendering the sentence completely backwards!</span>
                )}
              </div>
            </div>
          )}

          {/* Articles Panel Simulation */}
          {activeModeId === 'articles-panel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>InDesign Articles Panel Order:</span>
                <span style={{ fontSize: '0.75rem', color: useArticlesTagging ? 'var(--arcade-green)' : '#ef4444', fontWeight: 700 }}>
                  {useArticlesTagging ? '✓ Tag Order Active' : '✗ Layer Stacking Order Active'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {['1. Document Title Header', '2. Executive Summary Article', '3. Key Findings Data Table', '4. Author Bio & Footnotes'].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.5rem 0.85rem',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{item}</span>
                    <span style={{ fontSize: '0.7rem', color: useArticlesTagging ? 'var(--arcade-green)' : 'var(--text-muted)' }}>
                      {useArticlesTagging ? `PDF Tag #${idx + 1}` : 'Ignored (Using Layer Stacking)'}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.8rem', color: useArticlesTagging ? 'var(--arcade-green)' : '#ef4444' }}>
                {useArticlesTagging
                  ? '✓ Correct: "Use for Tagging Order in Tagged PDF" instructs InDesign to export PDF tags in this exact list sequence!'
                  : '⚠️ Warning: Without the "Use for Tagging Order" checkbox, InDesign ignores this list and tags by visual layer stack!'}
              </div>
            </div>
          )}

          {/* Export Tagging Rules Table */}
          {activeModeId === 'export-tagging' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                InDesign Paragraph Style Options → Export Tagging Mapping Matrix:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.65rem' }}>
                {[
                  { style: 'Headline_Cover_48pt', tag: '<H1>', status: '✓ Proper semantic level' },
                  { style: 'Section_Subhead_24pt', tag: '<H2>', status: '✓ Preserves hierarchy' },
                  { style: 'Body_Copy_Editorial', tag: '<P>', status: '✓ Standard paragraph' },
                  { style: 'Callout_Sidebar_Quote', tag: '<Blockquote>', status: '✓ Semantic citation' }
                ].map((row, i) => (
                  <div key={i} style={{ background: 'var(--card-bg)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--arcade-amber)' }}>{row.style}</div>
                    <div style={{ margin: '0.2rem 0', color: 'var(--arcade-green)', fontWeight: 600 }}>Maps to: <code>{row.tag}</code></div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{row.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anchored Objects Flow */}
          {activeModeId === 'anchored-objects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Demonstrating inline anchoring of charts and figures:
              </div>
              <div style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                <p style={{ margin: 0 }}>
                  As demonstrated in the quarterly performance chart below, customer satisfaction increased by 24% after the release of the updated screen reader audio interface:
                </p>
                <div style={{ margin: '0.75rem 0', padding: '0.75rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.1)', border: '1px dashed var(--arcade-amber)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <Anchor size={16} color="var(--arcade-amber)" />
                  <div>
                    <strong>[Anchored Inline &lt;Figure&gt;]:</strong> <code>Q4_Satisfaction_Trends.png</code> with Alt: "Bar chart illustrating 24% satisfaction growth".
                  </div>
                </div>
                <p style={{ margin: 0 }}>
                  This increase reflects our concerted commitment to universal design across all customer touchpoints.
                </p>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--arcade-green)' }}>
                ✓ Result: Anchoring the graphic inline guarantees that assistive technologies read the image immediately after the sentence referencing it.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Case Solver Bench */}
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
              Layout Architecture Case Examiner
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Case {activeScenarioIdx + 1} of {SCENARIOS.length}: {currentScenario.title}
            </h4>
          </div>

          <span
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--arcade-amber)'
            }}
          >
            {currentScenario.category}
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
            <strong>Authoring Scenario:</strong> {currentScenario.scenario}
          </div>
          <div style={{ fontWeight: 700, color: 'var(--arcade-amber)' }}>
            {currentScenario.question}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {currentScenario.options.map((opt) => {
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
            <strong>{isCorrect ? '✓ Correct Architectural Fix:' : '✗ Incorrect Diagnosis:'}</strong> {currentScenario.explanation}
          </div>
        )}

        {/* Stepper Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <button
            type="button"
            disabled={activeScenarioIdx === 0}
            onClick={() => {
              soundManager.playClick();
              setActiveScenarioIdx(prev => prev - 1);
            }}
            className="secondary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            ← Previous Case
          </button>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Case {activeScenarioIdx + 1} of {SCENARIOS.length}
          </span>

          <button
            type="button"
            disabled={activeScenarioIdx === SCENARIOS.length - 1}
            onClick={() => {
              soundManager.playClick();
              setActiveScenarioIdx(prev => prev + 1);
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
