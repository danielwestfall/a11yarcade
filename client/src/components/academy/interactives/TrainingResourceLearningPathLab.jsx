import React, { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Bookmark,
  Users,
  Search,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const RESOURCE_COLLECTIONS = [
  {
    id: 'templates',
    name: 'Pre-Remediated Document Templates',
    count: '24 Templates',
    desc: 'Locked-down Word, PowerPoint, and InDesign templates with built-in heading styles, compliant brand palettes, and pre-tagged tables.',
    impact: 'Prevents 85% of authoring defects at the point of origin.'
  },
  {
    id: 'job-aids',
    name: '1-Page Quick Reference Job Aids',
    count: '12 Job Aids',
    desc: 'Laminated desk cards covering Word alt-text workflows, Acrobat table tag remediation shortcuts, and PAC checker error interpretation.',
    impact: 'Delivers just-in-time answers when authors hit edge cases.'
  },
  {
    id: 'champions-network',
    name: 'Departmental Accessibility Champions Network',
    count: '38 Champions',
    desc: 'Peer advocates embedded within marketing, HR, legal, and engineering to provide first-line reviews and guidance.',
    impact: 'Scales accessibility culture horizontally across siloed business units.'
  },
  {
    id: 'procurement-library',
    name: 'Vendor ACR / VPAT Verification Archive',
    count: '45 ACRs',
    desc: 'Documented assessments of third-party document authoring tools and contract language clauses.',
    impact: 'Protects the enterprise from procuring inaccessible software.'
  }
];

export default function TrainingResourceLearningPathLab() {
  const [activeCollectionId, setActiveCollectionId] = useState('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [visitedCount, setVisitedCount] = useState(1);
  const [completed, setCompleted] = useState(false);

  const activeCollection = RESOURCE_COLLECTIONS.find(c => c.id === activeCollectionId) || RESOURCE_COLLECTIONS[0];

  const handleSelectCollection = (id) => {
    soundManager.playClick();
    setActiveCollectionId(id);
    const newCount = visitedCount + 1;
    setVisitedCount(newCount);
    if (newCount >= RESOURCE_COLLECTIONS.length && !completed) {
      setCompleted(true);
      soundManager.playCorrect();
      confetti({ particleCount: 35, spread: 60 });
    }
  };

  return (
    <section aria-label="Digital Accessibility Resource Hub Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <FolderKanban size={20} aria-hidden="true" />
          Curating Digital Accessibility Resources & Knowledge Bases
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          A robust accessibility infrastructure pairs formal training with an accessible resource portal: standardized document templates, desk reference job aids, and an active <strong>Accessibility Champions Network</strong> embedded across business units.
        </p>
      </div>

      {/* Resource Category Cards */}
      <div role="tablist" onKeyDown={(e) => {
          if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
          e.preventDefault();
          const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'));
          const idx = tabs.indexOf(document.activeElement);
          if (idx === -1) return;
          const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : e.key === 'ArrowLeft' ? (idx - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : tabs.length - 1;
          tabs[nextIdx]?.focus();
          tabs[nextIdx]?.click();
        }} aria-label="Knowledge Base Collections" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
        {RESOURCE_COLLECTIONS.map(col => {
          const isSelected = activeCollectionId === col.id;
          return (
            <button
              key={col.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleSelectCollection(col.id)}
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
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              <span>{col.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{col.count}</span>
            </button>
          );
        })}
      </div>

      {/* Collection Detail Viewer */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--arcade-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, color: 'var(--arcade-yellow)', fontSize: '1rem' }}>{activeCollection.name}</h4>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--arcade-yellow)' }}>
            Active Repository
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
          {activeCollection.desc}
        </p>
        <div style={{ padding: '0.75rem', borderRadius: '4px', background: 'var(--arcade-surface)', border: '1px solid var(--arcade-border)', fontSize: '0.85rem' }}>
          <strong style={{ color: 'var(--arcade-green)' }}>Strategic Business Impact:</strong> {activeCollection.impact}
        </div>
      </div>

      {/* Educational Confirmation */}
      {completed && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--arcade-green)',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <CheckCircle2 size={24} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <strong>Knowledge Architecture Mastered!</strong> Standardizing pre-tested templates and mobilizing localized departmental champions creates an organizational self-healing mechanism for digital accessibility.
          </p>
        </div>
      )}
    </section>
  );
}
