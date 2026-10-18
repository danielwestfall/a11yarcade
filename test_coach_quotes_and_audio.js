// test_coach_quotes_and_audio.js
// Verification suite for Sideline Mentors Library (Male & Female Diverse Mentors) and Comedic Sound Synthesizers

import assert from 'assert';
import {
  COACH_CORRECT_QUOTES,
  COACH_INCORRECT_QUOTES,
  getRandomCoachQuote
} from './client/src/utils/coachQuotes.js';

console.log('🏁 Starting Sideline Mentors & Audio Test Suite...\n');

// 1. Verify Quote Library Integrity
console.log('🧪 Test 1: Quote Library & Diverse Mentor Verification');
assert(COACH_CORRECT_QUOTES.length >= 20, 'Must have at least 20 correct quotes');
assert(COACH_INCORRECT_QUOTES.length >= 20, 'Must have at least 20 incorrect quotes');

// Check for the iconic Home Movies studying is cheating quote
const iconicQuote = COACH_CORRECT_QUOTES.find(q =>
  q.quote.includes("You know what studying is? It's cheating.")
);
assert(iconicQuote, 'Iconic Home Movies "studying is cheating" quote must be present');
console.log('  ✅ Found iconic quote: "' + iconicQuote.quote.substring(0, 70) + '..."');

// Check SFW compliance (no explicit language) & schema integrity
const profanityList = ['damn', 'hell', 'crap', 'shit', 'fuck', 'bitch', 'ass'];
const allQuotes = [...COACH_CORRECT_QUOTES, ...COACH_INCORRECT_QUOTES];

const authors = new Set();
const femaleMentors = new Set();
const maleMentors = new Set();

allQuotes.forEach(q => {
  const { quote, topic, author, role, gender, avatarIcon, pitch, rate, badgeId } = q;
  const lower = quote.toLowerCase();
  profanityList.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    assert(!regex.test(lower), `SFW Violation: found forbidden word "${word}" in: ${quote}`);
  });

  assert(topic && topic.length > 0, `Topic must be provided for quote: ${quote}`);
  assert(author && author.length > 0, `Author must be provided for quote: ${quote}`);
  assert(role && role.length > 0, `Role must be provided for quote: ${quote}`);
  assert(gender === 'male' || gender === 'female', `Gender must be 'male' or 'female': got ${gender}`);
  assert(avatarIcon && avatarIcon.length > 0, `avatarIcon must be provided for ${author}`);
  assert(typeof pitch === 'number' && pitch > 0, `pitch must be a valid number: got ${pitch}`);
  assert(typeof rate === 'number' && rate > 0, `rate must be a valid number: got ${rate}`);
  assert(badgeId && badgeId.length > 0, `badgeId must be provided for ${author}`);

  authors.add(author);
  if (gender === 'female') {
    femaleMentors.add(author);
    assert(pitch >= 1.05, `Female voice pitch should be appropriately tuned (>= 1.05): got ${pitch} for ${author}`);
  } else {
    maleMentors.add(author);
    assert(pitch <= 1.0, `Male voice pitch should be appropriately tuned (<= 1.0): got ${pitch} for ${author}`);
  }
});

console.log(`  ✅ All ${allQuotes.length} quotes passed strict SFW compliance.`);
console.log(`  ✅ Mentors Roster: ${authors.size} unique mentors across male and female roles.`);
console.log(`     • Female Mentors (${femaleMentors.size}): ${Array.from(femaleMentors).join(', ')}`);
console.log(`     • Male Mentors (${maleMentors.size}): ${Array.from(maleMentors).join(', ')}`);
assert(femaleMentors.size >= 4, 'Must have at least 4 female mentors');
assert(maleMentors.size >= 3, 'Must have at least 3 male mentors');

// 2. Test getRandomCoachQuote helper
console.log('\n🧪 Test 2: getRandomCoachQuote Randomization & Voice Profile');
let sampledFemale = 0;
let sampledMale = 0;

for (let i = 0; i < 50; i++) {
  const correctQ = getRandomCoachQuote(true);
  assert(correctQ.quote, 'Must return quote string');
  assert(correctQ.topic, 'Must return topic string');
  assert(correctQ.author, 'Must return author name');
  assert(correctQ.coach, 'Must return coach fallback property');
  assert(correctQ.avatarIcon, 'Must return avatarIcon');
  assert(correctQ.gender === 'male' || correctQ.gender === 'female', 'Must return valid gender');

  if (correctQ.gender === 'female') sampledFemale++;
  if (correctQ.gender === 'male') sampledMale++;

  const incorrectQ = getRandomCoachQuote(false);
  assert(incorrectQ.quote, 'Must return quote string');
  assert(incorrectQ.topic, 'Must return topic string');
  assert(incorrectQ.author, 'Must return author name');
  assert(incorrectQ.gender === 'male' || incorrectQ.gender === 'female', 'Must return valid gender');
}

console.log(`  ✅ 50 consecutive random draws verified with valid structures.`);
console.log(`     • Sample distribution: ${sampledFemale} female draws, ${sampledMale} male draws.`);
assert(sampledFemale > 0 && sampledMale > 0, 'Both female and male mentors must be sampled randomly');

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
