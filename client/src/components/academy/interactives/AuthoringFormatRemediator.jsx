import React, { useState } from 'react';
import {
  FileCode,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Type,
  Table,
  Image,
  Layers,
  ArrowRight,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

export default function AuthoringFormatRemediator() {
  const [headingFixed, setHeadingFixed] = useState(false);
  const [tableHeadersFixed, setTableHeadersFixed] = useState(false);
  const [indesignTagsFixed, setIndesignTagsFixed] = useState(false);
  const [altTextFixed, setAltTextFixed] = useState(false);

  const fixedCount = [headingFixed, tableHeadersFixed, indesignTagsFixed, altTextFixed].filter(Boolean).length;
  const isAllFixed = fixedCount === 4;

  // PAC automated score based on source authoring fixes
  const pacScore = 25 * fixedCount;

  const handleFixHeading = () => {
    soundManager.playClick();
    setHeadingFixed(true);
    checkCompletion(true, tableHeadersFixed, indesignTagsFixed, altTextFixed);
  };

  const handleFixTable = () => {
    soundManager.playClick();
    setTableHeadersFixed(true);
    checkCompletion(headingFixed, true, indesignTagsFixed, altTextFixed);
  };

  const handleFixIndesign = () => {
    soundManager.playClick();
    setIndesignTagsFixed(true);
    checkCompletion(headingFixed, tableHeadersFixed, true, altTextFixed);
  };

  const handleFixAlt = () => {
    soundManager.playClick();
    setAltTextFixed(true);
    checkCompletion(headingFixed, tableHeadersFixed, indesignTagsFixed, true);
  };

  const checkCompletion = (h, t, i, a) => {
    if (h && t && i && a) {
      soundManager.playCorrect();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleFixAll = () => {
    soundManager.playClick();
    setHeadingFixed(true);
    setTableHeadersFixed(true);
    setIndesignTagsFixed(true);
    setAltTextFixed(true);
    soundManager.playCorrect();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    soundManager.playClick();
    setHeadingFixed(false);
    setTableHeadersFixed(false);
    setIndesignTagsFixed(false);
    setAltTextFixed(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro Box */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <FileCode size={18} color="var(--arcade-amber)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Source Authoring Format Remediation Lab (Word & InDesign to PDF/UA)
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          IAAP ADS BoK Section 2.4 teaches that fixing accessibility downstream in Adobe Acrobat Pro is fragile:
          every time the author re-exports the document from Microsoft Word or Adobe InDesign, all downstream Acrobat fixes
          are completely wiped out. Fixing document structure directly in the source authoring software guarantees sustainable,
          100% accessible PDF re-exports.
        </p>
      </div>

      {/* Compliance Meter & Auto-Fix Banner */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Source-to-PDF Export Compliance & PAC Score
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isAllFixed ? 'var(--arcade-green)' : fixedCount >= 2 ? 'var(--arcade-cyan)' : '#ef4444' }}>
              {pacScore}% PAC Validation {isAllFixed && '— EXPORTS CLEAN PDF/UA-1 AUTOMATICALLY ✓'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleFixAll}
              className="secondary-btn"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Sparkles size={14} color="var(--arcade-gold)" />
              <span>Remediate All in Source</span>
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

        {/* Meter */}
        <div style={{ height: '8px', width: '100%', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${pacScore}%`,
              background: isAllFixed ? 'var(--arcade-green)' : fixedCount >= 2 ? 'var(--arcade-cyan)' : '#ef4444',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* 4 Source Authoring Fix Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Module 1: Word Heading Styles */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: `1px solid ${headingFixed ? 'var(--arcade-green)' : 'var(--border-color)'}`, borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Type size={16} color={headingFixed ? 'var(--arcade-green)' : 'var(--arcade-amber)'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              1. Word: True Heading Styles vs Bolding
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {headingFixed ? (
              <span style={{ color: 'var(--arcade-green)' }}>
                ✓ Applied native <code>Heading 1</code> style. PDF exports with semantic <code>&lt;H1&gt;</code> tag in logical tree.
              </span>
            ) : (
              <span>
                Defect: Document title is styled with <code>24pt Arial Bold</code>. In PDF, this exports as plain <code>&lt;P&gt;</code> body text.
              </span>
            )}
          </div>

          {!headingFixed && (
            <button
              type="button"
              onClick={handleFixHeading}
              className="primary-btn"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', alignSelf: 'flex-start' }}
            >
              Apply Word "Heading 1" Style
            </button>
          )}
        </div>

        {/* Module 2: Table Header Row Repeat */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: `1px solid ${tableHeadersFixed ? 'var(--arcade-green)' : 'var(--border-color)'}`, borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Table size={16} color={tableHeadersFixed ? 'var(--arcade-green)' : 'var(--arcade-cyan)'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              2. Word: Table Header Repeat
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {tableHeadersFixed ? (
              <span style={{ color: 'var(--arcade-green)' }}>
                ✓ Enabled "Repeat as header row at top of each page". Generates valid <code>&lt;TH scope="col"&gt;</code> tags across page splits.
              </span>
            ) : (
              <span>
                Defect: 3-page financial table repeats headers visually by manually pasting header text, breaking table linearity.
              </span>
            )}
          </div>

          {!tableHeadersFixed && (
            <button
              type="button"
              onClick={handleFixTable}
              className="primary-btn"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', alignSelf: 'flex-start' }}
            >
              Enable "Repeat as Header Row"
            </button>
          )}
        </div>

        {/* Module 3: InDesign Export Tagging */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: `1px solid ${indesignTagsFixed ? 'var(--arcade-green)' : 'var(--border-color)'}`, borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={16} color={indesignTagsFixed ? 'var(--arcade-green)' : 'var(--arcade-purple)'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              3. InDesign: Export Tagging Mapping
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {indesignTagsFixed ? (
              <span style={{ color: 'var(--arcade-green)' }}>
                ✓ Mapped paragraph style "Callout_Box" to PDF tag <code>&lt;Aside&gt;</code> and "Doc_Title" to <code>&lt;H1&gt;</code>.
              </span>
            ) : (
              <span>
                Defect: InDesign paragraph styles are set to <code>[Automatic]</code>, causing callouts to export as generic <code>&lt;Div&gt;</code>.
              </span>
            )}
          </div>

          {!indesignTagsFixed && (
            <button
              type="button"
              onClick={handleFixIndesign}
              className="primary-btn"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', alignSelf: 'flex-start' }}
            >
              Configure InDesign Export Tagging
            </button>
          )}
        </div>

        {/* Module 4: Embedded Alt Text in Source */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: `1px solid ${altTextFixed ? 'var(--arcade-green)' : 'var(--border-color)'}`, borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Image size={16} color={altTextFixed ? 'var(--arcade-green)' : 'var(--arcade-gold)'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              4. Source Image Alt Text (Word/InDesign)
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {altTextFixed ? (
              <span style={{ color: 'var(--arcade-green)' }}>
                ✓ Embedded alt text directly into image metadata. Retained across 100% of future PDF re-exports.
              </span>
            ) : (
              <span>
                Defect: Alt text was added only downstream in Acrobat Pro; re-exporting the document wipes it out completely.
              </span>
            )}
          </div>

          {!altTextFixed && (
            <button
              type="button"
              onClick={handleFixAlt}
              className="primary-btn"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', alignSelf: 'flex-start' }}
            >
              Embed Alt Text in Source Graphic
            </button>
          )}
        </div>
      </div>

      {/* Sustainable Accessibility ROI Callout */}
      <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--arcade-green)', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--arcade-green)', textTransform: 'uppercase' }}>
            Sustainable Accessibility Metric
          </span>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            Fixing document structure in Microsoft Word and Adobe InDesign reduces annual remediation costs by over <strong>80%</strong>,
            eliminating recurring touchup hours on recurring quarterly reports.
          </p>
        </div>

        <button
          type="button"
          disabled={!isAllFixed}
          onClick={() => {
            soundManager.playCorrect();
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
          }}
          className="primary-btn"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Download size={16} />
          <span>Simulate Clean PDF/UA Export</span>
        </button>
      </div>
    </div>
  );
}
