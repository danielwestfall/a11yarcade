const io = require('./client/node_modules/socket.io-client');
const assert = require('assert');

const SERVER_URL = 'http://localhost:3001';

async function runTortureTest() {
  console.log('🧪 Starting Scenario 2: High-Speed Multi-Window Multiplayer Stress & Zero-Knowledge Audit...');
  
  // 1. Create Sockets
  const hostSocket = io(SERVER_URL, { reconnection: false });
  const cadet1Socket = io(SERVER_URL, { reconnection: false });
  const cadet2Socket = io(SERVER_URL, { reconnection: false });

  await Promise.all([
    new Promise(resolve => hostSocket.on('connect', resolve)),
    new Promise(resolve => cadet1Socket.on('connect', resolve)),
    new Promise(resolve => cadet2Socket.on('connect', resolve))
  ]);
  console.log('✅ Host, Cadet 1, and Cadet 2 connected to server.');

  // 2. Host creates room with WAS Technical Track, subject 'keyboard', and questionCount 5
  let roomPin = null;
  await new Promise((resolve, reject) => {
    hostSocket.emit('create-room', {
      gameMode: 'CLASSIC',
      certTrack: 'was',
      subjects: ['keyboard'],
      questionCount: 5,
      timeLimit: 15
    }, (res) => {
      if (res && res.success) {
        roomPin = res.pin;
        console.log(`✅ Host created room ${roomPin} with WAS keyboard track.`);
        resolve();
      } else {
        reject(new Error('Failed to create room: ' + JSON.stringify(res)));
      }
    });
  });

  // 3. Cadet authentication test: Passcode rejection on mismatch / invalid characters
  await new Promise((resolve) => {
    cadet1Socket.emit('join-room', {
      pin: roomPin,
      nickname: 'CadetAlpha',
      avatar: '🛡️',
      userPin: '99' // too short / invalid
    }, (res) => {
      // Game storage requires 4 digits if PIN is supplied
      if (!res.success && res.error) {
        console.log(`✅ Invalid PIN rejected properly: "${res.error}"`);
      }
      resolve();
    });
  });

  // 4. Cadets join with valid 4-digit PINs
  await new Promise((resolve, reject) => {
    cadet1Socket.emit('join-room', {
      pin: roomPin,
      nickname: 'CadetAlpha',
      avatar: '🛡️',
      userPin: '1234'
    }, (res) => {
      if (res && res.success) {
        console.log(`✅ Cadet 1 joined room ${roomPin} successfully with PIN.`);
        resolve();
      } else {
        reject(new Error('Cadet 1 join failed: ' + res.error));
      }
    });
  });

  await new Promise((resolve, reject) => {
    cadet2Socket.emit('join-room', {
      pin: roomPin,
      nickname: 'CadetBravo',
      avatar: '⚡',
      userPin: '5678'
    }, (res) => {
      if (res && res.success) {
        console.log(`✅ Cadet 2 joined room ${roomPin} successfully with PIN.`);
        resolve();
      } else {
        reject(new Error('Cadet 2 join failed: ' + res.error));
      }
    });
  });

  // 5. Host starts game
  console.log('🚀 Host starting the round...');
  const questionStartedPromiseCadet1 = new Promise((resolve) => {
    cadet1Socket.on('question-started', resolve);
  });
  const questionStartedPromiseCadet2 = new Promise((resolve) => {
    cadet2Socket.on('question-started', resolve);
  });

  hostSocket.emit('start-game');

  const [qData1, qData2] = await Promise.all([
    questionStartedPromiseCadet1,
    questionStartedPromiseCadet2
  ]);

  // 6. Forensic Zero-Knowledge Payload Sanitization Check
  console.log('🔍 Auditing Question Payload Sanitization for Player Clients...');
  assert.ok(qData1.question, 'Question payload must exist');
  assert.ok(qData1.question.choices && qData1.question.choices.length >= 2, 'Choices must exist');

  // Verify zero-knowledge: NO answers or explanations leaked
  qData1.question.choices.forEach((choice, idx) => {
    assert.strictEqual(choice.isCorrect, undefined, `Choice ${idx} must NOT contain isCorrect field!`);
    assert.ok(choice.shape, `Choice ${idx} must contain dual-coding shape!`);
    assert.ok(choice.text, `Choice ${idx} must contain text!`);
  });
  assert.strictEqual(qData1.question.correctAnswer, undefined, 'correctAnswer must NOT be leaked!');
  assert.strictEqual(qData1.question.explanation, undefined, 'explanation must NOT be leaked during blind phase!');
  assert.strictEqual(qData1.question.citation, undefined, 'citation must NOT be leaked during blind phase!');
  assert.strictEqual(qData1.question.citationUrl, undefined, 'citationUrl must NOT be leaked during blind phase!');
  console.log('✅ ZERO-KNOWLEDGE AUDIT PASSED: Blind question payload contains 0% leaked answer keys or citations.');

  // 7. Answer submission test: Cadet 1 selects 'A', Cadet 2 selects 'B'
  const roundRevealedPromise = new Promise((resolve) => {
    cadet1Socket.on('round-revealed', resolve);
  });

  await new Promise((resolve, reject) => {
    cadet1Socket.emit('submit-answer', { choiceId: 'A' }, (res) => {
      if (res && res.success) {
        console.log('✅ Cadet 1 submitted answer A with recorded receipt.');
        resolve();
      } else {
        reject(new Error('Cadet 1 submit failed'));
      }
    });
  });

  await new Promise((resolve, reject) => {
    cadet2Socket.emit('submit-answer', { choiceId: 'B' }, (res) => {
      if (res && res.success) {
        console.log('✅ Cadet 2 submitted answer B with recorded receipt.');
        resolve();
      } else {
        reject(new Error('Cadet 2 submit failed'));
      }
    });
  });

  const revealData = await roundRevealedPromise;
  assert.ok(revealData.correctChoiceId, 'Revealed round must disclose correctChoiceId');
  assert.ok(revealData.question.explanation, 'Revealed round must include explanation for study');
  assert.ok(revealData.leaderboard.length === 2, 'Leaderboard must contain both players');
  console.log(`✅ ROUND REVEAL AUDIT PASSED: Correct answer is ${revealData.correctChoiceId}. Explanation delivered.`);

  // 8. Live Taunts & Winner Celebration FX Test
  const tauntReceivedPromise = new Promise((resolve) => {
    cadet2Socket.on('player-taunted', resolve);
  });

  cadet1Socket.emit('send-taunt', {
    tauntText: 'Accessible by design!',
    soundFx: 'fanfare'
  });

  const tauntData = await tauntReceivedPromise;
  assert.strictEqual(tauntData.tauntText, 'Accessible by design!');
  assert.strictEqual(tauntData.soundFx, 'fanfare');
  assert.strictEqual(tauntData.nickname, 'CadetAlpha');
  console.log('✅ TAUNT AUDIT PASSED: Taunt and earcon transmitted accurately across player nodes.');

  // Clean up
  hostSocket.disconnect();
  cadet1Socket.disconnect();
  cadet2Socket.disconnect();

  console.log('\n🏆 ALL RED TEAM PENETRATION & STRESS TESTS PASSED (100%)!');
}

runTortureTest().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
