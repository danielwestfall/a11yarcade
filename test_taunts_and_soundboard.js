// test_taunts_and_soundboard.js
// Verification suite for Live Room Taunts and Winner Celebration Soundboard

import assert from 'assert';
import { io } from './client/node_modules/socket.io-client/build/esm/index.js';
import { TAUNT_QUOTES, SOUNDBOARD_EFFECTS, getRandomTaunt } from './client/src/utils/taunts.js';

console.log('🏁 Starting Live Taunts & Winner Celebration Soundboard Test Suite...\n');

// 1. Verify Taunts & Soundboard Definitions
console.log('🧪 Test 1: Definitions & SFW Compliance Verification');
assert(TAUNT_QUOTES.length >= 10, 'Must have at least 10 taunts defined');
assert(SOUNDBOARD_EFFECTS.length >= 8, 'Must have at least 8 celebration soundboard effects defined');

const profanityList = ['damn', 'hell', 'crap', 'shit', 'fuck', 'bitch', 'ass'];
TAUNT_QUOTES.forEach(({ text, tag, soundFx }) => {
  const lower = text.toLowerCase();
  profanityList.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    assert(!regex.test(lower), `SFW Violation: found forbidden word "${word}" in taunt: ${text}`);
  });
  assert(tag && tag.length > 0, `Tag required for taunt: ${text}`);
  assert(soundFx && soundFx.length > 0, `soundFx required for taunt: ${text}`);
});
console.log(`  ✅ All ${TAUNT_QUOTES.length} taunts passed strict SFW compliance.`);

// Verify 8 soundboard effects
const expectedEffects = ['airhorn', 'fanfare', 'applause', 'coins', 'whistle', 'boxing-bell', 'boing', 'sad-trombone'];
expectedEffects.forEach(effId => {
  const found = SOUNDBOARD_EFFECTS.find(e => e.id === effId);
  assert(found, `Soundboard must include effect '${effId}'`);
  assert(found.name && found.icon, `Effect '${effId}' must have name and icon`);
});
console.log(`  ✅ All ${SOUNDBOARD_EFFECTS.length} soundboard effects verified with icons and names.`);

// 2. Test getRandomTaunt randomizer
console.log('\n🧪 Test 2: getRandomTaunt Randomizer');
for (let i = 0; i < 20; i++) {
  const t = getRandomTaunt();
  assert(t.text && t.text.length > 5, 'Must return valid taunt text');
  assert(t.soundFx, 'Must return soundFx');
  assert(t.tag, 'Must return tag');
}
console.log('  ✅ 20 consecutive random taunts drawn with valid payloads.');

// 3. Mock Web Audio Context and Test Synthesizer Methods
console.log('\n🧪 Test 3: Web Audio Synthesizer Dispatch Verification');

class MockAudioParam {
  constructor(initial = 0) { this.value = initial; }
  setValueAtTime(val) { this.value = val; }
  linearRampToValueAtTime(val) { this.value = val; }
  exponentialRampToValueAtTime(val) { this.value = val; }
}

class MockAudioNode {
  connect() {}
  disconnect() {}
}

class MockGainNode extends MockAudioNode {
  constructor() {
    super();
    this.gain = new MockAudioParam(1);
  }
}

class MockOscillatorNode extends MockAudioNode {
  constructor() {
    super();
    this.frequency = new MockAudioParam(440);
    this.type = 'sine';
  }
  start() {}
  stop() {}
}

class MockBiquadFilterNode extends MockAudioNode {
  constructor() {
    super();
    this.frequency = new MockAudioParam(1000);
    this.Q = new MockAudioParam(1);
    this.type = 'lowpass';
  }
}

class MockAudioBufferSourceNode extends MockAudioNode {
  constructor() {
    super();
    this.buffer = null;
  }
  start() {}
  stop() {}
}

class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.sampleRate = 44100;
    this.state = 'running';
    this.destination = new MockAudioNode();
  }
  createGain() { return new MockGainNode(); }
  createOscillator() { return new MockOscillatorNode(); }
  createBiquadFilter() { return new MockBiquadFilterNode(); }
  createBuffer(channels, length, rate) {
    return {
      getChannelData: () => new Float32Array(length)
    };
  }
  createBufferSource() { return new MockAudioBufferSourceNode(); }
  resume() { return Promise.resolve(); }
}

global.window = {
  AudioContext: MockAudioContext
};

const { soundManager } = await import('./client/src/utils/sound.js');

// Test new synthesizer methods
assert(typeof soundManager.playAirhorn === 'function', 'playAirhorn must exist');
assert(typeof soundManager.playBoxingBell === 'function', 'playBoxingBell must exist');
assert(typeof soundManager.playApplause === 'function', 'playApplause must exist');
assert(typeof soundManager.playSoundById === 'function', 'playSoundById must exist');

soundManager.playAirhorn();
soundManager.playBoxingBell();
soundManager.playApplause();
expectedEffects.forEach(id => soundManager.playSoundById(id));

console.log('  ✅ playAirhorn, playBoxingBell, playApplause, and playSoundById executed cleanly.');

