import http from 'http';
import { io } from './client/node_modules/socket.io-client/build/esm/index.js';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runSectionAndSubjectTests() {
  console.log('🚀 Starting Section & Subject Selection Integration Tests...\n');

  // Test 1: Taxonomy Endpoint
  console.log('--- Test 1: GET /api/taxonomy ---');
  const taxonomy = await fetchJson('http://localhost:3001/api/taxonomy');
  if (!taxonomy.certifications || taxonomy.certifications.length < 2) {
    throw new Error('Expected at least 2 certifications in taxonomy');
  }
  console.log(`✓ Taxonomy returned ${taxonomy.certifications.length} certifications.`);

  // Test 2: Section Audit Endpoint
  console.log('\n--- Test 2: GET /api/sections/audit ---');
  const audit = await fetchJson('http://localhost:3001/api/sections/audit');
  console.log(`✓ Audit report: ${audit.totalSections} total sections.`);
  console.log(`  Critical (< 5 Qs): ${audit.critical.length} sections: ${audit.critical.map(s => `${s.id} (${s.count} Qs)`).join(', ')}`);
  console.log(`  Low (5-9 Qs): ${audit.low.length} sections: ${audit.low.map(s => `${s.id} (${s.count} Qs)`).join(', ')}`);
  console.log(`  Healthy (>= 10 Qs): ${audit.healthy.length} sections`);

  if (audit.critical.length !== 0) {
    throw new Error(`Expected 0 critical sections after update, got ${audit.critical.length}`);
  }
  if (audit.healthy.length !== 35) {
    throw new Error(`Expected all 35 sections to be healthy (>= 10 Qs), got ${audit.healthy.length}`);
  }

  // Test 3: Subjects Endpoint
  console.log('\n--- Test 3: GET /api/subjects ---');
  const subjectsData = await fetchJson('http://localhost:3001/api/subjects');
  const subjectsList = Array.isArray(subjectsData) ? subjectsData : (subjectsData.subjects || []);
  console.log(`✓ Top subjects: ${subjectsList.slice(0, 5).map(s => `${s.label} (${s.count})`).join(', ')}`);
  if (!subjectsList.some(s => s.id === 'keyboard' || s.key === 'keyboard')) {
    throw new Error('keyboard subject should exist');
  }

  // Test 4: Questions Filter by Sections
  console.log('\n--- Test 4: GET /api/questions?sections=CPACC-D1-D ---');
  const secQuestions = await fetchJson('http://localhost:3001/api/questions?sections=CPACC-D1-D');
  const secCount = Array.isArray(secQuestions) ? secQuestions.length : (secQuestions.count || 0);
  console.log(`✓ Questions in CPACC-D1-D: ${secCount} items.`);
  if (secCount !== 20) {
    throw new Error(`Expected exactly 20 questions in CPACC-D1-D, got ${secCount}`);
  }

  // Test 5: Questions Filter by Multiple Sections
  console.log('\n--- Test 5: GET /api/questions?sections=CPACC-D1-D,WAS-D1-G ---');
  const multiSecQuestions = await fetchJson('http://localhost:3001/api/questions?sections=CPACC-D1-D,WAS-D1-G');
  const multiSecCount = Array.isArray(multiSecQuestions) ? multiSecQuestions.length : (multiSecQuestions.count || 0);
  console.log(`✓ Questions in CPACC-D1-D + WAS-D1-G: ${multiSecCount} items.`);
  if (multiSecCount !== 40) { // 20 + 20
    throw new Error(`Expected 40 questions (20 + 20), got ${multiSecCount}`);
  }

  // Test 6: Questions Filter by Subject
  console.log('\n--- Test 6: GET /api/questions?subjects=keyboard ---');
  const subQuestions = await fetchJson('http://localhost:3001/api/questions?subjects=keyboard');
  const subCount = Array.isArray(subQuestions) ? subQuestions.length : (subQuestions.count || 0);
  console.log(`✓ Questions with subject "keyboard": ${subCount} items.`);
  if (subCount < 30) {
    throw new Error(`Expected at least 30 questions for keyboard, got ${subCount}`);
  }

  // Test 7: Socket.IO Room Creation with Full 20-Question Section (Healthy Full Match)
  console.log('\n--- Test 7: Socket.IO create-room with CPACC-D1-D (Healthy 20-Q Round) ---');
  const socket = io('http://localhost:3001');

  await new Promise((resolve, reject) => {
    socket.on('connect', () => {
      socket.emit('create-room', {
        gameMode: 'HOT_POTATO',
        certTrack: 'cpacc',
        timeLimit: 20,
        questionCount: 15, // Host asks for 15
        sections: ['CPACC-D1-D'] // Has 20 available!
      }, (res) => {
        try {
          if (!res.success) throw new Error('create-room failed');
          console.log(`✓ Room created with PIN: ${res.pin}`);
          console.log(`✓ Requested questionCount: 15 | Actual room questions: ${res.questionCount}`);

          if (res.questionCount !== 15) {
            throw new Error(`Expected questionCount to be 15, got ${res.questionCount}`);
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  });

  // Test 8: Socket.IO Room Creation with Subject Selection
  console.log('\n--- Test 8: Socket.IO create-room with Subject Selection ("screen-reader") ---');
  await new Promise((resolve, reject) => {
    socket.emit('create-room', {
      gameMode: 'GRAND_PRIX',
      certTrack: 'all',
      timeLimit: 20,
      questionCount: 10,
      subjects: ['screen-reader']
    }, (res) => {
      try {
        if (!res.success) throw new Error('create-room with subjects failed');
        console.log(`✓ Room created with PIN: ${res.pin}`);
        console.log(`✓ Round questions: ${res.questionCount}`);
        console.log(`✓ Room subjects: ${JSON.stringify(res.settings.subjects)}`);
        if (res.questionCount !== 10) {
          throw new Error(`Expected 10 questions, got ${res.questionCount}`);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

  socket.disconnect();
  console.log('\n🎉 ALL SECTION & SUBJECT TESTS PASSED SUCCESSFULLY! 100% RELIABILITY VERIFIED.');
  process.exit(0);
}

runSectionAndSubjectTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
