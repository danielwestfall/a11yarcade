import fs from 'fs';

const cpacc = JSON.parse(fs.readFileSync('./data/quiz-bank/cpacc.json', 'utf8'));
const was = JSON.parse(fs.readFileSync('./data/quiz-bank/was.json', 'utf8'));
const legacyCpacc = JSON.parse(fs.readFileSync('./data/questions.json', 'utf8'));
const legacyWas = JSON.parse(fs.readFileSync('./data/questions_was.json', 'utf8'));
const tax = JSON.parse(fs.readFileSync('./data/quiz-bank/taxonomy.json', 'utf8'));

function mapSection(q) {
  if (q.section_id) return q.section_id;
  if (!q.id) return 'UNKNOWN';
  if (q.id.startsWith('cpacc-d1')) {
    const num = parseInt(q.id.replace('cpacc-d1-', ''), 10);
    if (num <= 5) return 'CPACC-D1-A';
    if (num <= 10) return 'CPACC-D1-B';
    return 'CPACC-D1-C';
  } else if (q.id.startsWith('cpacc-d2')) {
    const num = parseInt(q.id.replace('cpacc-d2-', ''), 10);
    if (num <= 5) return 'CPACC-D2-E';
    if (num <= 10) return 'CPACC-D2-F';
    return 'CPACC-D2-C';
  } else if (q.id.startsWith('cpacc-d3')) {
    const num = parseInt(q.id.replace('cpacc-d3-', ''), 10);
    if (num <= 5) return 'CPACC-D3-D';
    return 'CPACC-D3-F';
  } else if (q.id.startsWith('was-d1')) return 'WAS-D1-B';
  else if (q.id.startsWith('was-d2')) return 'WAS-D2-B';
  else if (q.id.startsWith('was-d3')) return 'WAS-D3-A';
  return 'UNKNOWN';
}

const conceptCounts = {};
const sectionCounts = {};
const subjectCounts = {};

const allRawQuestions = [...cpacc, ...was, ...legacyCpacc, ...legacyWas];

allRawQuestions.forEach(q => {
  const s = mapSection(q);
  sectionCounts[s] = (sectionCounts[s] || 0) + 1;

  const concept = q.concept_id || q.topic || 'UNKNOWN';
  conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;

  if (q.tags && Array.isArray(q.tags)) {
    q.tags.forEach(t => {
      subjectCounts[t] = (subjectCounts[t] || 0) + 1;
    });
  } else if (q.topic) {
    const t = q.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    subjectCounts[t] = (subjectCounts[t] || 0) + 1;
  }
});

console.log('--- SECTION QUESTION COUNTS AUDIT ---');
let under5 = [];
let under10 = [];

tax.certifications.forEach(cert => {
  console.log(`\n=== ${cert.name} (${cert.id}) ===`);
  cert.domains.forEach(dom => {
    console.log(`\n  [${dom.id}] ${dom.label}`);
    dom.sections.forEach(sec => {
      const cnt = sectionCounts[sec.id] || 0;
      const status = cnt < 5 ? '🔴 CRITICAL (< 5)' : cnt < 10 ? '🟡 LOW (< 10)' : '🟢 HEALTHY (10+)';
      console.log(`    ${sec.id.padEnd(12)} : ${String(cnt).padStart(3)} items | ${status} | "${sec.label}"`);
      if (cnt < 5) under5.push({ id: sec.id, label: sec.label, count: cnt, cert: cert.id });
      else if (cnt < 10) under10.push({ id: sec.id, label: sec.label, count: cnt, cert: cert.id });
    });
  });
});

console.log('\n======================================');
console.log('SUMMARY OF SECTIONS WITH LOW QUESTION COUNTS:');
console.log('======================================');
console.log(`CRITICAL (< 5 questions - cannot support standard 5-question or 10-question round without repeating):`);
under5.forEach(u => console.log(`  - [${u.cert}] ${u.id}: only ${u.count} questions ("${u.label}")`));

console.log(`\nLOW (5-9 questions - can support 5-question round, but cannot support standard 10-question round):`);
under10.forEach(u => console.log(`  - [${u.cert}] ${u.id}: ${u.count} questions ("${u.label}")`));

// Check subjects / tags
console.log('\n======================================');
console.log('SUBJECT / TAG COUNTS (Top 25):');
console.log('======================================');
const sortedTags = Object.entries(subjectCounts).sort((a,b) => b[1] - a[1]);
sortedTags.slice(0, 30).forEach(([tag, count]) => {
  console.log(`  ${tag.padEnd(30)} : ${count} questions`);
});
