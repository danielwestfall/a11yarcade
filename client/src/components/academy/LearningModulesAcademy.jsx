import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  BookOpen,
  FlaskConical,
  Award,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Code,
  Eye,
  Zap,
  Image,
  FileText,
  Keyboard,
  ChevronRight,
  RotateCcw,
  Globe,
  Scan,
  Compass,
  Heart,
  ClipboardList,
  FileCode,
  Brain,
  Briefcase,
  FileSearch,
  FileEdit,
  Users,
  Sliders,
  Columns,
  Scale,
  Server
} from 'lucide-react';
import { soundManager } from '../../utils/sound';
import { ACADEMY_TRACKS, LEARNING_MODULES } from '../../data/learningModulesData';
import ModuleDetailModal from './ModuleDetailModal';

const STORAGE_KEY = 'a11yarcade_academy_completed';

const INTERACTIVE_FILTERS = [
  { id: 'all', label: 'All Interactives', icon: FlaskConical },
  { id: 'simulator', label: 'Visual Simulators', icon: Eye },
  { id: 'code', label: 'Code & Markup Fixers', icon: Code },
  { id: 'decision', label: 'Decision Trees & Sorters', icon: Layers },
  { id: 'pdf', label: 'PDF & Document Structure', icon: FileText }
];

export default function LearningModulesAcademy() {
  const [selectedTrack, setSelectedTrack] = useState('all'); // 'all' | 'cpacc' | 'was' | 'ads'
  const [interactiveFilter, setInteractiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModule, setActiveModule] = useState(null);
  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedModules));
    } catch (e) {
      console.warn('Failed to save academy progress to localStorage', e);
    }
  }, [completedModules]);

  const handleCompleteModule = (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your academy module progress?')) {
      soundManager.playClick();
      setCompletedModules([]);
    }
  };

  const filteredModules = useMemo(() => {
    return LEARNING_MODULES.filter(mod => {
      // Track match
      if (selectedTrack !== 'all' && mod.cert.toLowerCase() !== selectedTrack.toLowerCase()) {
        return false;
      }

      // Interactive type match
      if (interactiveFilter === 'simulator') {
        if (!['vision-contrast-simulator', 'keyboard-navigation-sandbox', 'assistive-tech-simulator', 'built-environment-blueprint-lab', 'adaptive-strategies-lab'].includes(mod.interactiveType)) {
          return false;
        }
      } else if (interactiveFilter === 'code') {
        if (!['semantic-html-fixer', 'aria-live-lab', 'wcag22-new-criteria-lab', 'accessible-tabs-combobox-lab', 'spa-routing-lab', 'act-rules-linter-lab', 'cross-browser-compatibility-lab'].includes(mod.interactiveType)) {
          return false;
        }
      } else if (interactiveFilter === 'decision') {
        if (!['model-classifier', 'alt-text-decision-tree', 'universal-design-sorter', 'issue-severity-triage-lab', 'a11y-maturity-model-auditor', 'disability-etiquette-lab', 'wcag-em-audit-planner-lab', 'udl-course-designer-lab', 'vpat-procurement-auditor-lab', 'global-legal-compass-lab', 'uncrpd-treaty-explorer-lab', 'demographics-census-lab', 'accommodations-vs-universal-design-lab', 'wcag-pour-principles-lab', 'ict-standards-procurement-lab'].includes(mod.interactiveType)) {
          return false;
        }
      } else if (interactiveFilter === 'pdf') {
        if (!['pdf-tag-tree-fixer', 'plain-language-links-fixer', 'ocr-document-remediator', 'authoring-format-remediator', 'automated-testing-limitations-lab', 'acrobat-tags-table-editor-lab', 'manual-document-audit-protocol-lab', 'export-architecture-lab'].includes(mod.interactiveType)) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${mod.title} ${mod.summary} ${mod.sectionId} ${mod.domainLabel} ${mod.cert} ${(mod.keyConcepts || []).map(c => c.title).join(' ')}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [selectedTrack, interactiveFilter, searchQuery]);

  const totalModules = LEARNING_MODULES.length;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  const getLabIcon = (type) => {
    switch (type) {
      case 'model-classifier':
      case 'universal-design-sorter':
      case 'issue-severity-triage-lab':
      case 'a11y-maturity-model-auditor':
        return <Layers size={14} color="var(--arcade-purple)" />;
      case 'vision-contrast-simulator':
      case 'assistive-tech-simulator':
        return <Eye size={14} color="var(--arcade-cyan)" />;
      case 'semantic-html-fixer':
      case 'wcag22-new-criteria-lab':
      case 'accessible-tabs-combobox-lab':
        return <Code size={14} color="var(--arcade-green)" />;
      case 'aria-live-lab':
        return <Zap size={14} color="var(--arcade-gold)" />;
      case 'alt-text-decision-tree':
        return <Image size={14} color="var(--arcade-amber)" />;
      case 'pdf-tag-tree-fixer':
      case 'plain-language-links-fixer':
        return <FileText size={14} color="var(--arcade-amber)" />;
      case 'keyboard-navigation-sandbox':
        return <Keyboard size={14} color="var(--arcade-cyan)" />;
      case 'spa-routing-lab':
        return <Globe size={14} color="var(--arcade-cyan)" />;
      case 'ocr-document-remediator':
        return <Scan size={14} color="var(--arcade-amber)" />;
      case 'built-environment-blueprint-lab':
        return <Compass size={14} color="var(--arcade-green)" />;
      case 'disability-etiquette-lab':
        return <Heart size={14} color="var(--arcade-purple)" />;
      case 'wcag-em-audit-planner-lab':
        return <ClipboardList size={14} color="var(--arcade-green)" />;
      case 'authoring-format-remediator':
        return <FileCode size={14} color="var(--arcade-amber)" />;
      case 'udl-course-designer-lab':
        return <Brain size={14} color="var(--arcade-purple)" />;
      case 'vpat-procurement-auditor-lab':
        return <Briefcase size={14} color="var(--arcade-cyan)" />;
      case 'automated-testing-limitations-lab':
        return <FileSearch size={14} color="var(--arcade-amber)" />;
      case 'global-legal-compass-lab':
        return <Globe size={14} color="var(--arcade-cyan)" />;
      case 'act-rules-linter-lab':
        return <Code size={14} color="var(--arcade-green)" />;
      case 'acrobat-tags-table-editor-lab':
        return <FileEdit size={14} color="var(--arcade-amber)" />;
      case 'uncrpd-treaty-explorer-lab':
        return <Globe size={14} color="var(--arcade-cyan)" />;
      case 'cross-browser-compatibility-lab':
        return <Layers size={14} color="var(--arcade-purple)" />;
      case 'manual-document-audit-protocol-lab':
        return <FileSearch size={14} color="var(--arcade-amber)" />;
      case 'demographics-census-lab':
        return <Users size={14} color="var(--arcade-cyan)" />;
      case 'adaptive-strategies-lab':
        return <Sliders size={14} color="var(--arcade-green)" />;
      case 'export-architecture-lab':
        return <Columns size={14} color="var(--arcade-amber)" />;
      case 'accommodations-vs-universal-design-lab':
        return <Scale size={14} color="var(--arcade-cyan)" />;
      case 'wcag-pour-principles-lab':
        return <Compass size={14} color="var(--arcade-green)" />;
      case 'ict-standards-procurement-lab':
        return <Server size={14} color="var(--arcade-cyan)" />;
      default:
        return <FlaskConical size={14} color="var(--arcade-cyan)" />;
    }
  };

  const getLabLabel = (type) => {
    switch (type) {
      case 'model-classifier':
        return 'Disability Models Classifier';
      case 'vision-contrast-simulator':
        return 'Vision & Contrast Lab';
      case 'semantic-html-fixer':
        return 'Semantic HTML DOM Fixer';
      case 'aria-live-lab':
        return 'ARIA Live Region Lab';
      case 'alt-text-decision-tree':
        return 'Alt-Text Decision Tree';
      case 'pdf-tag-tree-fixer':
        return 'PDF Tag Tree Remediator';
      case 'universal-design-sorter':
        return 'Universal Design Sorter';
      case 'keyboard-navigation-sandbox':
        return 'Keyboard Focus Sandbox';
      case 'wcag22-new-criteria-lab':
        return 'WCAG 2.2 New Criteria Lab';
      case 'assistive-tech-simulator':
        return 'Assistive Technology Simulator';
      case 'plain-language-links-fixer':
        return 'Plain Language & Links Lab';
      case 'accessible-tabs-combobox-lab':
        return 'W3C APG Accessible Tabs Lab';
      case 'issue-severity-triage-lab':
        return 'Defect Severity Triage Lab';
      case 'a11y-maturity-model-auditor':
        return 'Enterprise Maturity Auditor';
      case 'spa-routing-lab':
        return 'SPA Focus & Routing Lab';
      case 'ocr-document-remediator':
        return 'PDF OCR & Glyph Remediator';
      case 'built-environment-blueprint-lab':
        return 'Built Environment Blueprint Lab';
      case 'disability-etiquette-lab':
        return 'Disability Etiquette Simulator';
      case 'wcag-em-audit-planner-lab':
        return 'WCAG-EM Audit Planner Lab';
      case 'authoring-format-remediator':
        return 'Source Format Remediator';
      case 'udl-course-designer-lab':
        return 'UDL Course Designer Lab';
      case 'vpat-procurement-auditor-lab':
        return 'VPAT & Procurement Auditor';
      case 'automated-testing-limitations-lab':
        return 'Testing Limitations Lab';
      case 'global-legal-compass-lab':
        return 'Global Legal Compass Lab';
      case 'act-rules-linter-lab':
        return 'W3C ACT Rules Linter Lab';
      case 'acrobat-tags-table-editor-lab':
        return 'Acrobat Tags & Table Editor';
      case 'uncrpd-treaty-explorer-lab':
        return 'UN CRPD & Treaties Explorer';
      case 'cross-browser-compatibility-lab':
        return 'Cross-Browser A11y Matrix';
      case 'manual-document-audit-protocol-lab':
        return 'Manual PDF Audit Protocol';
      case 'demographics-census-lab':
        return 'Demographics & Aging Simulator';
      case 'adaptive-strategies-lab':
        return 'Adaptive Strategies & Input Lab';
      case 'export-architecture-lab':
        return 'InDesign & Word Architecture Lab';
      case 'accommodations-vs-universal-design-lab':
        return 'Accommodations vs Universal Design';
      case 'wcag-pour-principles-lab':
        return 'WCAG POUR Principles Lab';
      case 'ict-standards-procurement-lab':
        return 'ICT Standards & Procurement';
      default:
        return 'Interactive Lab';
    }
  };

  const handleCloseModal = useCallback(() => {
    setActiveModule(null);
  }, []);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '6rem' }}>
      {/* Marquee Header Banner */}
      <section aria-labelledby="academy-marquee-title" className="marquee-hero-card">
        <div aria-hidden="true" style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(192, 132, 252, 0.12)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '12rem', height: '12rem', background: 'rgba(56, 189, 248, 0.12)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #c084fc', color: '#e9d5ff', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>🌟</span>
              <span>IAAP BODY OF KNOWLEDGE CURRICULUM</span>
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #38bdf8', color: '#7dd3fc', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)' }}>
              CPACC · WAS · ADS
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', color: '#6ee7b7', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>🔬</span>
              <span>HANDS-ON INTERACTIVE LABS</span>
            </span>
          </div>

          <h1 id="academy-marquee-title" style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
            Digital Accessibility <span style={{ color: 'var(--arcade-cyan)' }}>Learning Modules</span>
          </h1>
          <p style={{ marginTop: '0.75rem', fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '840px' }}>
            Master the official IAAP Bodies of Knowledge through deep conceptual lessons, visual simulators, live code and tag tree fixers, decision trees, and knowledge-check assessments.
          </p>

          {/* Overall Academy Progress Bar */}
          <div style={{ marginTop: '1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} color="var(--arcade-gold)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Academy Curriculum Mastery
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--arcade-green)' }}>
                  {completedCount} of {totalModules} Modules ({progressPercent}%)
                </span>
                {completedCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetProgress}
                    aria-label="Reset Academy Progress"
                    title="Reset Academy Progress"
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Certification Tracks Filter Tabs */}
      <section aria-labelledby="tracks-filter-title">
        <h2 id="tracks-filter-title" className="sr-only">Certification Track Filters</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {ACADEMY_TRACKS.map(track => {
            const isSelected = selectedTrack === track.id;
            return (
              <button
                key={track.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedTrack(track.id);
                }}
                style={{
                  background: isSelected ? track.bg : 'var(--bg-surface)',
                  border: isSelected ? `2px solid ${track.color}` : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: track.color }}>
                    {track.badge}
                  </span>
                  {isSelected && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: track.color }} aria-hidden="true" />
                  )}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {track.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {track.desc}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Search and Interactive Filter Bar */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem 1.25rem' }}>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.4rem 0.75rem', minWidth: '280px', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" aria-hidden="true" />
          <input
            id="academy-module-search"
            name="academyModuleSearch"
            type="search"
            aria-label="Search concepts, sections, and modules"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, sections (e.g. 'Social Model', 'WCAG', 'PDF/UA')..."
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>

        {/* Interactive Lab Type Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            LAB TYPE:
          </span>
          {INTERACTIVE_FILTERS.map(filter => {
            const isFilterActive = interactiveFilter === filter.id;
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={isFilterActive}
                onClick={() => {
                  soundManager.playClick();
                  setInteractiveFilter(filter.id);
                }}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isFilterActive ? '1px solid var(--arcade-cyan)' : '1px solid var(--border-color)',
                  background: isFilterActive ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface-elevated)',
                  color: isFilterActive ? 'var(--arcade-cyan)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Icon size={12} aria-hidden="true" />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Modules Grid */}
      <section aria-label="Available Teaching Modules">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2
            role="status"
            aria-live="polite"
            aria-atomic="true"
            style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}
          >
            Curriculum Sections ({filteredModules.length} Modules Available)
          </h2>
        </div>

        {filteredModules.length === 0 ? (
          <div style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>No modules match your current filter and search query.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('all');
                setInteractiveFilter('all');
                setSearchQuery('');
              }}
              className="primary-btn"
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {filteredModules.map(mod => {
              const isCompleted = completedModules.includes(mod.id);
              const certColor = mod.cert === 'CPACC' ? '#38bdf8' : mod.cert === 'WAS' ? '#10b981' : '#f59e0b';

              return (
                <div
                  key={mod.id}
                  className="card"
                  style={{
                    background: 'var(--bg-surface)',
                    border: isCompleted ? '1px solid var(--arcade-green)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    position: 'relative',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', background: `${certColor}20`, color: certColor, border: `1px solid ${certColor}` }}>
                        {mod.cert} · {mod.sectionId}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0.15rem 0.4rem' }}>
                        {mod.badge}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arcade-green)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={16} />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} />
                        <span>{mod.estimatedMinutes} min</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {mod.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                      {mod.summary}
                    </p>
                  </div>

                  {/* Interactive Lab Callout */}
                  <div style={{ padding: '0.6rem 0.75rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                    {getLabIcon(mod.interactiveType)}
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Interactive: <strong style={{ color: 'var(--text-primary)' }}>{getLabLabel(mod.interactiveType)}</strong>
                    </span>
                  </div>

                  {/* Launch CTA Button */}
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setActiveModule(mod);
                    }}
                    className="primary-btn"
                    style={{
                      padding: '0.65rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      marginTop: '0.25rem'
                    }}
                  >
                    <BookOpen size={16} />
                    <span>{isCompleted ? 'Review Module & Lab' : 'Start Learning Module'}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Active Module Modal Runner */}
      {activeModule && (
        <ModuleDetailModal
          module={activeModule}
          isCompleted={completedModules.includes(activeModule.id)}
          onClose={handleCloseModal}
          onComplete={handleCompleteModule}
        />
      )}
    </div>
  );
}
