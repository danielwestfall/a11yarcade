import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';

export default function CelebrationBroadcastOverlay({ eventData, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!eventData) return;
    setVisible(true);

    // Play sound on receiver
    if (eventData.soundId) {
      soundManager.playSoundById(eventData.soundId);
    }

    // Trigger colorful confetti shower
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.25 },
        colors: ['#f59e0b', '#ec4899', '#38bdf8', '#10b981', '#ffffff']
      });
    } catch {}

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [eventData, onDismiss]);

  if (!eventData || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        maxWidth: '94vw',
        width: '560px',
        background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
        border: '3px solid #f59e0b',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 0 40px rgba(245, 158, 11, 0.5), 0 10px 40px rgba(0, 0, 0, 0.9)',
        textAlign: 'center',
        animation: 'slideDownBounce 0.35s ease-out forwards',
        color: '#ffffff'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '2.4rem' }} role="img" aria-hidden="true">
          {eventData.icon || '🎉'}
        </span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            🏆 PODIUM CHAMPION CELEBRATION
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
            {eventData.nickname} FIRED {eventData.soundName.toUpperCase()}!
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.88rem', color: '#cbd5e1', fontStyle: 'italic', marginTop: '0.25rem' }}>
        Live sound effect & confetti broadcast to all arcade participants!
      </div>
    </div>
  );
}
