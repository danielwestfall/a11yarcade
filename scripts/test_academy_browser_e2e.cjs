// Automated E2E verification for Digital Accessibility Learning Modules Academy
const { execSync } = require('child_process');

console.log('Running Phase 1 Audit...');
const auditOutput = execSync('node scripts/audit_academy.js', { encoding: 'utf8' });
console.log(auditOutput);

console.log('✅ Phase 1 complete.');
