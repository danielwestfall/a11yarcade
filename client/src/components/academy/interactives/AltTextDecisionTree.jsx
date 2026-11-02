import React, { useState } from 'react';
import { Image, CheckCircle2, HelpCircle, ArrowRight, RefreshCw, FileText, Sparkles } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const EXHIBITS = [
  {
    id: 'ex-decorative',
    title: 'Exhibit A: Abstract Geometric Wave Banner',
    context: 'A decorative blue background pattern spanning the top of an HR newsletter.',
    svgType: 'wave',
    isDecorative: true,
    isFunctional: false,
    hasText: false,
    isComplex: false,
    bestAlt: 'alt="" (or mark as /Artifact in PDF)',
    codeSnippet: `<img src="waves.png" alt="" role="presentation">\n/* In PDF/UA: Tag as /Artifact */`,
    explanation: 'Purely decorative visual elements must have empty alt="" (HTML) or be tagged as an Artifact in PDF/UA so screen readers ignore them completely.'
  },
  {
    id: 'ex-functional',
    title: 'Exhibit B: Magnifying Glass Icon Button',
    context: 'A clickable button in a document toolbar that opens the search panel. No visible text label.',
    svgType: 'search',
    isDecorative: false,
    isFunctional: true,
    hasText: false,
    isComplex: false,
    bestAlt: 'alt="Search document"',
    codeSnippet: `<button type="button">\n  <img src="search.svg" alt="Search document">\n</button>`,
    explanation: 'Functional images must describe the action or destination of the control (e.g. "Search document"), NEVER the visual appearance ("Magnifying glass").'
  },
  {
    id: 'ex-informative',
    title: 'Exhibit C: Conference Keynote Speaker Photo',
    context: 'An article profiling Dr. Evelyn Vance speaking at the 2026 Accessibility Summit.',
    svgType: 'speaker',
    isDecorative: false,
    isFunctional: false,
    hasText: false,
    isComplex: false,
    bestAlt: 'alt="Dr. Evelyn Vance delivering the keynote address at the 2026 Accessibility Summit"',
    codeSnippet: `<img src="keynote.jpg"\n     alt="Dr. Evelyn Vance delivering the keynote address at the 2026 Accessibility Summit">`,
    explanation: 'Informative photos must convey the core meaning, subject, and context concisely. Avoid saying "Image of..." or "Picture showing...".'
  },
  {
    id: 'ex-chart',
    title: 'Exhibit D: Quarterly Remediation Bar Chart',
    context: 'A multi-series chart depicting accessibility defects fixed across Q1-Q4 by department.',
    svgType: 'chart',
    isDecorative: false,
    isFunctional: false,
    hasText: true,
    isComplex: true,
    bestAlt: 'Brief summary in alt + full data table in body text',
    codeSnippet: `<figure>\n  <img src="chart.png" alt="Bar chart showing total accessibility defects dropped 65% from Q1 to Q4">\n  <figcaption>\n    <table>...Full data table with all metrics...</table>\n  </figcaption>\n</figure>`,
    explanation: 'Complex graphics require a two-part approach: a high-level summary in the alt attribute, and a complete text equivalent (like a data table) in the document body.'
  }
];

