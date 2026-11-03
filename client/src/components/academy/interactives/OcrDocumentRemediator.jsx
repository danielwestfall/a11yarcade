import React, { useState } from 'react';
import {
  FileText,
  Scan,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Check,
  Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

export default function OcrDocumentRemediator() {
  const [stage, setStage] = useState('raw-bitmap'); // 'raw-bitmap' | 'ocr-extracted' | 'remediated'
  const [fixedErrors, setFixedErrors] = useState({
    error1: false, // rn -> m
    error2: false, // 1/O -> l/0
    error3: false  // 1/O -> l/0 in income
  });
  const [hasLanguageTagged, setHasLanguageTagged] = useState(false);
  const [hasTagsStructure, setHasTagsStructure] = useState(false);

  const errorsCount = Object.values(fixedErrors).filter(Boolean).length;
  const isOcrClean = errorsCount === 3;
  const isFullyCompliant = stage === 'remediated' && isOcrClean && hasLanguageTagged && hasTagsStructure;

  const handleRunOcr = () => {
    soundManager.playClick();
    setStage('ocr-extracted');
  };

  const handleFixError = (key) => {
    soundManager.playClick();
    setFixedErrors(prev => {
      const updated = { ...prev, [key]: true };
      if (Object.values(updated).filter(Boolean).length === 3 && hasLanguageTagged && hasTagsStructure) {
        soundManager.playCorrect();
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      }
      return updated;
    });
  };

  const handleTagLanguage = () => {
    soundManager.playClick();
    setHasLanguageTagged(true);
    if (isOcrClean && hasTagsStructure) {
      soundManager.playCorrect();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
  };

  const handleTagStructure = () => {
    soundManager.playClick();
    setHasTagsStructure(true);
    if (isOcrClean && hasLanguageTagged) {
      soundManager.playCorrect();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
  };

  const handleCompleteAll = () => {
    soundManager.playClick();
    setStage('remediated');
    setFixedErrors({ error1: true, error2: true, error3: true });
    setHasLanguageTagged(true);
    setHasTagsStructure(true);
    soundManager.playCorrect();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    soundManager.playClick();
    setStage('raw-bitmap');
    setFixedErrors({ error1: false, error2: false, error3: false });
    setHasLanguageTagged(false);
    setHasTagsStructure(false);
  };

  // Compute PAC validation score
  let pacScore = 0;
  if (stage === 'raw-bitmap') pacScore = 0;
  else if (stage === 'ocr-extracted') {
    pacScore = 40 + (errorsCount * 10); // 40 to 70
  } else if (stage === 'remediated') {
    pacScore = 70 + (errorsCount * 5) + (hasLanguageTagged ? 10 : 0) + (hasTagsStructure ? 5 : 0);
  }
  if (isFullyCompliant) pacScore = 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro Box */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Scan size={18} color="var(--arcade-amber)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Scanned PDF Document OCR & Tag Layer Remediation Lab
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          Legacy paper forms scanned into PDF format exist solely as raster images. Screen readers cannot access any text,
          and automated validators fail with 0% compliance. Running OCR is only Step 1: accessibility specialists must also
          proofread OCR mistranscriptions (glyphs), define the document natural language, and build a semantic PDF/UA tag tree.
        </p>
      </div>

      {/* PAC Meter & Stage Banner */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Matterhorn Protocol & PAC (PDF Accessibility Checker) Automated Score
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: pacScore === 100 ? 'var(--arcade-green)' : pacScore >= 70 ? 'var(--arcade-cyan)' : '#ef4444' }}>
              {pacScore}% · {pacScore === 100 ? 'PDF/UA-1 (ISO 14289-1) VALIDATED ✓' : pacScore >= 50 ? 'PARTIAL OCR (ERRORS REMAINING)' : 'CRITICAL FAILURE (BITMAP IMAGE)'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleCompleteAll}
              className="secondary-btn"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Sparkles size={14} color="var(--arcade-gold)" />
              <span>Auto-Remediate</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="secondary-btn"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Meter Bar */}
        <div style={{ height: '8px', width: '100%', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${pacScore}%`,
              background: pacScore === 100 ? 'var(--arcade-green)' : pacScore >= 50 ? 'var(--arcade-cyan)' : '#ef4444',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* Main Document Inspection Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Left: Scanned Document Simulation */}
        <div style={{ background: '#fdfbf7', color: '#1f2937', borderRadius: '8px', border: '2px solid #d1d5db', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)', position: 'relative', fontFamily: 'serif' }}>
          {/* Watermark / Paper stamp */}
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', border: '2px solid #9ca3af', color: '#6b7280', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', textTransform: 'uppercase', transform: 'rotate(-5deg)', letterSpacing: '0.05em' }}>
            ARCHIVAL SCAN · 1998
          </div>

          <div style={{ borderBottom: '2px solid #1f2937', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#4b5563' }}>
              State Department of Social Health
            </div>
            <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.25rem', fontWeight: 900, color: '#111827' }}>
              {stage === 'raw-bitmap' ? (
                <span style={{ filter: 'blur(0.4px)' }}>Public Health Assistance Application</span>
              ) : hasTagsStructure ? (
                <span>&lt;H1&gt; Public Health Assistance Application &lt;/H1&gt;</span>
              ) : (
                <span>Public Health Assistance Application</span>
              )}
            </h3>
          </div>

          {/* Document Content / Optical Simulation */}
          {stage === 'raw-bitmap' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.85, filter: 'contrast(120%) brightness(95%)' }}>
              <div style={{ background: '#f3f4f6', border: '1px dashed #9ca3af', padding: '2rem 1rem', textAlign: 'center', borderRadius: '4px' }}>
                <Scan size={36} color="#6b7280" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#374151' }}>
                  Flat Scanned TIFF/JPEG Image
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  0 selectable text characters. Screen reader recognizes only "Graphic".
                </div>
                <button
                  type="button"
                  onClick={handleRunOcr}
                  className="primary-btn"
                  style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Scan size={16} />
                  <span>Execute Optical Character Recognition (OCR)</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {/* Field 1: Payment Section */}
              <div style={{ padding: '0.5rem', borderRadius: '4px', background: fixedErrors.error1 ? '#ecfdf5' : '#fef2f2', border: `1px solid ${fixedErrors.error1 ? '#10b981' : '#f87171'}` }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' }}>Section 1: Filing Type</span>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    {fixedErrors.error1 ? 'Payment Receipt & Voucher' : 'Payrn-ent Receipt & Voucher'}
                  </span>
                  {!fixedErrors.error1 && (
                    <button
                      type="button"
                      onClick={() => handleFixError('error1')}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 800 }}
                    >
                      Fix Glyph: "rn" ➔ "m"
                    </button>
                  )}
                </div>
              </div>

              {/* Field 2: Application Date */}
              <div style={{ padding: '0.5rem', borderRadius: '4px', background: fixedErrors.error2 ? '#ecfdf5' : '#fef2f2', border: `1px solid ${fixedErrors.error2 ? '#10b981' : '#f87171'}` }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' }}>Section 2: Submission</span>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    {fixedErrors.error2 ? 'Application Date: 10/15/1998' : 'App1ication Date: 1O/15/1998'}
                  </span>
                  {!fixedErrors.error2 && (
                    <button
                      type="button"
                      onClick={() => handleFixError('error2')}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 800 }}
                    >
                      Fix Glyphs: "1" ➔ "l" & "O" ➔ "0"
                    </button>
                  )}
                </div>
              </div>

              {/* Field 3: Annual Income */}
              <div style={{ padding: '0.5rem', borderRadius: '4px', background: fixedErrors.error3 ? '#ecfdf5' : '#fef2f2', border: `1px solid ${fixedErrors.error3 ? '#10b981' : '#f87171'}` }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' }}>Section 3: Financials</span>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    {fixedErrors.error3 ? 'Annual Income: $45,000' : 'Annua1 lncome: $45,OOO'}
                  </span>
                  {!fixedErrors.error3 && (
                    <button
                      type="button"
                      onClick={() => handleFixError('error3')}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 800 }}
                    >
                      Fix Glyphs: "1" ➔ "l" & "OOO" ➔ "000"
                    </button>
                  )}
                </div>
              </div>

              {/* Remediation Step Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #d1d5db' }}>
                <button
                  type="button"
                  onClick={handleTagLanguage}
                  disabled={hasLanguageTagged}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: hasLanguageTagged ? '#10b981' : '#d1d5db',
                    background: hasLanguageTagged ? '#ecfdf5' : '#fff',
                    color: hasLanguageTagged ? '#065f46' : '#1f2937',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: hasLanguageTagged ? 'default' : 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Languages size={14} />
                    <span>Set Document Natural Language (xml:lang="en-US")</span>
                  </span>
                  {hasLanguageTagged && <Check size={14} color="#10b981" />}
                </button>

                <button
                  type="button"
                  onClick={handleTagStructure}
                  disabled={hasTagsStructure}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: hasTagsStructure ? '#10b981' : '#d1d5db',
                    background: hasTagsStructure ? '#ecfdf5' : '#fff',
                    color: hasTagsStructure ? '#065f46' : '#1f2937',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: hasTagsStructure ? 'default' : 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={14} />
                    <span>Apply Semantic Tag Tree (&lt;H1&gt;, &lt;H2&gt;, &lt;P&gt;)</span>
                  </span>
                  {hasTagsStructure && <Check size={14} color="#10b981" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Screen Reader & Matterhorn Protocol Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Virtual Screen Reader Announcer */}
          <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '6px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Volume2 size={16} color="var(--arcade-gold)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Screen Reader Speech Output (NVDA / JAWS)
              </span>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.08)', borderLeft: '3px solid var(--arcade-gold)', color: '#fef08a', fontSize: '0.8rem', fontFamily: 'monospace', lineHeight: 1.5 }}>
              {stage === 'raw-bitmap' ? (
                <span style={{ color: '#f87171' }}>
                  "Graphic: Scanned_Application_Page_001.tif. Blank text."
                </span>
              ) : isFullyCompliant ? (
                <span style={{ color: '#4ade80' }}>
                  "Heading Level 1: Public Health Assistance Application. Payment Receipt and Voucher. Application Date: October 15, 1998. Annual Income: $45,000."
                </span>
              ) : (
                <span style={{ color: '#fef08a' }}>
                  {!fixedErrors.error1 && '"Pay-urn-ent Receipt. '}
                  {!fixedErrors.error2 && 'App-one-ication Date: one-oh slash fifteen slash... '}
                  {!fixedErrors.error3 && 'Annua-one in-come: forty-five oh-oh-oh."'}
                </span>
              )}
            </div>
          </div>

          {/* IAAP ADS Exam Concepts Card */}
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={16} color="var(--arcade-green)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                IAAP ADS BoK 2.5: The 3 OCR Rules
              </span>
            </div>

            <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <li>
                <strong>1. OCR Alone is Not Accessible:</strong> Running OCR creates a "Searchable Image" text layer, but it does not tag headings, tables, or reading order.
              </li>
              <li>
                <strong>2. Proofreading Optical Artifacts:</strong> Look-alike glyphs (e.g., numeral <code>1</code> vs lowercase <code>l</code>, letter <code>O</code> vs numeral <code>0</code>, <code>rn</code> vs <code>m</code>) cause severe text-to-speech pronunciation defects.
              </li>
              <li>
                <strong>3. Language & Tag Tree:</strong> ISO 14289-1 requires document natural language specification and structured tags for all OCR text layers.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