// 4. Live Multi-Client Socket.IO Simulation
console.log('\n🧪 Test 4: Live Socket.IO Broadcast Orchestration');

const SOCKET_URL = 'http://localhost:3001';

function createSocket() {
  return io(SOCKET_URL, {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
  });
}

function waitForEvent(socket, eventName, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event ${eventName}`));
    }, timeoutMs);
    socket.once(eventName, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

const hostSocket = createSocket();
const player1Socket = createSocket();
const player2Socket = createSocket();

await Promise.all([
  waitForEvent(hostSocket, 'connect'),
  waitForEvent(player1Socket, 'connect'),
  waitForEvent(player2Socket, 'connect')
]);

console.log('  📡 Connected Host, Player 1 (Ace), and Player 2 (Bob).');

// Host creates room
const roomPin = await new Promise((resolve) => {
  hostSocket.emit('create-room', { gameMode: 'CLASSIC', questionCount: 5 }, (res) => {
    assert(res.success, 'Room creation failed');
    resolve(res.pin);
  });
});
console.log(`  🏠 Room created: ${roomPin}`);

// Players join room
await new Promise((resolve) => {
  player1Socket.emit('join-room', { pin: roomPin, nickname: 'AceChamp', avatar: '👑' }, (res) => {
    assert(res.success, 'Player 1 join failed');
    resolve();
  });
});

await new Promise((resolve) => {
  player2Socket.emit('join-room', { pin: roomPin, nickname: 'BobCadet', avatar: '👾' }, (res) => {
    assert(res.success, 'Player 2 join failed');
    resolve();
  });
});
console.log('  👥 Players joined room successfully.');

// Test Taunt Broadcast
console.log('\n🧪 Test 5: Real-Time Taunt Broadcasting & Delivery to All Participants');

const hostTauntPromise = waitForEvent(hostSocket, 'player-taunted');
const bobTauntPromise = waitForEvent(player2Socket, 'player-taunted');

// AceChamp fires taunt
await new Promise((resolve) => {
  player1Socket.emit('send-taunt', {
    tauntText: 'Is that your final answer, or did your keyboard auto-correct to failure?',
    soundFx: 'boing'
  }, (res) => {
    assert(res.success, 'Taunt sending should succeed');
    resolve();
  });
});

const [hostTauntData, bobTauntData] = await Promise.all([hostTauntPromise, bobTauntPromise]);

assert.strictEqual(hostTauntData.nickname, 'AceChamp');
assert.strictEqual(hostTauntData.tauntText, 'Is that your final answer, or did your keyboard auto-correct to failure?');
assert.strictEqual(hostTauntData.soundFx, 'boing');

assert.strictEqual(bobTauntData.nickname, 'AceChamp');
assert.strictEqual(bobTauntData.tauntText, 'Is that your final answer, or did your keyboard auto-correct to failure?');
assert.strictEqual(bobTauntData.soundFx, 'boing');

console.log('  ✅ Taunt successfully received in real-time by both Host and all peers in room!');

// Test Spam Rate Limiting on Taunts
const spamAttempt = await new Promise((resolve) => {
  player1Socket.emit('send-taunt', {
    tauntText: 'Spamming taunt!',
    soundFx: 'airhorn'
  }, (res) => {
    resolve(res);
  });
});
assert.strictEqual(spamAttempt.success, false, 'Rapid repeated taunts should be rate-limited');
assert.strictEqual(spamAttempt.error, 'Taunt cooldown active');
console.log('  ✅ Anti-spam cooldown properly enforced by server on rapid taunts.');

// Test Winner Celebration Soundboard Broadcast
console.log('\n🧪 Test 6: Winner Celebration Soundboard Broadcasting');

const hostCelebrationPromise = waitForEvent(hostSocket, 'winner-celebration-fx');
const bobCelebrationPromise = waitForEvent(player2Socket, 'winner-celebration-fx');

// Fire celebration soundboard event from winner
await new Promise((resolve) => {
  player1Socket.emit('send-celebration-fx', {
    soundId: 'airhorn',
    soundName: 'Airhorn Blast',
    icon: '🎺'
  }, (res) => {
    assert(res.success, 'Celebration effect should succeed');
    resolve();
  });
});

const [hostCelebData, bobCelebData] = await Promise.all([hostCelebrationPromise, bobCelebrationPromise]);

assert.strictEqual(hostCelebData.nickname, 'AceChamp');
assert.strictEqual(hostCelebData.soundId, 'airhorn');
assert.strictEqual(hostCelebData.soundName, 'Airhorn Blast');
assert.strictEqual(hostCelebData.icon, '🎺');

assert.strictEqual(bobCelebData.nickname, 'AceChamp');
assert.strictEqual(bobCelebData.soundId, 'airhorn');
assert.strictEqual(bobCelebData.soundName, 'Airhorn Blast');
assert.strictEqual(bobCelebData.icon, '🎺');

console.log('  ✅ Winner Celebration Soundboard effect successfully broadcast to ALL room players!');

// Cleanup
hostSocket.disconnect();
player1Socket.disconnect();
player2Socket.disconnect();

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! (6/6 Verification Blocks Complete)\n');
process.exit(0);
