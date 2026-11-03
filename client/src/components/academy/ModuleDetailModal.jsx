import React, { useState, useEffect, useRef } from 'react';
import { X, BookOpen, FlaskConical, Award, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/sound';

import DisabilityModelClassifier from './interactives/DisabilityModelClassifier';
import VisionContrastSimulator from './interactives/VisionContrastSimulator';
import SemanticHtmlFixer from './interactives/SemanticHtmlFixer';
import AriaLiveLab from './interactives/AriaLiveLab';
import AltTextDecisionTree from './interactives/AltTextDecisionTree';
import PdfTagTreeFixer from './interactives/PdfTagTreeFixer';
import UniversalDesignSorter from './interactives/UniversalDesignSorter';
import KeyboardNavigationSandbox from './interactives/KeyboardNavigationSandbox';
import Wcag22NewCriteriaLab from './interactives/Wcag22NewCriteriaLab';
import AssistiveTechSimulator from './interactives/AssistiveTechSimulator';
import PlainLanguageAndLinksFixer from './interactives/PlainLanguageAndLinksFixer';
import AccessibleTabsComboboxLab from './interactives/AccessibleTabsComboboxLab';
import IssueSeverityTriageLab from './interactives/IssueSeverityTriageLab';
import A11yMaturityModelAuditor from './interactives/A11yMaturityModelAuditor';
import SpaRoutingLab from './interactives/SpaRoutingLab';
import OcrDocumentRemediator from './interactives/OcrDocumentRemediator';
import BuiltEnvironmentBlueprintLab from './interactives/BuiltEnvironmentBlueprintLab';
import DisabilityEtiquetteLab from './interactives/DisabilityEtiquetteLab';
import WcagEmAuditPlannerLab from './interactives/WcagEmAuditPlannerLab';
import AuthoringFormatRemediator from './interactives/AuthoringFormatRemediator';
import UdlCourseDesignerLab from './interactives/UdlCourseDesignerLab';
import VpatProcurementAuditorLab from './interactives/VpatProcurementAuditorLab';
import AutomatedTestingLimitationsLab from './interactives/AutomatedTestingLimitationsLab';
import GlobalLegalCompassLab from './interactives/GlobalLegalCompassLab';
import ActRulesLinterLab from './interactives/ActRulesLinterLab';
import AcrobatTagsTableEditorLab from './interactives/AcrobatTagsTableEditorLab';

export default function ModuleDetailModal({ module, onClose, onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('STUDY'); // 'STUDY' | 'LAB' | 'QUIZ'
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);
  const tabRefs = useRef([]);

  // Focus trap management and Escape key dismissal
  useEffect(() => {
    previouslyFocusedElementRef.current = document.activeElement;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [onClose]);

  if (!module) return null;

  const handleTabChange = (tab) => {
    soundManager.playClick();
    setActiveTab(tab);
  };

  const handleTabKeyDown = (e, index) => {
    let nextIdx = index;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIdx = (index + 1) % 3;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIdx = (index - 1 + 3) % 3;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIdx = 2;
    }
    if (nextIdx !== index) {
      const tabIds = ['STUDY', 'LAB', 'QUIZ'];
      handleTabChange(tabIds[nextIdx]);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  const handleSelectQuizOption = (qId, optionId) => {
    if (quizSubmitted) return;
    soundManager.playClick();
    setQuizAnswers(prev => ({
      ...prev,
      [qId]: optionId
    }));
  };

  const handleGradeQuiz = () => {
    soundManager.playClick();
    let score = 0;
    (module.knowledgeCheck || []).forEach(q => {
      if (quizAnswers[q.id] === q.answer) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === module.knowledgeCheck.length) {
      soundManager.playCorrect();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onComplete(module.id);
    } else {
      soundManager.playIncorrect();
    }
  };

  const handleResetQuiz = () => {
    soundManager.playClick();
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const renderInteractive = () => {
    switch (module.interactiveType) {
      case 'model-classifier':
        return <DisabilityModelClassifier />;
      case 'vision-contrast-simulator':
        return <VisionContrastSimulator />;
      case 'semantic-html-fixer':
        return <SemanticHtmlFixer />;
      case 'aria-live-lab':
        return <AriaLiveLab />;
      case 'alt-text-decision-tree':
        return <AltTextDecisionTree />;
      case 'pdf-tag-tree-fixer':
        return <PdfTagTreeFixer />;
      case 'universal-design-sorter':
        return <UniversalDesignSorter />;
      case 'keyboard-navigation-sandbox':
        return <KeyboardNavigationSandbox />;
      case 'wcag22-new-criteria-lab':
        return <Wcag22NewCriteriaLab />;
      case 'assistive-tech-simulator':
        return <AssistiveTechSimulator />;
      case 'plain-language-links-fixer':
        return <PlainLanguageAndLinksFixer />;
      case 'accessible-tabs-combobox-lab':
        return <AccessibleTabsComboboxLab />;
      case 'issue-severity-triage-lab':
        return <IssueSeverityTriageLab />;
      case 'a11y-maturity-model-auditor':
        return <A11yMaturityModelAuditor />;
      case 'spa-routing-lab':
        return <SpaRoutingLab />;
      case 'ocr-document-remediator':
        return <OcrDocumentRemediator />;
      case 'built-environment-blueprint-lab':
        return <BuiltEnvironmentBlueprintLab />;
      case 'disability-etiquette-lab':
        return <DisabilityEtiquetteLab />;
      case 'wcag-em-audit-planner-lab':
        return <WcagEmAuditPlannerLab />;
      case 'authoring-format-remediator':
        return <AuthoringFormatRemediator />;
      case 'udl-course-designer-lab':
        return <UdlCourseDesignerLab />;
      case 'vpat-procurement-auditor-lab':
        return <VpatProcurementAuditorLab />;
      case 'automated-testing-limitations-lab':
        return <AutomatedTestingLimitationsLab />;
      case 'global-legal-compass-lab':
        return <GlobalLegalCompassLab />;
      case 'act-rules-linter-lab':
        return <ActRulesLinterLab />;
      case 'acrobat-tags-table-editor-lab':
        return <AcrobatTagsTableEditorLab />;
      default:
        return <DisabilityModelClassifier />;
    }
  };

  const certColor = module.cert === 'CPACC' ? '#38bdf8' : module.cert === 'WAS' ? '#10b981' : '#f59e0b';

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(4, 8, 16, 0.88)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.15s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-modal-title"
        style={{
          background: 'var(--bg-primary)',
          border: `2px solid ${certColor}`,
          borderRadius: '12px',
          maxWidth: '1080px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: `${certColor}25`, border: `1px solid ${certColor}`, color: certColor, fontSize: '0.75rem', fontWeight: 800 }}>
                {module.cert} · {module.sectionId}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {module.domainLabel}
              </span>
              {isCompleted && (
                <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={12} />
                  <span>Completed</span>
                </span>
              )}
            </div>

            <h2 id="module-modal-title" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {module.title}
            </h2>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close learning module"
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              borderRadius: '6px',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Module section tabs"
          style={{
            display: 'flex',
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 1.5rem'
          }}
        >
          <button
            ref={(el) => (tabRefs.current[0] = el)}
            type="button"
            role="tab"
            id="modal-tab-study"
            aria-selected={activeTab === 'STUDY'}
            aria-controls="modal-panel-study"
            tabIndex={activeTab === 'STUDY' ? 0 : -1}
            onClick={() => handleTabChange('STUDY')}
            onKeyDown={(e) => handleTabKeyDown(e, 0)}
            style={{
              padding: '0.85rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'STUDY' ? `3px solid ${certColor}` : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'STUDY' ? certColor : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <BookOpen size={16} aria-hidden="true" />
            <span>1. Core Concepts & Guide</span>
          </button>

          <button
            ref={(el) => (tabRefs.current[1] = el)}
            type="button"
            role="tab"
            id="modal-tab-lab"
            aria-selected={activeTab === 'LAB'}
            aria-controls="modal-panel-lab"
            tabIndex={activeTab === 'LAB' ? 0 : -1}
            onClick={() => handleTabChange('LAB')}
            onKeyDown={(e) => handleTabKeyDown(e, 1)}
            style={{
              padding: '0.85rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'LAB' ? `3px solid ${certColor}` : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'LAB' ? certColor : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FlaskConical size={16} aria-hidden="true" />
            <span>2. Hands-on Interactive Lab</span>
          </button>

          <button
            ref={(el) => (tabRefs.current[2] = el)}
            type="button"
            role="tab"
            id="modal-tab-quiz"
            aria-selected={activeTab === 'QUIZ'}
            aria-controls="modal-panel-quiz"
            tabIndex={activeTab === 'QUIZ' ? 0 : -1}
            onClick={() => handleTabChange('QUIZ')}
            onKeyDown={(e) => handleTabKeyDown(e, 2)}
            style={{
              padding: '0.85rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'QUIZ' ? `3px solid ${certColor}` : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'QUIZ' ? certColor : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Award size={16} aria-hidden="true" />
            <span>3. Knowledge Check ({module.knowledgeCheck?.length || 0} Questions)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* TAB 1: STUDY GUIDE */}
          {activeTab === 'STUDY' && (
            <div
              role="tabpanel"
              id="modal-panel-study"
              aria-labelledby="modal-tab-study"
              tabIndex={0}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', outline: 'none' }}
            >
              {/* Summary Banner */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: certColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Section Summary
                </span>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  {module.summary}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Source: <strong>{module.citation}</strong>
                </div>
              </div>

              {/* Learning Objectives */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="var(--arcade-green)" />
                  <span>Learning Objectives</span>
                </h3>
                <ul style={{ margin: '0.75rem 0 0 0', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {(module.learningObjectives || []).map((obj, idx) => (
                    <li key={idx} style={{ lineHeight: 1.5 }}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Key Concepts Deep Dive */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Detailed Theoretical Concepts
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                  {(module.keyConcepts || []).map((concept, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                    >
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: certColor }}>
                        {concept.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        {concept.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Tip Alert */}
              {module.examTips && (
                <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                    💡 IAAP Exam Strategy & Trap Alerts
                  </span>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                    {module.examTips}
                  </p>
                </div>
              )}

              {/* Next Step CTA */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleTabChange('LAB')}
                  className="primary-btn"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>Proceed to Interactive Lab</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE LAB */}
          {activeTab === 'LAB' && (
            <div
              role="tabpanel"
              id="modal-panel-lab"
              aria-labelledby="modal-tab-lab"
              tabIndex={0}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', outline: 'none' }}
            >
              {renderInteractive()}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => handleTabChange('STUDY')}
                  className="secondary-btn"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  ← Back to Study Guide
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('QUIZ')}
                  className="primary-btn"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>Take Knowledge Check</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: KNOWLEDGE CHECK */}
          {activeTab === 'QUIZ' && (
            <div
              role="tabpanel"
              id="modal-panel-quiz"
              aria-labelledby="modal-tab-quiz"
              tabIndex={0}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', outline: 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Module Mastery Assessment
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                    Score 100% on these questions to master this Body of Knowledge section.
                  </p>
                </div>

                {quizSubmitted && (
                  <div
                    role="status"
                    aria-live="polite"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                  >
                    <div style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: quizScore === module.knowledgeCheck.length ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: quizScore === module.knowledgeCheck.length ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '0.9rem' }}>
                      Score: {quizScore} / {module.knowledgeCheck.length} {quizScore === module.knowledgeCheck.length ? '— Perfect!' : '— Try again!'}
                    </div>
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="secondary-btn"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Retry Quiz
                    </button>
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(module.knowledgeCheck || []).map((q, qIdx) => {
                  const selected = quizAnswers[q.id];
                  const isCorrect = selected === q.answer;

                  return (
                    <fieldset
                      key={q.id}
                      role="radiogroup"
                      aria-labelledby={`q-stem-${q.id}`}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '1.25rem',
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      <legend
                        id={`q-stem-${q.id}`}
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'flex-start',
                          padding: 0,
                          margin: 0,
                          width: '100%'
                        }}
                      >
                        <span style={{ fontWeight: 800, color: certColor, fontSize: '0.9rem' }}>
                          Q{qIdx + 1}.
                        </span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {q.question}
                        </span>
                      </legend>

                      {/* Options */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {q.options.map((opt) => {
                          const isOptionSelected = selected === opt.id;
                          const isOptionCorrect = q.answer === opt.id;

                          let bg = 'var(--bg-surface-elevated)';
                          let border = '1px solid var(--border-color)';
                          let color = 'var(--text-secondary)';

                          if (quizSubmitted) {
                            if (isOptionCorrect) {
                              bg = 'rgba(16, 185, 129, 0.2)';
                              border = '2px solid #10b981';
                              color = '#10b981';
                            } else if (isOptionSelected && !isCorrect) {
                              bg = 'rgba(239, 68, 68, 0.2)';
                              border = '2px solid #ef4444';
                              color = '#ef4444';
                            }
                          } else if (isOptionSelected) {
                            bg = `${certColor}20`;
                            border = `2px solid ${certColor}`;
                            color = certColor;
                          }

                          return (
                            <button
                              key={opt.id}
                              type="button"
                              role="radio"
                              aria-checked={isOptionSelected}
                              onClick={() => handleSelectQuizOption(q.id, opt.id)}
                              disabled={quizSubmitted}
                              style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '6px',
                                background: bg,
                                border: border,
                                color: color,
                                textAlign: 'left',
                                cursor: quizSubmitted ? 'default' : 'pointer',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <span style={{ fontWeight: 800, width: '20px' }}>
                                {opt.id}.
                              </span>
                              <span style={{ flex: 1, lineHeight: 1.4 }}>
                                {opt.text}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Reveal */}
                      {quizSubmitted && (
                        <div
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '6px',
                            background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            color: 'var(--text-primary)'
                          }}
                        >
                          <strong>{isCorrect ? 'Correct! ' : 'Explanation: '}</strong>
                          {q.explanation}
                        </div>
                      )}
                    </fieldset>
                  );
                })}
              </div>

              {/* Quiz Submit Button */}
              {!quizSubmitted ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleGradeQuiz}
                    disabled={Object.keys(quizAnswers).length < module.knowledgeCheck.length}
                    className="primary-btn"
                    style={{
                      padding: '0.75rem 2rem',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      opacity: Object.keys(quizAnswers).length === module.knowledgeCheck.length ? 1 : 0.5,
                      cursor: Object.keys(quizAnswers).length === module.knowledgeCheck.length ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Submit Knowledge Check
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleTabChange('LAB')}
                    className="secondary-btn"
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    ← Review Interactive Lab
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="primary-btn"
                    style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
                  >
                    Done / Return to Academy
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
