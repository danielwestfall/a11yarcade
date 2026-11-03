import fs from 'fs';
import { LEARNING_MODULES } from '../client/src/data/learningModulesData.js';

const tax = JSON.parse(fs.readFileSync('data/quiz-bank/taxonomy.json', 'utf8'));
const cpacc = tax.certifications.find(c => c.id === 'CPACC');

const liveModules = LEARNING_MODULES.filter(m => m.cert === 'CPACC');
const liveSectionMap = new Map();
liveModules.forEach(m => {
  liveSectionMap.set(m.sectionId, m);
});

console.log('=== CPACC SECTIONS STATUS ===');
let missing = [];
cpacc.domains.forEach(d => {
  console.log(`\nDomain: ${d.id} (${d.label})`);
  d.sections.forEach(s => {
    const live = liveSectionMap.get(s.id);
    if (live) {
      console.log(`  [LIVE ✓] ${s.id}: ${s.label} -> "${live.title}" (${live.interactiveType})`);
    } else {
      console.log(`  [MISSING ✗] ${s.id}: ${s.label}`);
      missing.push(s);
    }
  });
});

console.log('\nTotal Missing CPACC Sections:', missing.length);
console.log(JSON.stringify(missing, null, 2));
