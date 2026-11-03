import fs from 'fs';
import { LEARNING_MODULES } from '../client/src/data/learningModulesData.js';

const tax = JSON.parse(fs.readFileSync('data/quiz-bank/taxonomy.json', 'utf8'));

console.log('===========================================================');
console.log('       A11Y ARCADE: COMPLETE CERTIFICATION AUDIT');
console.log('===========================================================');

tax.certifications.forEach(cert => {
  const certMods = LEARNING_MODULES.filter(m => m.cert === cert.id);
  const liveSectionIds = new Set(certMods.map(m => m.sectionId));
  
  let totalSections = 0;
  let liveSections = 0;
  let missing = [];

  cert.domains.forEach(d => {
    d.sections.forEach(s => {
      totalSections++;
      if (liveSectionIds.has(s.id)) {
        liveSections++;
      } else {
        missing.push({ cert: cert.id, domain: d.id, sectionId: s.id, label: s.label });
      }
    });
  });

  const pct = Math.round((liveSections / totalSections) * 100);
  console.log(`\n🏆 ${cert.id} (${cert.title}): ${liveSections}/${totalSections} Sections Complete (${pct}%)`);
  if (missing.length === 0) {
    console.log(`   🎉 100% COVERAGE! All ${totalSections} sections have dedicated teaching modules & labs!`);
  } else {
    console.log(`   Pending Sections (${missing.length}):`);
    missing.forEach(m => console.log(`     - [${m.sectionId}]: ${m.label}`));
  }
});
