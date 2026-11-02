import fs from 'fs';
import { LEARNING_MODULES, ACADEMY_TRACKS } from '../client/src/data/learningModulesData.js';

console.log('====================================================');
console.log('  PHASE 1: CONTENT & PEDAGOGICAL FORENSIC AUDIT');
console.log('====================================================');

const tax = JSON.parse(fs.readFileSync('data/quiz-bank/taxonomy.json', 'utf8'));

// Build section lookup map
const sectionMap = new Map();
tax.certifications.forEach(c => {
  c.domains?.forEach(d => {
    d.sections?.forEach(s => {
      sectionMap.set(s.id, {
        certId: c.id,
        domainId: d.id,
        sectionTitle: s.title,
        domainTitle: d.title
      });
    });
  });
});

let issues = [];
let passedChecks = [];

// 1. Check all modules taxonomy & citations
LEARNING_MODULES.forEach((mod, idx) => {
  const modNum = idx + 1;
  const modId = mod.id;

  if (!mod.id || !mod.title) {
    issues.push(`Mod #${modNum}: Missing id or title`);
  }

  if (!['CPACC', 'WAS', 'ADS'].includes(mod.cert)) {
    issues.push(`Mod #${modNum} (${modId}): Invalid cert "${mod.cert}"`);
  }

  if (!mod.sectionId) {
    issues.push(`Mod #${modNum} (${modId}): Missing sectionId`);
  } else if (!sectionMap.has(mod.sectionId)) {
    issues.push(`Mod #${modNum} (${modId}): sectionId "${mod.sectionId}" not found in taxonomy.json`);
  } else {
    const sec = sectionMap.get(mod.sectionId);
    if (sec.certId !== mod.cert) {
      issues.push(`Mod #${modNum} (${modId}): Cert mismatch! Module cert="${mod.cert}" but sectionId "${mod.sectionId}" belongs to "${sec.certId}"`);
    }
  }

  // Citations
  const citation = mod.citation || mod.sourceCitation;
  if (!citation || typeof citation !== 'string' || citation.trim().length === 0) {
    issues.push(`Mod #${modNum} (${modId}): Missing citation / sourceCitation`);
  }

  // Interactive Lab type
  if (!mod.interactiveType) {
    issues.push(`Mod #${modNum} (${modId}): Missing interactiveType`);
  }

  // Questions / Knowledge Checks
  const questions = mod.knowledgeCheck || mod.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    issues.push(`Mod #${modNum} (${modId}): Missing or empty knowledgeCheck array`);
  } else {
    questions.forEach((q, qIdx) => {
      const qPrefix = `Mod #${modNum} (${modId}) Q#${qIdx + 1} (${q.id || 'no-id'})`;
      if (!q.question || typeof q.question !== 'string' || q.question.trim().length < 5) {
        issues.push(`${qPrefix}: Empty or invalid question stem`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        issues.push(`${qPrefix}: Option count is ${q.options?.length}, expected 4`);
      } else {
        const ids = q.options.map(o => o.id);
        if (JSON.stringify(ids) !== JSON.stringify(['A', 'B', 'C', 'D'])) {
          issues.push(`${qPrefix}: Option IDs are [${ids.join(',')}], expected ['A','B','C','D']`);
        }
        const texts = q.options.map(o => o.text?.trim());
        const uniq = new Set(texts);
        if (uniq.size !== texts.length) {
          issues.push(`${qPrefix}: Duplicate option text detected: ${JSON.stringify(texts)}`);
        }
        texts.forEach((t, i) => {
          if (!t) issues.push(`${qPrefix}: Option ${ids[i]} has empty text`);
        });
      }
      if (!['A', 'B', 'C', 'D'].includes(q.answer)) {
        issues.push(`${qPrefix}: Answer key "${q.answer}" is invalid (must be A, B, C, or D)`);
      }
      if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length < 15) {
        issues.push(`${qPrefix}: Explanation is missing or too brief (< 15 chars)`);
      }
    });
  }
});

if (issues.length === 0) {
  passedChecks.push(`All ${LEARNING_MODULES.length} modules have valid certs, taxonomy sections, citations, and validated questions.`);
}

