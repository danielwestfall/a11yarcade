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

/**
 * Official Theme Mascots Registry for the 3 A11y Arcade Skins
 */
export const THEME_MASCOTS = {
  arcade: {
    id: 'arcade',
    name: 'Bit-Bot',
    role: '16-Bit Cyber-Cadet',
    skinLabel: 'Neo-Arcade',
    tagline: 'Scanning CRT scanlines, keyboard focus rings, and ARIA trees at 60fps!',
    victoryQuote: 'HIGH SCORE UNLOCKED! Zero keyboard traps detected in sector!',
    encouragementQuote: 'Insert coin & recalibrate! Even elite auditors check the WCAG spec twice.',
    accent: '#38bdf8',
    secondary: '#c084fc',
    borderStyle: '2px solid #38bdf8',
    borderRadius: '8px',
    shadow: '4px 4px 0px 0px #040810',
    images: {
      hero: '/mascots/arcade-hero.jpg',
      academy: '/mascots/arcade-academy.png',
      victory: '/mascots/arcade-victory.png',
      at: '/mascots/arcade-q-at.png',
      wcag: '/mascots/arcade-q-wcag.png',
      laws: '/mascots/arcade-q-laws.png'
    },
    altText: {
      hero: 'Bit-Bot, the 16-bit pixel-art robot mascot holding an arcade controller',
      academy: 'Bit-Bot wearing study glasses and examining a holographic WCAG accessibility guide',
      victory: 'Bit-Bot cheering with a golden pixel-art accessibility trophy',
      at: 'Bit-Bot testing assistive technology with headphones and a refreshable Braille display',
      wcag: 'Bit-Bot inspecting semantic HTML code blocks and a 7:1 AAA contrast analyzer',
      laws: 'Bit-Bot stamping an approved accessibility conformance scroll with a gavel'
    },
    pepTalks: [
      'Pro Tip: Always test custom widgets with Tab, Shift+Tab, Arrow keys, Enter, and Space!',
      '16-Bit Wisdom: Native HTML elements (<button>, <nav>, <dialog>) give you keyboard support for free!',
      'Arcade Telemetry: Color alone is never enough—pair status colors with icons and text labels!'
    ]
  },
  kawaii: {
    id: 'kawaii',
    name: 'Mochi-Bot',
    role: 'Pastel Accessibility Companion',
    skinLabel: 'Kawaii Pastel',
    tagline: 'Sprinkling Universal Design, cozy ergonomics, and WCAG AAA magic everywhere!',
    victoryQuote: 'YAY!! Sparkling 100% inclusive mastery! Everyone gets to play together!',
    encouragementQuote: 'Gentle hug! Accessibility is a journey—let’s review the citation together!',
    accent: '#ec4899',
    secondary: '#a855f7',
    borderStyle: '2.5px solid #ec4899',
    borderRadius: '22px',
    shadow: '0 6px 18px rgba(236, 72, 153, 0.22)',
    images: {
      hero: '/mascots/kawaii-hero.jpg',
      academy: '/mascots/kawaii-academy.png',
      victory: '/mascots/kawaii-victory.png',
      at: '/mascots/kawaii-q-at.png',
      wcag: '/mascots/kawaii-q-wcag.png',
      laws: '/mascots/kawaii-q-laws.png'
    },
    altText: {
      hero: 'Mochi-Bot, the cute pastel robot mascot with a blue bow, gear flower, and wheelchair emblem overalls',
      academy: 'Mochi-Bot wearing round reading glasses and holding a pastel accessibility study book',
      victory: 'Mochi-Bot jumping with joy holding a golden star trophy and strawberry ribbon',
      at: 'Mochi-Bot wearing pastel headphones listening to screen reader speech output and touching a Braille board',
      wcag: 'Mochi-Bot holding a pastel paintbrush beside a browser window showing semantic button markup and AAA contrast stars',
      laws: 'Mochi-Bot holding a balance scale and stamping a heart checkmark on an accessible PDF/UA document scroll'
    },
    pepTalks: [
      'Sweet Reminder: The Social Model of Disability removes barriers so every friend belongs!',
      'Kawaii Craft: Clear headings (h1 to h6) and descriptive link text make navigation a breeze!',
      'Cozy Design: Respecting prefers-reduced-motion keeps animations gentle for vestibular comfort!'
    ]
  },
  anime: {
    id: 'anime',
    name: 'A11y-Zero',
    role: 'Shonen Compliance Vanguard',
    skinLabel: 'Manga & Comic',
    tagline: 'Shattering accessibility barriers with unstoppable WCAG 2.2 overdrive!!',
    victoryQuote: 'ULTIMATE COMPLIANCE STRIKE!! Barrier obliterated with zero mercy!!',
    encouragementQuote: 'STAND UP, CADET!! Every missed drill fuels your next limit-break awakening!!',
    accent: '#ef4444',
    secondary: '#38bdf8',
    borderStyle: '3px solid #38bdf8',
    borderRadius: '4px',
    shadow: '4px 4px 0px 0px #000000',
    images: {
      hero: '/mascots/anime-hero.jpg',
      academy: '/mascots/anime-academy.png',
      victory: '/mascots/anime-victory.png',
      at: '/mascots/anime-q-at.png',
      wcag: '/mascots/anime-q-wcag.png',
      laws: '/mascots/anime-q-laws.png'
    },
    altText: {
      hero: 'A11y-Zero, the shonen anime robot hero in an action pose wearing a navy wheelchair-emblem cap and cyan scarf',
      academy: 'A11y-Zero pointing dramatically at a holographic WCAG 2.2 battle strategy board',
      victory: 'A11y-Zero raising a blazing golden championship trophy with manga speed lines',
      at: 'A11y-Zero projecting a holographic screen reader accessibility tree and Braille matrix',
      wcag: 'A11y-Zero deflecting a keyboard trap glitch with a glowing semantic button energy shield',
      laws: 'A11y-Zero unfurling a golden ADA, Section 508, and PDF/UA treaty scroll with a justice gavel'
    },
    pepTalks: [
      'BATTLE RULE #1: Never suppress focus outlines without a high-contrast 3:1 replacement indicator!!',
      'SHONEN SECRET: Automated scanners only catch ~30-40% of bugs—real heroes test with screen readers!!',
      'COMPLIANCE OVERDRIVE: Undue burden never excuses an organization from providing alternative access!!'
    ]
  }
};

