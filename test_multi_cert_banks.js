import { io } from './client/node_modules/socket.io-client/build/esm/index.js';
import http from 'http';

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

async function runTests() {
  console.log('--- 🧪 STARTING MULTI-CERTIFICATION QUESTION BANK TESTS ---');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // 1. REST Endpoint: Track filtering
  try {
    const allQuestions = await fetchJson('http://localhost:3001/api/questions?track=all');
    assert(Array.isArray(allQuestions) && allQuestions.length >= 500, `GET /api/questions?track=all returned ${allQuestions?.length} questions (expected >= 500)`);

    const cpaccQuestions = await fetchJson('http://localhost:3001/api/questions?track=cpacc');
    assert(Array.isArray(cpaccQuestions) && cpaccQuestions.length >= 300, `GET /api/questions?track=cpacc returned ${cpaccQuestions?.length} questions (expected >= 300)`);
    assert(cpaccQuestions.every(q => q.certification === 'CPACC'), 'All CPACC questions are tagged with certification: CPACC');

    const wasQuestions = await fetchJson('http://localhost:3001/api/questions?track=was');
    assert(Array.isArray(wasQuestions) && wasQuestions.length >= 200, `GET /api/questions?track=was returned ${wasQuestions?.length} questions (expected >= 200)`);
    assert(wasQuestions.every(q => q.certification === 'WAS'), 'All WAS questions are tagged with certification: WAS');

    const wasDomains = await fetchJson('http://localhost:3001/api/domains?track=was');
    const wasD1 = wasDomains.find(d => d.id === 1);
    const wasD2 = wasDomains.find(d => d.id === 2);
    assert(wasD1 && wasD1.name.includes('Creating Accessible Web Solutions'), 'WAS Domain 1 is correctly mapped');
    assert(wasD2 && wasD2.name.includes('Identifying Accessibility Issues'), 'WAS Domain 2 is correctly mapped');

    const cpaccDomains = await fetchJson('http://localhost:3001/api/domains?track=cpacc');
    const cpaccD1 = cpaccDomains.find(d => d.id === 1);
    assert(cpaccD1 && cpaccD1.name.includes('Disabilities'), 'CPACC Domain 1 is correctly mapped');
  } catch (err) {
    assert(false, `REST API check failed: ${err.message}`);
  }

  // 2. Socket.IO Room Creation with WAS Track
  await new Promise((resolve) => {
    const hostSocket = io('http://localhost:3001');

    hostSocket.on('connect', () => {
      hostSocket.emit('create-room', {
        gameMode: 'CLASSIC',
        certTrack: 'was',
        questionCount: 5,
        timeLimit: 20
      }, (res) => {
        assert(res.success === true, 'Host successfully created room with certTrack: was');
        assert(res.settings.certTrack === 'was', `Room settings correctly saved certTrack: was (got ${res.settings?.certTrack})`);

        // Now test Player Join
        const playerSocket = io('http://localhost:3001');
        playerSocket.on('connect', () => {
          playerSocket.emit('join-room', {
            pin: res.pin,
            nickname: 'CadetTestWAS',
            avatar: '🚀',
            userPin: '9988'
          }, (joinRes) => {
            assert(joinRes.success === true, 'Player joined WAS room');
            assert(joinRes.roomSettings && joinRes.roomSettings.certTrack === 'was', 'Player received roomSettings with certTrack: was');
            
            playerSocket.disconnect();
            hostSocket.disconnect();
            resolve();
          });
        });
      });
    });
  });

  // 3. Socket.IO Room Creation with CPACC Track
  await new Promise((resolve) => {
    const hostSocket = io('http://localhost:3001');

    hostSocket.on('connect', () => {
      hostSocket.emit('create-room', {
        gameMode: 'HOT_POTATO',
        certTrack: 'cpacc',
        questionCount: 8,
        timeLimit: 20
      }, (res) => {
        assert(res.success === true, 'Host successfully created room with certTrack: cpacc');
        assert(res.settings.certTrack === 'cpacc', `Room settings correctly saved certTrack: cpacc (got ${res.settings?.certTrack})`);
        
        hostSocket.disconnect();
        resolve();
      });
    });
  });

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} / ${total} TESTS PASSED`);
  console.log(`========================================`);

  process.exit(passed === total ? 0 : 1);
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
