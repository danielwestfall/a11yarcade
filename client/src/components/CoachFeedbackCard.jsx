import React, { useState, useEffect } from 'react';
import { Volume2, MessageSquareQuote, Shuffle, VolumeX } from 'lucide-react';
import { getRandomCoachQuote } from '../utils/coachQuotes';
import { soundManager } from '../utils/sound';
import RetroMemeBadge from './RetroMemeBadge';

export default function CoachFeedbackCard({ isCorrect, autoPlaySound = false }) {
  const [quoteData, setQuoteData] = useState(() => getRandomCoachQuote(isCorrect));
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Update quote when isCorrect outcome changes
  useEffect(() => {
    setQuoteData(getRandomCoachQuote(isCorrect));
    if (autoPlaySound) {
      soundManager.playCoachFeedback(isCorrect);
    }
  }, [isCorrect, autoPlaySound]);

  // Clean up any ongoing speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleNextQuote = () => {
    soundManager.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setQuoteData(prev => getRandomCoachQuote(isCorrect, prev?.name));
  };

  const handlePlaySound = () => {
    soundManager.playCoachFeedback(isCorrect);
  };

  const handleSpeakQuote = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(quoteData.quote);
    
    // Coach McGuirk's deadpan, slightly lower-pitch cadence
    utterance.pitch = 0.84;
    utterance.rate = 0.88;

    // Try finding an English voice (prefer male/deep if available)
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Male'))) 
      || voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const accentColor = isCorrect ? '#10b981' : '#f59e0b';
  const badgeBg = isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)';
  const borderStyle = isCorrect ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)';

  return (
    <aside
      className="coach-feedback-card"
      aria-label="Coach McGuirk's Sideline Pep Talk"
      style={{
        background: '#070f22',
        border: borderStyle,
        borderRadius: 'var(--radius-sm, 8px)',
        padding: '1.25rem',
        marginTop: '0.75rem',
        marginBottom: '0.75rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
        position: 'relative'
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.4rem' }} role="img" aria-hidden="true">🧢</span>
          <div>
            <div
              className="coach-header-title"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: '0.88rem',
                letterSpacing: '0.05em',
                color: '#ffffff',
                textTransform: 'uppercase'
              }}
            >
              Coach McGuirk's Sideline Pep Talk
            </div>
            <div
              className="coach-quote-topic"
              style={{
                fontSize: '0.75rem',
                fontFamily: "'Space Mono', monospace",
                color: accentColor,
                fontWeight: 800
              }}
            >
              {quoteData.name ? `[${quoteData.name.toUpperCase()}]` : `[${quoteData.topic.toUpperCase()}]`}
              {quoteData.name && quoteData.topic && (
                <span className="coach-quote-subtopic" style={{ opacity: 0.85, fontWeight: 600, marginLeft: '0.4rem', color: '#94a3b8' }}>
                  • {quoteData.topic}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Audio & Quote Interaction Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handlePlaySound}
            title={isCorrect ? 'Play Whistle Earcon' : 'Play Sad Trombone'}
            aria-label={isCorrect ? 'Play referee whistle sound effect' : 'Play sad trombone sound effect'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px',
              padding: '0.4rem 0.65rem',
              background: badgeBg,
              border: `1px solid ${accentColor}`,
              borderRadius: '6px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              gap: '0.35rem'
            }}
          >
            <Volume2 size={16} color={accentColor} />
            <span style={{ fontFamily: "'Space Mono', monospace" }}>
              {isCorrect ? 'Whistle' : 'Wah-Wah'}
            </span>
          </button>

          {typeof window !== 'undefined' && 'speechSynthesis' in window && (
            <button
              type="button"
              onClick={handleSpeakQuote}
              title={isSpeaking ? 'Stop Coach Voice' : 'Coach Reads Quote Aloud'}
              aria-label={isSpeaking ? 'Stop voice readout' : 'Have Coach read quote aloud'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px',
                padding: '0.4rem 0.65rem',
                background: isSpeaking ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: isSpeaking ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: isSpeaking ? '#fca5a5' : '#e2e8f0',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 700,
                gap: '0.35rem'
              }}
            >
              {isSpeaking ? <VolumeX size={16} /> : <MessageSquareQuote size={16} />}
              <span style={{ fontFamily: "'Space Mono', monospace" }}>
                {isSpeaking ? 'Stop' : 'Voice'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNextQuote}
            title="Get another random Coach quote"
            aria-label="Get another Coach McGuirk quote"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px',
              padding: '0.4rem 0.65rem',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <Shuffle size={16} />
          </button>
        </div>
      </div>

      {/* Quote Body with Retro Pixel Meme Badge */}
      <div
        className="coach-quote-body"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '0.4rem',
          flexWrap: 'wrap'
        }}
      >
        <RetroMemeBadge
          badgeId={quoteData.badgeId || 'default'}
          isCorrect={isCorrect}
          size={64}
        />

        <div style={{ flex: 1, minWidth: '220px' }}>
          <blockquote
            style={{
              margin: 0,
              padding: '0.2rem 0.4rem',
              color: '#f8fafc',
              fontSize: '0.98rem',
              lineHeight: 1.6,
              fontStyle: 'italic',
              fontFamily: "'Space Grotesk', system-ui, sans-serif"
            }}
          >
            "{quoteData.quote}"
          </blockquote>

          {/* Attribution Tag */}
          <div
            className="coach-attribution-box"
            style={{
              marginTop: '0.5rem',
              textAlign: 'right',
              fontSize: '0.78rem',
              fontFamily: "'Space Mono', monospace",
              color: '#94a3b8'
            }}
          >
            — <span className="coach-attribution-name" style={{ color: '#ffffff', fontWeight: 700 }}>Coach McGuirk</span>, Unsolicited Sideline Advice
          </div>
        </div>
      </div>
    </aside>
  );
}