export default function AltTextDecisionTree() {
  const [selectedExhibitIdx, setSelectedExhibitIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [userDecisions, setUserDecisions] = useState({});
  const [completed, setCompleted] = useState(false);

  const exhibit = EXHIBITS[selectedExhibitIdx];

  const handleSelectExhibit = (idx) => {
    soundManager.playClick();
    setSelectedExhibitIdx(idx);
    setCurrentStep(1);
    setUserDecisions({});
    setCompleted(false);
  };

  const handleAnswerStep = (stepNumber, answerBoolean) => {
    soundManager.playClick();
    const updated = { ...userDecisions, [stepNumber]: answerBoolean };
    setUserDecisions(updated);

    if (stepNumber === 1 && answerBoolean === true) {
      // It is purely decorative! We are done.
      setCompleted(true);
      soundManager.playCorrect();
    } else if (stepNumber === 1 && answerBoolean === false) {
      // Meaningful, advance to step 2 (functional?)
      setCurrentStep(2);
    } else if (stepNumber === 2 && answerBoolean === true) {
      // It is functional! Done.
      setCompleted(true);
      soundManager.playCorrect();
    } else if (stepNumber === 2 && answerBoolean === false) {
      // Not functional, advance to step 3 (complex?)
      setCurrentStep(3);
    } else if (stepNumber === 3) {
      setCompleted(true);
      soundManager.playCorrect();
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setCurrentStep(1);
    setUserDecisions({});
    setCompleted(false);
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Image size={22} color="var(--arcade-amber)" />
            <span>Interactive Alt-Text Decision Tree</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Step through the official W3C / IAAP Alt Text Flowchart to determine the exact remediation strategy for electronic documents.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="secondary-btn"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <RefreshCw size={14} />
          <span>Restart Tree</span>
        </button>
      </div>

      {/* Exhibit Selector Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {EXHIBITS.map((ex, idx) => {
          const isActive = selectedExhibitIdx === idx;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => handleSelectExhibit(idx)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: isActive ? '2px solid var(--arcade-amber)' : '1px solid var(--border-color)',
                background: isActive ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface-elevated)',
                color: isActive ? 'var(--arcade-amber)' : 'var(--text-secondary)'
              }}
            >
              <span>{ex.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Exhibit Visual Canvas */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-amber)', textTransform: 'uppercase' }}>
              Target Document Asset
            </span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0 0 0' }}>
              {exhibit.title}
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {exhibit.context}
            </p>
          </div>

          {/* Rendered Mock Graphic */}
          <div style={{ minHeight: '160px', background: '#05070e', border: '1px dashed var(--border-color)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative' }}>
            {exhibit.svgType === 'wave' && (
              <svg width="240" height="70" viewBox="0 0 240 70" fill="none">
                <path d="M0 35 Q 60 5, 120 35 T 240 35 L 240 70 L 0 70 Z" fill="rgba(56, 189, 248, 0.3)" />
                <path d="M0 45 Q 60 20, 120 45 T 240 45 L 240 70 L 0 70 Z" fill="rgba(192, 132, 252, 0.4)" />
              </svg>
            )}

            {exhibit.svgType === 'search' && (
              <button
                type="button"
                style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--arcade-cyan)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                aria-label="Search"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16" y1="16" x2="21" y2="21" />
                </svg>
              </button>
            )}

            {exhibit.svgType === 'speaker' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-surface-elevated)', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '2rem' }}>🎤</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Dr. Evelyn Vance</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Keynote Speaker · A11y Summit</div>
                </div>
              </div>
            )}

            {exhibit.svgType === 'chart' && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '90px' }}>
                <div style={{ width: '28px', height: '80px', background: 'var(--arcade-crimson)', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', fontSize: '0.7rem', color: '#fff' }}>Q1</div>
                <div style={{ width: '28px', height: '55px', background: 'var(--arcade-amber)', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', fontSize: '0.7rem', color: '#000' }}>Q2</div>
                <div style={{ width: '28px', height: '35px', background: 'var(--arcade-cyan)', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', fontSize: '0.7rem', color: '#000' }}>Q3</div>
                <div style={{ width: '28px', height: '18px', background: 'var(--arcade-green)', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', fontSize: '0.7rem', color: '#fff' }}>Q4</div>
              </div>
            )}
          </div>
        </div>

        {/* Decision Flow Pathway */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-cyan)', textTransform: 'uppercase' }}>
            Flowchart Decision Steps
          </span>

          {/* Question 1 */}
          <div style={{ padding: '0.75rem', borderRadius: '6px', background: currentStep === 1 ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-surface-elevated)', border: currentStep === 1 ? '1px solid var(--arcade-cyan)' : '1px solid var(--border-color)', opacity: currentStep < 1 ? 0.4 : 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              1. Is this image purely decorative (no informative or functional purpose)?
            </div>
            {currentStep === 1 && !completed && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => handleAnswerStep(1, true)}
                  className="primary-btn"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                >
                  Yes, Purely Decorative
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerStep(1, false)}
                  className="secondary-btn"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                >
                  No, Meaningful / Functional
                </button>
              </div>
            )}
            {userDecisions[1] !== undefined && (
              <div style={{ fontSize: '0.75rem', color: 'var(--arcade-cyan)', marginTop: '0.3rem', fontWeight: 700 }}>
                Answer: {userDecisions[1] ? 'Purely Decorative' : 'Meaningful / Functional'}
              </div>
            )}
          </div>

          {/* Question 2 */}
          {userDecisions[1] === false && (
            <div style={{ padding: '0.75rem', borderRadius: '6px', background: currentStep === 2 ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-surface-elevated)', border: currentStep === 2 ? '1px solid var(--arcade-cyan)' : '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                2. Does the image trigger an action, submit a form, or serve as a link?
              </div>
              {currentStep === 2 && !completed && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => handleAnswerStep(2, true)}
                    className="primary-btn"
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    Yes, It is Functional
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswerStep(2, false)}
                    className="secondary-btn"
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    No, Informative Only
                  </button>
                </div>
              )}
              {userDecisions[2] !== undefined && (
                <div style={{ fontSize: '0.75rem', color: 'var(--arcade-cyan)', marginTop: '0.3rem', fontWeight: 700 }}>
                  Answer: {userDecisions[2] ? 'Functional Control' : 'Informative Content'}
                </div>
              )}
            </div>
          )}

          {/* Question 3 */}
          {userDecisions[2] === false && (
            <div style={{ padding: '0.75rem', borderRadius: '6px', background: currentStep === 3 ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-surface-elevated)', border: currentStep === 3 ? '1px solid var(--arcade-cyan)' : '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                3. Is the graphic complex (charts, detailed diagrams, infographics)?
              </div>
              {currentStep === 3 && !completed && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => handleAnswerStep(3, true)}
                    className="primary-btn"
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    Yes, Complex Graphic
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswerStep(3, false)}
                    className="secondary-btn"
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    No, Simple Informative Photo
                  </button>
                </div>
              )}
              {userDecisions[3] !== undefined && (
                <div style={{ fontSize: '0.75rem', color: 'var(--arcade-cyan)', marginTop: '0.3rem', fontWeight: 700 }}>
                  Answer: {userDecisions[3] ? 'Complex Chart' : 'Simple Informative'}
                </div>
              )}
            </div>
          )}

          {/* Final Remediation Result Box */}
          {completed && (
            <div style={{ padding: '1rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', display: 'flex', flexDirection: 'column', gap: '0.6rem', animation: 'fadeIn 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.9rem' }}>
                  Remediation Decision Complete!
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Recommended Specification: <span style={{ color: 'var(--arcade-amber)' }}>{exhibit.bestAlt}</span>
              </div>

              <pre style={{ margin: 0, padding: '0.6rem', background: '#090d16', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#f8fafc', overflowX: 'auto' }}>
                <code>{exhibit.codeSnippet}</code>
              </pre>

              <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.4, color: 'var(--text-secondary)' }}>
                {exhibit.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
