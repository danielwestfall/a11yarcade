// Accessible, Humorous, strictly SFW Taunts & Celebration Soundboard Definitions
// Designed for A11y Arcade round champions and challenge winners.

export const TAUNT_QUOTES = [
  {
    text: "Is that your final answer, or did your keyboard auto-correct to failure?",
    soundFx: "boing",
    tag: "Keyboard Navigation"
  },
  {
    text: "I'd explain WCAG 2.2 to you, but I don't have enough crayons.",
    soundFx: "whistle",
    tag: "Design Standards"
  },
  {
    text: "Call an ambulance! ... But not for me!",
    soundFx: "airhorn",
    tag: "Sudden Turnabout"
  },
  {
    text: "My screen reader just announced: Critical Skill Issue detected in your quadrant.",
    soundFx: "sad-trombone",
    tag: "Assistive Tech"
  },
  {
    text: "You just got hit with a 4.5:1 contrast ratio of pure, unadulterated defeat!",
    soundFx: "boxing-bell",
    tag: "Color Contrast"
  },
  {
    text: "Brendon, you didn't study? Good. Studying is cheating anyway.",
    soundFx: "whistle",
    tag: "Coach McGuirk"
  },
  {
    text: "I don't always ace CPACC questions, but when I do, I make it look completely effortless.",
    soundFx: "fanfare",
    tag: "Arcade Swagger"
  },
  {
    text: "Did someone order an express delivery of CPACC Body of Knowledge excellence?",
    soundFx: "coins",
    tag: "Certification Master"
  },
  {
    text: "You're playing checkers while I'm navigating with full ARIA landmark landmarks.",
    soundFx: "whistle",
    tag: "Semantic Structure"
  },
  {
    text: "Someone open a GitHub issue, because my score is officially breaking the layout!",
    soundFx: "airhorn",
    tag: "Bug Report"
  },
  {
    text: "That question was so easy, even my un-labeled form inputs saw it coming.",
    soundFx: "boing",
    tag: "Form Controls"
  },
  {
    text: "Tab, tab, ENTER straight into 1st place! Don't forget your focus indicator on the way down.",
    soundFx: "applause",
    tag: "Focus State"
  },
  {
    text: "Don't feel bad. Failure is just an accessible stepping stone to continuous improvement.",
    soundFx: "sad-trombone",
    tag: "Empathetic Coaching"
  },
  {
    text: "I'm not saying I carried this round, but my back has an aria-label: 'Carrying the Team'.",
    soundFx: "applause",
    tag: "Team Synergy"
  },
  {
    text: "Zero automated flags, zero manual barriers, one hundred percent certified triumph!",
    soundFx: "fanfare",
    tag: "Compliance Audit"
  }
];

export const SOUNDBOARD_EFFECTS = [
  {
    id: "airhorn",
    name: "Airhorn Blast",
    icon: "🎺",
    desc: "Arcade hype horns (triple burst)",
    color: "#ef4444"
  },
  {
    id: "fanfare",
    name: "Victory Fanfare",
    icon: "🥇",
    desc: "Triumphant golden melody",
    color: "#f59e0b"
  },
  {
    id: "applause",
    name: "Crowd Ovation",
    icon: "👏",
    desc: "Roaring stadium cheers",
    color: "#10b981"
  },
  {
    id: "coins",
    name: "Coin Shower",
    icon: "🪙",
    desc: "Jackpot casino cascade",
    color: "#facc15"
  },
  {
    id: "whistle",
    name: "Coach Whistle",
    icon: "🧢",
    desc: "Coach McGuirk referee drill",
    color: "#38bdf8"
  },
  {
    id: "boxing-bell",
    name: "Championship Bell",
    icon: "🔔",
    desc: "Knockout ding-ding-ding",
    color: "#c084fc"
  },
  {
    id: "boing",
    name: "Cartoon Boing",
    icon: "🌀",
    desc: "Silly spring bounce",
    color: "#ec4899"
  },
  {
    id: "sad-trombone",
    name: "Sad Trombone",
    icon: "🥔",
    desc: "Wah-wah for runners-up",
    color: "#fb923c"
  }
];

/**
 * Get a random humorous taunt.
 * @returns {{ text: string, soundFx: string, tag: string }}
 */
export function getRandomTaunt() {
  const idx = Math.floor(Math.random() * TAUNT_QUOTES.length);
  return TAUNT_QUOTES[idx];
}
