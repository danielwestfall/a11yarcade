import React, { useState } from 'react';
import {
  FileEdit,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Table,
  Link,
  Layers,
  Check,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

export default function AcrobatTagsTableEditorLab() {
  const [tableCellFixed, setTableCellFixed] = useState(false);
  const [footerArtifacted, setFooterArtifacted] = useState(false);
  const [linkObjrFixed, setLinkObjrFixed] = useState(false);

  const completedCount = [tableCellFixed, footerArtifacted, linkObjrFixed].filter(Boolean).length;
  const isAllFixed = completedCount === 3;
  const pacScore = Math.round((completedCount / 3) * 100);

  const handleFixTable = () => {
    soundManager.playClick();
    setTableCellFixed(true);
    checkAll(true, footerArtifacted, linkObjrFixed);
  };

  const handleFixFooter = () => {
    soundManager.playClick();
    setFooterArtifacted(true);
    checkAll(tableCellFixed, true, linkObjrFixed);
  };

  const handleFixLink = () => {
    soundManager.playClick();
    setLinkObjrFixed(true);
    checkAll(tableCellFixed, footerArtifacted, true);
  };

  const checkAll = (t, f, l) => {
    if (t && f && l) {
      soundManager.playCorrect();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleFixAll = () => {
    soundManager.playClick();
    setTableCellFixed(true);
    setFooterArtifacted(true);
    setLinkObjrFixed(true);
    soundManager.playCorrect();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    soundManager.playClick();
    setTableCellFixed(false);
    setFooterArtifacted(false);
    setLinkObjrFixed(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro Header */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <FileEdit size={18} color="var(--arcade-amber)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Adobe Acrobat Pro Tags Tree & Table Editor Lab
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          IAAP ADS BoK Section 2.3 covers final-format PDF remediation in Adobe Acrobat Pro when source files (InDesign, Word)
          are unavailable. Remediators must master the Tags Tree, Reading Order Tool, and Table Editor to resolve complex
          multi-column cell spans, artifact decorative footers, and create Object Reference (`/OBJR`) tags for hyperlinks.
        </p>
      </div>

      {/* PAC Validation Score & Actions */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Acrobat Pro TouchUp PDF/UA Conformance
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isAllFixed ? 'var(--arcade-green)' : pacScore >= 50 ? 'var(--arcade-cyan)' : '#ef4444' }}>
              {pacScore}% PAC Validation {isAllFixed && '— PDF/UA-1 ISO 14289 VALIDATED ✓'}
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
              <span>Remediate All in Acrobat</span>
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

        {/* Progress Bar */}
        <div style={{ height: '8px', width: '100%', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${pacScore}%`,
              background: isAllFixed ? 'var(--arcade-green)' : pacScore >= 50 ? 'var(--arcade-cyan)' : '#ef4444',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* 3 TouchUp Scenarios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Task 1: Table Editor ColSpan */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: `1px solid ${tableCellFixed ? 'var(--arcade-green)' : 'var(--border-color)'}`, borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Table size={16} color={tableCellFixed ? 'var(--arcade-green)' : 'var(--arcade-cyan)'} />
                <h5 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  1. Acrobat Table Editor: Multi-Column Cell Spanning (ColSpan)
                </h5>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Defect: Category header "Operating Budget" visually spans 2 columns, but is tagged as a single-column <code>&lt;TD&gt;</code> without spanning attributes, causing PAC table regularity check to fail.
              </div>
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', background: tableCellFixed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: tableCellFixed ? 'var(--arcade-green)' : '#f87171', border: `1px solid ${tableCellFixed ? 'var(--arcade-green)' : '#ef4444'}` }}>
              {tableCellFixed ? 'REGULAR TABLE ✓' : 'TABLE REGULARITY FAIL ✗'}
            </span>
          </div>

          <div style={{ background: '#0a0f1d', padding: '0.5rem 0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem', color: tableCellFixed ? '#4ade80' : '#f87171' }}>
            {tableCellFixed ? (
              '&lt;TH Scope="Column" ColSpan="2"&gt; Operating Budget &lt;/TH&gt;'
            ) : (
              '&lt;TD&gt; Operating Budget &lt;/TD&gt; (Missing ColSpan & Header Type)'
            )}
          </div>

          {!tableCellFixed && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.35rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={handleFixTable}
                className="primary-btn"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Check size={14} />
                <span>Set Table Cell Properties: Header Cell + ColSpan="2"</span>
              </button>
            </div>
          )}
        </div>

        {/* Task 2: Artifact Decorative Footer */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: `1px solid ${footerArtifacted ? 'var(--arcade-green)' : 'var(--border-color)'}`, borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={16} color={footerArtifacted ? 'var(--arcade-green)' : 'var(--arcade-amber)'} />
                <h5 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  2. Reading Order Tool: Tag Decorative Footer as /Artifact
                </h5>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Defect: Running page numbers ("Page 4 of 24") and decorative rules are tagged in the logical structure tree between paragraphs, interrupting text-to-speech reading flow.
              </div>
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', background: footerArtifacted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: footerArtifacted ? 'var(--arcade-green)' : '#f87171', border: `1px solid ${footerArtifacted ? 'var(--arcade-green)' : '#ef4444'}` }}>
              {footerArtifacted ? 'ARTIFACTED ✓' : 'UNWANTED SCREEN READER INTERRUPTION ✗'}
            </span>
          </div>

          <div style={{ background: '#0a0f1d', padding: '0.5rem 0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem', color: footerArtifacted ? '#4ade80' : '#f87171' }}>
            {footerArtifacted ? (
              '/Artifact &lt;&lt; /Type /Pagination /Subtype /Footer &gt;&gt; (Screen readers skip cleanly)'
            ) : (
              '&lt;P&gt; Page 4 of 24 &lt;/P&gt; (Tagged as substantive body content)'
            )}
          </div>

          {!footerArtifacted && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.35rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={handleFixFooter}
                className="primary-btn"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Check size={14} />
                <span>Mark Running Footer as Background / Artifact</span>
              </button>
            </div>
          )}
        </div>

        {/* Task 3: Link OBJR Tagging */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: `1px solid ${linkObjrFixed ? 'var(--arcade-green)' : 'var(--border-color)'}`, borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Link size={16} color={linkObjrFixed ? 'var(--arcade-green)' : 'var(--arcade-purple)'} />
                <h5 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  3. Tags Tree: Interactive Link Object Reference (/OBJR) Tagging
                </h5>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Defect: Hyperlink text "Download Annual Report" is styled in blue underline, but the interactive click target is not mapped to an <code>/OBJR</code> child under the <code>&lt;Link&gt;</code> tag. Screen readers announce plain text and cannot activate the link.
              </div>
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', background: linkObjrFixed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: linkObjrFixed ? 'var(--arcade-green)' : '#f87171', border: `1px solid ${linkObjrFixed ? 'var(--arcade-green)' : '#ef4444'}` }}>
              {linkObjrFixed ? 'INTERACTIVE LINK VALIDATED ✓' : 'UNTAGGED LINK ANNOTATION ✗'}
            </span>
          </div>

          <div style={{ background: '#0a0f1d', padding: '0.5rem 0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem', color: linkObjrFixed ? '#4ade80' : '#f87171' }}>
            {linkObjrFixed ? (
              '&lt;Link&gt; "Download Annual Report" &lt;Link - OBJR&gt; &lt;/Link&gt;'
            ) : (
              '&lt;P&gt; "Download Annual Report" &lt;/P&gt; (Missing &lt;Link&gt; and &lt;Link - OBJR&gt;)'
            )}
          </div>

          {!linkObjrFixed && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.35rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={handleFixLink}
                className="primary-btn"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Check size={14} />
                <span>Wrap in &lt;Link&gt; & Associate Link Annotation OBJR</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
