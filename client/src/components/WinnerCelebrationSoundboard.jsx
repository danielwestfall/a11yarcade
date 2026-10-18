import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Award, Sparkles } from 'lucide-react';
import { SOUNDBOARD_EFFECTS } from '../utils/taunts';
import { soundManager } from '../utils/sound';

export default function WinnerCelebrationSoundboard({ socket, isWinner = true, onTriggerLocal }) {
  const [activeEffect, setActiveEffect] = useState(null);
  const [cooldown, setCooldown] = useState(false);

  const handlePlayEffect = (effect) => {
    if (cooldown) return;

    soundManager.playClick();
    setActiveEffect(effect.id);
    setCooldown(true);

    // Play local audio immediately
    soundManager.playSoundById(effect.id);

    // Burst confetti locally unless reduced motion is preferred
    const isReducedMotion = document.body.classList.contains('reduced-motion') ||
      (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (!isReducedMotion) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }

    // Emit to room if connected via socket
    if (socket) {
      socket.emit('send-celebration-fx', {
        soundId: effect.id,
        soundName: effect.name,
        icon: effect.icon
      }, (res) => {
        if (res && res.error) {
          console.warn('Celebration FX error:', res.error);
        }
      });
    }

    if (onTriggerLocal) {
      onTriggerLocal(effect);
    }

    // Cooldown 1.2s to prevent spamming
    setTimeout(() => {
      setCooldown(false);
      setActiveEffect(null);
    }, 1200);
  };

  return (
    <section
      aria-label="Podium Champion Celebration Soundboard"
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '2px solid #eab308',
        borderRadius: 'var(--radius-lg, 12px)',
        padding: '1.5rem',
        marginTop: '1.75rem',
        marginBottom: '1.5rem',
        boxShadow: '0 0 30px rgba(234, 179, 8, 0.25)',
        textAlign: 'center'
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid #eab308', padding: '0.35rem 1rem', borderRadius: '9999px', color: '#facc15', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
        <Award size={18} />
        <span>CHAMPION'S CELEBRATION SOUNDBOARD</span>
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.4rem 0', fontFamily: "'Space Grotesk', sans-serif" }}>
        Celebrate Your Victory!
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.25rem auto' }}>
        You earned 1st Place! Tap any effect below to play sounds and broadcast celebration fireworks to everyone in the room!
      </p>

      {/* Grid of Soundboard Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
          gap: '0.75rem',
          maxWidth: '680px',
          margin: '0 auto'
        }}
      >
        {SOUNDBOARD_EFFECTS.map((eff) => {
          const isSelected = activeEffect === eff.id;
          return (
            <button
              key={eff.id}
              type="button"
              onClick={() => handlePlayEffect(eff)}
              disabled={cooldown}
              title={eff.desc}
              aria-label={`Play celebration sound effect: ${eff.name}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.85rem 0.5rem',
                minHeight: '85px',
                minWidth: '44px',
                borderRadius: '8px',
                border: `2px solid ${isSelected ? '#ffffff' : eff.color}`,
                background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(30, 41, 59, 0.85)',
                color: '#ffffff',
                cursor: cooldown ? 'not-allowed' : 'pointer',
                opacity: cooldown && !isSelected ? 0.6 : 1,
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.15s ease-out',
                boxShadow: isSelected ? `0 0 20px ${eff.color}` : 'none'
              }}
            >
              <span style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }} role="img" aria-hidden="true">
                {eff.icon}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>
                {eff.name}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                {eff.id === 'airhorn' ? '[HYPE]' : eff.id === 'fanfare' ? '[VICTORY]' : '[FX]'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
