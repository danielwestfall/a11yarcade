import { useState, useEffect } from 'react';

export function getActiveSkin() {
  if (typeof document !== 'undefined') {
    if (document.body.classList.contains('skin-kawaii')) return 'kawaii';
    if (document.body.classList.contains('skin-anime')) return 'anime';
    if (document.body.classList.contains('skin-arcade')) return 'arcade';
  }
  try {
    const raw = localStorage.getItem('a11yarcade_preferences');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.skin) return parsed.skin;
    }
  } catch (e) {}
  return 'arcade';
}

/**
 * React hook to reactively track active art skin ('arcade' | 'kawaii' | 'anime')
 * Enables components to switch layout structures, icons, and theme motifs.
 */
export function useSkin() {
  const [skin, setSkin] = useState(getActiveSkin);

  useEffect(() => {
    const updateSkin = () => {
      const current = getActiveSkin();
      setSkin(current);
    };

    window.addEventListener('a11y-skin-changed', updateSkin);
    window.addEventListener('storage', updateSkin);

    // Also observe document.body classList changes
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          updateSkin();
        }
      }
    });

    if (document.body) {
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    return () => {
      window.removeEventListener('a11y-skin-changed', updateSkin);
      window.removeEventListener('storage', updateSkin);
      observer.disconnect();
    };
  }, []);

  return skin;
}

/**
 * Theme icon resolver for consistent semantic iconography per theme
 */
export const THEME_ICONS = {
  arcade: {
    hero: '🕹️',
    game: '👾',
    streak: '⚡',
    verified: '🛡️',
    award: '🏆',
    star: '🌟',
    badgePrefix: '',
    badgeSuffix: '',
    pinPrefix: '#',
    examIcon: '🎮'
  },
  kawaii: {
    hero: '🎀',
    game: '🐱',
    streak: '💖',
    verified: '🌸',
    award: '🍓',
    star: '✨',
    badgePrefix: '🎀 ',
    badgeSuffix: ' 💖',
    pinPrefix: '🌸 PIN: ',
    examIcon: '🎀'
  },
  anime: {
    hero: '💥',
    game: '⚔️',
    streak: '⚡',
    verified: '👁️',
    award: '🔥',
    star: '⭐',
    badgePrefix: '🗯️ ',
    badgeSuffix: ' !!',
    pinPrefix: '⚡ PIN: ',
    examIcon: '⚔️'
  }
};
