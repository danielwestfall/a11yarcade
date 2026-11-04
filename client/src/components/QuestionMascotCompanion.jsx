import React, { useState, useEffect } from 'react';
import { useSkin, resolveQuestionMascot } from '../utils/useSkin';

/**
 * QuestionMascotCompanion
 * Displays a contextually matched illustration of the active theme's mascot
 * (Bit-Bot for Neo-Arcade, Mochi-Bot for Kawaii Pastel, A11y-Zero for Manga/Anime)
 * alongside any text question in Practice, Live, Solo Arcade, or Academy modes.
 */
export default function QuestionMascotCompanion({
  question,
  isAnswered = false,
  isCorrect = false,
  compact = false,
  customCaption = ''
}) {
  const skin = useSkin();
  const scene = resolveQuestionMascot(question, skin);
  const { mascot } = scene;

  const targetImg = isAnswered && isCorrect
    ? mascot.images.victory
    : scene.imageUrl;

  const [imgSrc, setImgSrc] = useState(targetImg);

  useEffect(() => {
    setImgSrc(isAnswered && isCorrect ? mascot.images.victory : scene.imageUrl);
  }, [skin, question, isAnswered, isCorrect, scene.imageUrl, mascot.images.victory]);

  const statusText = isAnswered
    ? isCorrect
      ? mascot.victoryQuote
      : mascot.encouragementQuote
    : customCaption || scene.caption;

  return (
    <figure
      className="question-mascot-companion"
      style={{
        margin: '0 0 1.25rem 0',
        padding: compact ? '0.75rem 1rem' : '0.95rem 1.2rem',
        background: 'var(--bg-surface-elevated)',
        border: isAnswered
          ? `2px solid ${isCorrect ? '#10b981' : '#f59e0b'}`
          : mascot.borderStyle,
        borderRadius: mascot.borderRadius,
        boxShadow: mascot.shadow,
        display: 'flex',
        alignItems: 'center',
        gap: compact ? '0.85rem' : '1.15rem',
        flexWrap: 'wrap'
      }}
    >
      <div
        style={{
          width: compact ? '76px' : '104px',
          height: compact ? '76px' : '104px',
          borderRadius: skin === 'kawaii' ? '20px' : skin === 'anime' ? '4px' : '8px',
          border: `2.5px solid ${isAnswered ? (isCorrect ? '#10b981' : '#f59e0b') : mascot.accent}`,
          background: '#ffffff',
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.25)`
        }}
      >
        <img
          src={imgSrc}
          alt={isAnswered && isCorrect ? mascot.altText.victory : scene.alt}
          width={compact ? 76 : 104}
          height={compact ? 76 : 104}
          loading="lazy"
          onError={() => {
            if (imgSrc !== mascot.images.hero) {
              setImgSrc(mascot.images.hero);
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>

      <figcaption style={{ flex: 1, minWidth: '210px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.35rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 900,
              padding: '0.15rem 0.55rem',
              borderRadius: skin === 'kawaii' ? '9999px' : '4px',
              background: isAnswered
                ? isCorrect
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(245, 158, 11, 0.2)'
                : `${mascot.accent}25`,
              color: 'var(--text-primary)',
              border: `1.5px solid ${isAnswered ? (isCorrect ? '#10b981' : '#f59e0b') : mascot.accent}`
            }}
          >
            {scene.badge}
          </span>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--text-secondary)',
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            {scene.sceneTitle}
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: compact ? '0.84rem' : '0.92rem',
            lineHeight: 1.45,
            color: 'var(--text-primary)',
            fontWeight: 600
          }}
        >
          {statusText}
        </p>
      </figcaption>
    </figure>
  );
}