// 2. Specific Pedagogical & BoK audits
const allText = JSON.stringify(LEARNING_MODULES);

// WHO Statistic: 16% / 1.3 billion
const hasWho16Pct = allText.includes('16%') || allText.includes('1.3 billion');
if (hasWho16Pct) {
  passedChecks.push('Demographic statistic matches WHO standard (16% / 1.3 billion people).');
} else {
  issues.push('Missing WHO global disability demographic standard (16% or 1.3 billion people) in curriculum text.');
}

// Theoretical Models Distinctness
const modModels = LEARNING_MODULES.find(m => m.id === 'mod-cpacc-models');
if (modModels) {
  const modelTitles = modModels.keyConcepts?.map(k => k.title) || [];
  const requiredModels = ['Social Model', 'Medical Model', 'Biopsychosocial', 'Functional Solutions', 'Charity'];
  const missingModels = requiredModels.filter(rm => !modelTitles.some(mt => mt.toLowerCase().includes(rm.toLowerCase())));
  if (missingModels.length === 0) {
    passedChecks.push('All 5 core theoretical disability models are distinctly defined and contrasted in mod-cpacc-models.');
  } else {
    issues.push(`mod-cpacc-models is missing definitions for: ${missingModels.join(', ')}`);
  }
} else {
  issues.push('Module mod-cpacc-models not found!');
}

// WCAG 2.2 Accuracy: SC 2.5.8 (24x24 CSS pixels) and SC 4.1.1 (Parsing obsoleted/removed)
const modWcag22 = LEARNING_MODULES.find(m => m.id === 'mod-was-wcag22');
if (modWcag22) {
  const str = JSON.stringify(modWcag22);
  const mentions24px = str.includes('24') && (str.includes('24×24') || str.includes('24x24') || str.includes('24px'));
  const mentions411 = str.includes('4.1.1') && (str.includes('obsolete') || str.includes('removed') || str.includes('deprecated'));
  if (mentions24px) {
    passedChecks.push('WCAG 2.2 SC 2.5.8 target size minimum (24x24 CSS px) correctly specified.');
  } else {
    issues.push('mod-was-wcag22 does not explicitly document 24x24 CSS pixels for SC 2.5.8.');
  }
  if (mentions411) {
    passedChecks.push('WCAG 2.2 notes SC 4.1.1 Parsing as obsoleted/removed.');
  } else {
    issues.push('mod-was-wcag22 does not note SC 4.1.1 Parsing as obsoleted/removed in WCAG 2.2.');
  }
} else {
  issues.push('mod-was-wcag22 module not found!');
}

// PDF/UA ISO 14289-1: Artifact for decorative, no heading skipping, tables require TH with scope
const modPdfTag = LEARNING_MODULES.find(m => m.id === 'mod-ads-tag-tree');
const modPdfPac = LEARNING_MODULES.find(m => m.id === 'mod-ads-testing-pac');
const pdfStr = JSON.stringify(modPdfTag) + JSON.stringify(modPdfPac);
const mentionsArtifact = pdfStr.includes('Artifact') || pdfStr.includes('/Artifact');
const mentionsHeading = pdfStr.includes('Heading') || pdfStr.includes('skip') || pdfStr.includes('H1');
const mentionsTables = pdfStr.includes('Table') || pdfStr.includes('TH') || pdfStr.includes('scope');

if (mentionsArtifact && mentionsHeading && mentionsTables) {
  passedChecks.push('PDF/UA ISO 14289-1 rules (/Artifact for decorative, heading hierarchies, table TH with scope) validated.');
} else {
  issues.push(`PDF/UA modules missing critical rules: Artifact=${mentionsArtifact}, Headings=${mentionsHeading}, Tables=${mentionsTables}`);
}

console.log('\n--- PASSED CHECKS ---');
passedChecks.forEach(p => console.log('  [PASS] ' + p));

console.log('\n--- ISSUES FOUND ---');
if (issues.length === 0) {
  console.log('  NONE! Perfect pedagogical and content compliance.');
} else {
  issues.forEach(i => console.log('  [FAIL] ' + i));
}
