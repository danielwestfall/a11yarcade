// scripts/verify_skin_wcag_aaa_contrast.cjs
// Forensic WCAG 2.2 AAA mathematical contrast ratio verification script

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  if (clean.length === 6) {
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  } else if (clean.length === 3) {
    const r = (clean[0] + clean[0]);
    const g = (clean[1] + clean[1]);
    const b = (clean[2] + clean[2]);
    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16)
    };
  }
  throw new Error(`Invalid hex color: ${hex}`);
}

function getLuminance(rgb) {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    const val = v / 255;
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hexToRgb(hex1));
  const lum2 = getLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const auditPairs = [
  // ==========================================
  // SKIN 1: KAWAII PASTEL ARCADE (HELLO KITTY STYLE)
  // ==========================================
  // --- Kawaii Light Mode ---
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Light Mode',
    element: 'Primary Text on Canvas (#4a044e on #fff5f8)',
    fg: '#4a044e',
    bg: '#fff5f8',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Light Mode',
    element: 'Primary Text on White Card (#4a044e on #ffffff)',
    fg: '#4a044e',
    bg: '#ffffff',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Light Mode',
    element: 'Secondary Text on Canvas (#701a35 on #fff5f8)',
    fg: '#701a35',
    bg: '#fff5f8',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Light Mode',
    element: 'Secondary Text on White Card (#701a35 on #ffffff)',
    fg: '#701a35',
    bg: '#ffffff',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Light Mode',
    element: 'Muted Text on White Card (#831843 on #ffffff)',
    fg: '#831843',
    bg: '#ffffff',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Light Mode',
    element: 'Primary Button White Text on Strawberry Red (#ffffff on #9f1239)',
    fg: '#ffffff',
    bg: '#9f1239',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Light Mode',
    element: 'Secondary Button Dark Text on Soft Pink (#4a044e on #ffe4ec)',
    fg: '#4a044e',
    bg: '#ffe4ec',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Light Mode',
    element: 'Mint Green Action White Text (#ffffff on #065f46)',
    fg: '#ffffff',
    bg: '#065f46',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Light Mode',
    element: 'Card Deep Rose Border on Canvas (#db2777 on #fff5f8)',
    fg: '#db2777',
    bg: '#fff5f8',
    target: 'AAA UI Component',
    minRatio: 3.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Light Mode',
    element: 'Focus Ring against Canvas (#be185d on #fff5f8)',
    fg: '#be185d',
    bg: '#fff5f8',
    target: 'AAA Focus Indicator',
    minRatio: 3.0
  },

  // --- Kawaii Dark Mode ---
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Dark Mode',
    element: 'Primary Text on Dark Void (#fdf2f8 on #15091a)',
    fg: '#fdf2f8',
    bg: '#15091a',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Dark Mode',
    element: 'Primary Text on Surface Card (#fdf2f8 on #221029)',
    fg: '#fdf2f8',
    bg: '#221029',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Dark Mode',
    element: 'Secondary Sakura Text on Dark Void (#fbcfe8 on #15091a)',
    fg: '#fbcfe8',
    bg: '#15091a',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Dark Mode',
    element: 'Muted Rose Text on Dark Void (#f472b6 on #15091a)',
    fg: '#f472b6',
    bg: '#15091a',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Dark Mode',
    element: 'Primary Button Dark Text on Soft Rose Pink (#15091a on #f472b6)',
    fg: '#15091a',
    bg: '#f472b6',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'Dark Mode',
    element: 'Lavender Card Border against Dark Canvas (#a855f7 on #15091a)',
    fg: '#a855f7',
    bg: '#15091a',
    target: 'AAA UI Component',
    minRatio: 3.0
  },

  // --- Kawaii High Contrast Mode ---
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'High Contrast',
    element: 'Pure White Text on Stark Black (#ffffff on #000000)',
    fg: '#ffffff',
    bg: '#000000',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'High Contrast',
    element: 'Hot Pink Subtext on Stark Black (#ff69b4 on #000000)',
    fg: '#ff69b4',
    bg: '#000000',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Kawaii Pastel Arcade',
    mode: 'High Contrast',
    element: 'Electric Yellow Focus Ring on Stark Black (#ffff00 on #000000)',
    fg: '#ffff00',
    bg: '#000000',
    target: 'AAA Focus Indicator',
    minRatio: 3.0
  },

  // ==========================================
  // SKIN 2: ANIME & COLOR GRAPHIC NOVEL
  // ==========================================
  // --- Anime Light Mode ---
  {
    skin: 'Anime & Manga Action',
    mode: 'Light Mode',
    element: 'Pure Manga Ink on Newsprint (#09090b on #faf7f0)',
    fg: '#09090b',
    bg: '#faf7f0',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Light Mode',
    element: 'Pure Manga Ink on White Card (#09090b on #ffffff)',
    fg: '#09090b',
    bg: '#ffffff',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Light Mode',
    element: 'Secondary Ink on Newsprint (#18181b on #faf7f0)',
    fg: '#18181b',
    bg: '#faf7f0',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Light Mode',
    element: 'Shonen Vermilion Button White Text (#ffffff on #991b1b)',
    fg: '#ffffff',
    bg: '#991b1b',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Light Mode',
    element: 'Manga Cobalt Action Button White Text (#ffffff on #1e40af)',
    fg: '#ffffff',
    bg: '#1e40af',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Light Mode',
    element: 'Action Amber Button White Text (#ffffff on #78350f)',
    fg: '#ffffff',
    bg: '#78350f',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Light Mode',
    element: 'Emerald Jutsu Button White Text (#ffffff on #064e3b)',
    fg: '#ffffff',
    bg: '#064e3b',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Light Mode',
    element: 'Comic Heavy 3px Ink Border on Newsprint (#111827 on #faf7f0)',
    fg: '#111827',
    bg: '#faf7f0',
    target: 'AAA UI Component',
    minRatio: 3.0
  },

  // --- Anime Dark Mode ---
  {
    skin: 'Anime & Manga Action',
    mode: 'Dark Mode',
    element: 'Pure White Text on Cyber Midnight (#ffffff on #080c16)',
    fg: '#ffffff',
    bg: '#080c16',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Dark Mode',
    element: 'Electric Manga Yellow Text on Cyber Midnight (#fef08a on #080c16)',
    fg: '#fef08a',
    bg: '#080c16',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Dark Mode',
    element: 'Cyan Comic Muted Text on Cyber Midnight (#93c5fd on #080c16)',
    fg: '#93c5fd',
    bg: '#080c16',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Dark Mode',
    element: 'Cyan Cel Border on Cyber Midnight (#38bdf8 on #080c16)',
    fg: '#38bdf8',
    bg: '#080c16',
    target: 'AAA UI Component',
    minRatio: 3.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'Dark Mode',
    element: 'Electric Yellow Focus Ring on Cyber Midnight (#facc15 on #080c16)',
    fg: '#facc15',
    bg: '#080c16',
    target: 'AAA Focus Indicator',
    minRatio: 3.0
  },

  // --- Anime High Contrast Mode ---
  {
    skin: 'Anime & Manga Action',
    mode: 'High Contrast',
    element: 'Pure White Comic Text on Stark Black (#ffffff on #000000)',
    fg: '#ffffff',
    bg: '#000000',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'High Contrast',
    element: 'Neon Screentone Yellow Text on Stark Black (#ffff00 on #000000)',
    fg: '#ffff00',
    bg: '#000000',
    target: 'AAA Normal Text',
    minRatio: 7.0
  },
  {
    skin: 'Anime & Manga Action',
    mode: 'High Contrast',
    element: 'White Comic Ink Border on Stark Black (#ffffff on #000000)',
    fg: '#ffffff',
    bg: '#000000',
    target: 'AAA UI Component',
    minRatio: 3.0
  }
];