/**
 * Resolves the appropriate mascot illustration, scene category, badge, and contextual caption
 * to accompany any question or scenario across all A11y Arcade game modes.
 */
export function resolveQuestionMascot(question, skin = 'arcade') {
  const mascot = THEME_MASCOTS[skin] || THEME_MASCOTS.arcade;
  if (!question) {
    return {
      mascot,
      sceneKey: 'hero',
      imageUrl: mascot.images.hero,
      fallbackUrl: mascot.images.hero,
      alt: mascot.altText.hero,
      badge: '🎮 A11Y ARCADE',
      sceneTitle: `${mascot.name} Ready`,
      caption: mascot.tagline
    };
  }

  const rawText = [
    question.question,
    question.title,
    question.topic,
    question.domainName,
    question.context,
    question.description,
    question.section_id,
    question.certification,
    ...(Array.isArray(question.tags) ? question.tags : [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Determine the best matching visual scene ('at' | 'wcag' | 'laws') and specific topic callout
  if (
    rawText.includes('screen reader') ||
    rawText.includes('nvda') ||
    rawText.includes('jaws') ||
    rawText.includes('voiceover') ||
    rawText.includes('talkback') ||
    rawText.includes('braille') ||
    rawText.includes('switch') ||
    rawText.includes('eye tracking') ||
    rawText.includes('sip-and-puff') ||
    rawText.includes('speech recognition') ||
    rawText.includes('assistive tech')
  ) {
    return {
      mascot,
      sceneKey: 'at',
      imageUrl: mascot.images.at,
      fallbackUrl: mascot.images.hero,
      alt: mascot.altText.at,
      badge: '🎧 ASSISTIVE TECH LAB',
      sceneTitle: `${mascot.name} • AT & Screen Reader Check`,
      caption: 'Inspecting how assistive technologies, screen readers, and Braille displays interpret programmatic semantics.'
    };
  }

  if (
    rawText.includes('medical model') ||
    rawText.includes('social model') ||
    rawText.includes('biopsychosocial') ||
    rawText.includes('charity model') ||
    rawText.includes('etiquette') ||
    rawText.includes('people-first') ||
    rawText.includes('demographic') ||
    rawText.includes('deaf') ||
    rawText.includes('blind') ||
    rawText.includes('cognitive') ||
    rawText.includes('seizure') ||
    rawText.includes('vestibular') ||
    rawText.includes('motor') ||
    rawText.includes('neurodiver')
  ) {
    return {
      mascot,
      sceneKey: 'at',
      imageUrl: mascot.images.at,
      fallbackUrl: mascot.images.hero,
      alt: mascot.altText.at,
      badge: '♿ DISABILITY & INCLUSION',
      sceneTitle: `${mascot.name} • Human-Centered Inclusion`,
      caption: 'Evaluating human functional diversity, adaptive strategies, and barrier-free environmental design.'
    };
  }

  if (
    rawText.includes('pdf') ||
    rawText.includes('acrobat') ||
    rawText.includes('tag tree') ||
    rawText.includes('reading order') ||
    rawText.includes('matterhorn') ||
    rawText.includes('artifact') ||
    rawText.includes('indesign') ||
    rawText.includes('word') ||
    rawText.includes('powerpoint') ||
    rawText.includes('epub') ||
    rawText.includes('ocr') ||
    String(question.certification || '').toUpperCase() === 'ADS'
  ) {
    return {
      mascot,
      sceneKey: 'laws',
      imageUrl: mascot.images.laws,
      fallbackUrl: mascot.images.hero,
      alt: mascot.altText.laws,
      badge: '📄 DOCUMENT ARCHITECTURE',
      sceneTitle: `${mascot.name} • PDF/UA & Document Audit`,
      caption: 'Verifying structural tags, logical reading order, table headers, and accessible document exports.'
    };
  }

  if (
    rawText.includes('ada ') ||
    rawText.includes('title ii') ||
    rawText.includes('title iii') ||
    rawText.includes('section 508') ||
    rawText.includes('section 504') ||
    rawText.includes('en 301 549') ||
    rawText.includes('crpd') ||
    rawText.includes('marrakesh') ||
    rawText.includes('vpat') ||
    rawText.includes('acr') ||
    rawText.includes('procurement') ||
    rawText.includes('maturity') ||
    rawText.includes('governance') ||
    rawText.includes('undue burden') ||
    rawText.includes('legal') ||
    rawText.includes('law') ||
    rawText.includes('treaty') ||
    question.domain === 3
  ) {
    return {
      mascot,
      sceneKey: 'laws',
      imageUrl: mascot.images.laws,
      fallbackUrl: mascot.images.hero,
      alt: mascot.altText.laws,
      badge: '⚖️ LAWS & PROCUREMENT',
      sceneTitle: `${mascot.name} • Compliance & Policy Radar`,
      caption: 'Cross-examining international ICT standards, civil rights mandates, VPATs, and governance policies.'
    };
  }

  if (
    rawText.includes('contrast') ||
    rawText.includes('color') ||
    rawText.includes('1.4.3') ||
    rawText.includes('1.4.11') ||
    rawText.includes('reflow') ||
    rawText.includes('resize') ||
    rawText.includes('target size') ||
    rawText.includes('focus') ||
    rawText.includes('keyboard') ||
    rawText.includes('tabindex') ||
    rawText.includes('aria') ||
    rawText.includes('role=') ||
    rawText.includes('html') ||
    rawText.includes('wcag') ||
    rawText.includes('universal design') ||
    rawText.includes('udl')
  ) {
    return {
      mascot,
      sceneKey: 'wcag',
      imageUrl: mascot.images.wcag,
      fallbackUrl: mascot.images.hero,
      alt: mascot.altText.wcag,
      badge: '🧩 WCAG & UNIVERSAL DESIGN',
      sceneTitle: `${mascot.name} • Technical Spec Scanner`,
      caption: 'Analyzing WCAG 2.2 success criteria, WAI-ARIA patterns, keyboard operability, and Universal Design.'
    };
  }

  // Domain fallback
  if (question.domain === 1) {
    return {
      mascot,
      sceneKey: 'at',
      imageUrl: mascot.images.at,
      fallbackUrl: mascot.images.hero,
      alt: mascot.altText.at,
      badge: '🎧 DOMAIN 1 DIAGNOSTIC',
      sceneTitle: `${mascot.name} • Assistive Tech & Foundations`,
      caption: 'Evaluating core accessibility foundations, user needs, and assistive technology interoperability.'
    };
  }

  return {
    mascot,
    sceneKey: 'wcag',
    imageUrl: mascot.images.wcag,
    fallbackUrl: mascot.images.hero,
    alt: mascot.altText.wcag,
    badge: '🧩 ACCESSIBILITY CHALLENGE',
    sceneTitle: `${mascot.name} • Field Assessment`,
    caption: 'Applying IAAP Body of Knowledge standards to real-world digital and built-environment scenarios.'
  };
}
