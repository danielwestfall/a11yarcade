import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Lightbulb, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/sound';
import questionsData from '../data/questions.json';

const SHAPE_ICONS = {
  triangle: '▲',
  diamond: '◆',
  circle: '●',
  square: '■'
};

const SHAPE_NAMES = {
  triangle: 'Red Triangle',
  diamond: 'Blue Diamond',
  circle: 'Amber Circle',
  square: 'Green Square'
};

export default function PracticeMode() {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewingMissed, setIsReviewingMissed] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const nextButtonRef = useRef(null);

  // Setup Quiz
  const startQuiz = (reviewMissedOnly = false) => {
    let pool = [...questionsData];

    if (reviewMissedOnly) {
      const missedIds = history.filter(h => !h.isCorrect).map(h => h.question.id);
      pool = pool.filter(q => missedIds.includes(q.id));
      setIsReviewingMissed(true);
    } else {
      setIsReviewingMissed(false);
      if (selectedDomain !== 'all') {
        pool = pool.filter(q => q.domain === parseInt(selectedDomain, 10));
      }
      pool = pool.sort(() => 0.5 - Math.random()).slice(0, questionCount);
    }

    if (pool.length === 0) return;

    setCurrentQuestions(pool);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setHistory([]);
    setIsFinished(false);
    setIsStarted(true);
    setLiveAnnouncement(`Quiz started. Question 1 of ${pool.length}: ${pool[0].question}`);
    soundManager.playClick();
  };

  // Keyboard navigation for answers (1-4 or A-D)
  useEffect(() => {
    if (!isStarted || isFinished || isAnswered) return;

    const handleKeyDown = (e) => {
      // Ignore if user is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toUpperCase();
      let index = -1;
      if (key === '1' || key === 'A') index = 0;
      if (key === '2' || key === 'B') index = 1;
      if (key === '3' || key === 'C') index = 2;
      if (key === '4' || key === 'D') index = 3;

      const q = currentQuestions[currentIndex];
      if (q && index >= 0 && index < q.choices.length) {
        handleSelectChoice(q.choices[index]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, isFinished, isAnswered, currentIndex, currentQuestions]);

  // Focus next button when answered
  useEffect(() => {
    if (isAnswered && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [isAnswered]);

  const handleSelectChoice = (choice) => {
    if (isAnswered) return;

    const q = currentQuestions[currentIndex];
    const isCorrect = choice.isCorrect;
    setSelectedAnswer(choice.id);
    setIsAnswered(true);

    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 1);
      setLiveAnnouncement(`Correct! ${choice.text}. ${q.explanation}`);
    } else {
      soundManager.playIncorrect();
      const correctChoice = q.choices.find(c => c.isCorrect);
      setLiveAnnouncement(`Incorrect. You chose ${choice.text}. The correct answer was ${correctChoice ? correctChoice.text : ''}. ${q.explanation}`);
    }

    setHistory(prev => [
      ...prev,
      {
        question: q,
        chosenId: choice.id,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < currentQuestions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setLiveAnnouncement(`Question ${nextIdx + 1} of ${currentQuestions.length}: ${currentQuestions[nextIdx].question}`);
    } else {
      setIsFinished(true);
      soundManager.playFanfare();
      setLiveAnnouncement(`Quiz complete! Your final score is ${score} out of ${currentQuestions.length}.`);
    }
  };

  // Configuration / Start Screen
  if (!isStarted) {
    return (
      <div className="card" style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span>🎓</span> Solo Practice Mode
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Master the CPACC Body of Knowledge at your own pace with zero timer pressure, instant explanations, and witty real-world tips.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); startQuiz(false); }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="domain-select" style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>
              Select CPACC Domain:
            </label>
            <select
              id="domain-select"
              className="input-field"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              <option value="all">🌟 All Domains (Full 40-Question Mixed Pool)</option>
              <option value="1">Domain 1: Disabilities, Challenges & Assistive Tech (40%)</option>
              <option value="2">Domain 2: Accessibility & Universal Design / WCAG (34%)</option>
              <option value="3">Domain 3: Standards, Laws & Management Strategies (26%)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="count-select" style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>
              Number of Questions:
            </label>
            <select
              id="count-select"
              className="input-field"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
            >
              <option value="5">5 Quick Questions (Warm Up)</option>
              <option value="10">10 Questions (Standard Sprint)</option>
              <option value="20">20 Questions (In-Depth Practice)</option>
              <option value="40">All 40 Questions (The CPACC Marathon)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
            <span>Start Practice Quiz</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    );
  }

  // Final Results Screen
  if (isFinished) {
    const percentage = Math.round((score / currentQuestions.length) * 100);
    const missedQuestions = history.filter(h => !h.isCorrect);

    return (
      <div className="card" style={{ maxWidth: '680px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎯' : '📚'}
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Practice Round Complete!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {percentage >= 80
            ? 'Outstanding! You are well on your way to CPACC mastery!'
            : percentage >= 60
            ? 'Solid effort! A little more review and you will crush the exam.'
            : 'Great practice run. Remember: accessibility is an iterative journey!'}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          background: 'var(--bg-surface-elevated)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.75rem'
        }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8' }}>
              {score} / {currentQuestions.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Questions Correct
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: percentage >= 70 ? '#22c55e' : '#eab308' }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Accuracy Score
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {missedQuestions.length > 0 && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => startQuiz(true)}
            >
              <RotateCcw size={18} />
              <span>Retry Missed Questions ({missedQuestions.length})</span>
            </button>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsStarted(false)}
          >
            Choose Another Quiz
          </button>
        </div>
      </div>
    );
  }

  // Active Question View
  const q = currentQuestions[currentIndex];

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
      {/* Live region for screen reader updates */}
      <div className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{
            background: '#334155',
            color: '#38bdf8',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            Question {currentIndex + 1} of {currentQuestions.length}
          </span>

          <span style={{
            background: 'rgba(59, 130, 246, 0.2)',
            color: '#93c5fd',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            {q.domainName}
          </span>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
          Topic: {q.topic}
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--text-primary)' }}>
          {q.question}
        </h2>

        {/* 4 Accessible Answer Buttons */}
        <div className="answers-grid" role="group" aria-label="Answer choices">
          {q.choices.map((choice, idx) => {
            const isUserChoice = selectedAnswer === choice.id;
            const isCorrect = choice.isCorrect;

            let buttonClass = `answer-btn ${choice.shape}`;
            if (isAnswered) {
              if (isCorrect) {
                buttonClass += ' is-correct-highlight';
              } else {
                buttonClass += ' is-dimmed';
              }
            }

            return (
              <button
                key={choice.id}
                type="button"
                className={buttonClass}
                onClick={() => handleSelectChoice(choice)}
                disabled={isAnswered}
                aria-pressed={isUserChoice}
                aria-label={`${choice.id}: ${SHAPE_NAMES[choice.shape]}, ${choice.text}`}
              >
                <span className="shape-badge" aria-hidden="true">
                  {SHAPE_ICONS[choice.shape]}
                </span>
                <span style={{ flex: 1 }}>{choice.text}</span>
                <span className="shape-badge-key" aria-hidden="true">
                  Key: {idx + 1}
                </span>
                {isAnswered && isCorrect && (
                  <CheckCircle2 size={24} style={{ flexShrink: 0, color: '#ffffff' }} />
                )}
                {isAnswered && isUserChoice && !isCorrect && (
                  <XCircle size={24} style={{ flexShrink: 0, color: '#ffffff' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation Card */}
        {isAnswered && (
          <div style={{ marginTop: '1.5rem' }}>
            <div className="explanation-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>
                <BookOpen size={18} />
                <span>CPACC Explanation:</span>
              </div>
              <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.5 }}>
                {q.explanation}
              </p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                Reference: <em>{q.cpaccRef}</em>
              </div>
            </div>

            {q.funNote && (
              <div className="fun-note">
                <Lightbulb size={18} style={{ flexShrink: 0 }} />
                <span>{q.funNote}</span>
              </div>
            )}

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                ref={nextButtonRef}
                type="button"
                className="btn-primary"
                onClick={handleNext}
              >
                <span>{currentIndex + 1 < currentQuestions.length ? 'Next Question' : 'View Results'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
