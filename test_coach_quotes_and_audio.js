// test_coach_quotes_and_audio.js
// Verification suite for Coach McGuirk Quotes Library and Comedic Sound Synthesizers

import assert from 'assert';
import {
  COACH_CORRECT_QUOTES,
  COACH_INCORRECT_QUOTES,
  getRandomCoachQuote
} from './client/src/utils/coachQuotes.js';

console.log('🏁 Starting Coach McGuirk Quotes & Audio Test Suite...\n');

// 1. Verify Quote Integrity
console.log('🧪 Test 1: Quote Library Verification');
assert(COACH_CORRECT_QUOTES.length >= 10, 'Must have at least 10 correct quotes');
assert(COACH_INCORRECT_QUOTES.length >= 10, 'Must have at least 10 incorrect quotes');

// Check for the iconic Home Movies studying is cheating quote
const iconicQuote = COACH_CORRECT_QUOTES.find(q =>
  q.quote.includes("You know what studying is? It's cheating.")
);
assert(iconicQuote, 'Iconic Home Movies "studying is cheating" quote must be present');
console.log('  ✅ Found iconic quote: "' + iconicQuote.quote.substring(0, 70) + '..."');

// Check SFW compliance (no explicit language)
const profanityList = ['damn', 'hell', 'crap', 'shit', 'fuck', 'bitch', 'ass'];
[...COACH_CORRECT_QUOTES, ...COACH_INCORRECT_QUOTES].forEach(({ quote, topic }) => {
  const lower = quote.toLowerCase();
  profanityList.forEach(word => {
    // Only check whole word matches
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    assert(!regex.test(lower), `SFW Violation: found forbidden word "${word}" in: ${quote}`);
  });
  assert(topic && topic.length > 0, `Topic must be provided for quote: ${quote}`);
});
console.log(`  ✅ All ${COACH_CORRECT_QUOTES.length + COACH_INCORRECT_QUOTES.length} quotes passed strict SFW compliance.`);

// 2. Test getRandomCoachQuote helper
console.log('\n🧪 Test 2: getRandomCoachQuote Randomization & Structure');
for (let i = 0; i < 20; i++) {
  const correctQ = getRandomCoachQuote(true);
  assert(correctQ.quote, 'Must return quote string');
  assert(correctQ.topic, 'Must return topic string');
  assert.strictEqual(correctQ.coach, 'Coach McGuirk');

  const incorrectQ = getRandomCoachQuote(false);
  assert(incorrectQ.quote, 'Must return quote string');
  assert(incorrectQ.topic, 'Must return topic string');
  assert.strictEqual(incorrectQ.coach, 'Coach McGuirk');
}
console.log('  ✅ 20 consecutive random draws verified with valid structures.');

// 3. Mock Web Audio API Context to verify Sound Synthesizer calls
console.log('\n🧪 Test 3: Web Audio API Synthesizer Verification');

class MockAudioParam {
  constructor(initial = 0) {
    this.value = initial;
  }
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

class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.state = 'running';
    this.destination = new MockAudioNode();
  }
  createGain() { return new MockGainNode(); }
  createOscillator() { return new MockOscillatorNode(); }
  createBiquadFilter() { return new MockBiquadFilterNode(); }
  resume() { return Promise.resolve(); }
}

global.window = {
  AudioContext: MockAudioContext
};

const { soundManager } = await import('./client/src/utils/sound.js');

// Test soundManager comedic audio methods
assert(typeof soundManager.playCoachWhistle === 'function', 'playCoachWhistle must exist');
assert(typeof soundManager.playSadTrombone === 'function', 'playSadTrombone must exist');
assert(typeof soundManager.playBoing === 'function', 'playBoing must exist');
assert(typeof soundManager.playCoachFeedback === 'function', 'playCoachFeedback must exist');

// Execute each audio method in mock environment
soundManager.playCoachWhistle();
soundManager.playSadTrombone();
soundManager.playBoing();
soundManager.playCoachFeedback(true);
soundManager.playCoachFeedback(false);

console.log('  ✅ playCoachWhistle, playSadTrombone, playBoing & playCoachFeedback executed without exceptions.');

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! (3/3 Verification Blocks Complete)\n');