console.log('='.repeat(80));
console.log('⚔️  A11Y ARCADE: FORENSIC WCAG 2.2 AAA CONTRAST COMPLIANCE AUDIT');
console.log('='.repeat(80));

let passCount = 0;
let failCount = 0;

for (const item of auditPairs) {
  const ratio = getContrastRatio(item.fg, item.bg);
  const passed = ratio >= item.minRatio;
  if (passed) {
    passCount++;
  } else {
    failCount++;
  }
  const statusIcon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${statusIcon} [${item.skin} | ${item.mode}]`);
  console.log(`   Element:  ${item.element}`);
  console.log(`   Colors:   FG: ${item.fg}  |  BG: ${item.bg}`);
  console.log(`   Ratio:    ${ratio.toFixed(2)}:1 (Required min: ${item.minRatio}:1 - ${item.target})\n`);
}

console.log('='.repeat(80));
console.log(`AUDIT COMPLETE: ${passCount} Passed, ${failCount} Failed.`);
if (failCount === 0) {
  console.log('🏆 100% WCAG 2.2 LEVEL AAA CONTRAST CONFORMANCE CERTIFIED!');
} else {
  console.error(`💥 ${failCount} contrast requirements failed.`);
  process.exit(1);
}
console.log('='.repeat(80));
