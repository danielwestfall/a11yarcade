// Coach McGuirk's Sideline Wisdom & Pep Talks
// Inspired by the legendary deadpan soccer coach from Home Movies
// Strictly SFW, family/workplace friendly, hilarious retro humor.

export const COACH_CORRECT_QUOTES = [
  {
    quote: "Brendon, you studied, didn't you? You know what studying is? It's cheating. It's looking at the answers before the test. Why would you do that? Now you know the answers. Where's the mystery, Brendon? Where's the drama?",
    topic: "The Philosophy of Studying"
  },
  {
    quote: "Look at you, getting it right. Don't let it go to your head. One day you're getting accessibility questions right, the next day you think you can tell me how to park my car. You can't. Nobody can.",
    topic: "Automotive Confidence"
  },
  {
    quote: "You got it right. Congratulations. You want a trophy? I don't have one. I have a half-eaten granola bar from 1998 and a whistle that only works on Thursdays. Take the granola bar.",
    topic: "Championship Rewards"
  },
  {
    quote: "Boom. Correct. Did I teach you that? No. Am I going to take full credit for it in the teacher's lounge tomorrow? Absolutely. That's what coaching is all about.",
    topic: "Administrative Leadership"
  },
  {
    quote: "Nice job. You knew the answer. Personally, I like to guess. Guessing builds character. It keeps the heart pumping. But fine, do it the easy way with your fancy 'knowledge'.",
    topic: "Character Building"
  },
  {
    quote: "Correct! Don't look at me like that. I'm not going to hug you. High fives are for winners, and right now you're just someone who read the syllabus.",
    topic: "Emotional Boundary Control"
  },
  {
    quote: "Hey, you got it right! You know what this means? Nothing. Life is a long series of multiple choice questions, and most of them don't have a letter D. Remember that.",
    topic: "Life Lessons 101"
  },
  {
    quote: "Good answer. I was actually going to pick the other one, but that was just a tactical test to see if you had the guts to disagree with a man wearing sweatpants. You passed.",
    topic: "Tactical Prowess"
  },
  {
    quote: "Nailed it. You know, screen readers and live regions... they're a lot like soccer defense. I don't understand either of them, but I respect the hustle.",
    topic: "Defensive Formations"
  },
  {
    quote: "That was correct. Now run two laps anyway. Not because you were wrong, but because standing still gives you time to think, and thinking leads to doubt.",
    topic: "Cardiovascular Conditioning"
  },
  {
    quote: "You got it right. Good. Now don't get cocky. Cockiness is how you end up buying three identical decorative swords off late-night television. Trust me on this.",
    topic: "Financial Advisory"
  },
  {
    quote: "Right on the money. You know who else always had the right answers? Nobody. Nobody I hang out with, anyway. Keep it up, kid.",
    topic: "Social Circles"
  }
];

export const COACH_INCORRECT_QUOTES = [
  {
    quote: "You blew it. You know what? It's fine. You know what champions do when they strike out? They get in my car and we drive to the diner. I don't have any money on me, so you're buying, but the lesson is priceless.",
    topic: "The Value of Mentorship"
  },
  {
    quote: "Wrong. Totally wrong. But here's the secret: if you say it with enough confidence, about forty percent of people will just believe you anyway. Work on your posture.",
    topic: "Public Speaking"
  },
  {
    quote: "Swing and a miss. Look, accessibility standards are hard. You know what's easy? Sitting on a cooler while other people run around cones. Consider that.",
    topic: "Strategic Delegation"
  },
  {
    quote: "Incorrect. Don't feel bad. I once spent forty-five minutes trying to push a door that said PULL in giant red letters. The key is to never break eye contact with the cashier.",
    topic: "Crisis Management"
  },
  {
    quote: "That was the wrong answer, Brendon. But look on the bright side: in an alternate dimension, maybe that was the right answer. Not this dimension, though. In this dimension you lost points.",
    topic: "Quantum Physics"
  },
  {
    quote: "You missed that one. You know what you need? A sword. A real decorative wall sword. It doesn't help with WCAG contrast ratios, but you'll feel better about yourself.",
    topic: "Home Decorating"
  },
  {
    quote: "Wrong answer. Walk it off. Just walk it off. If your brain hurts, that just means it's out of shape. Do five mental pushups and get back in there.",
    topic: "Mental Calisthenics"
  },
  {
    quote: "Incorrect. Here's my advice: blame the referee. If there is no referee, blame the atmospheric humidity. Even indoors. Especially indoors.",
    topic: "Accountability Shifting"
  },
  {
    quote: "Not even close. But hey, failure is just success that took a wrong turn at Albuquerque. Or whatever that cartoon rabbit says. Don't look at me like that.",
    topic: "Modern Cartoons"
  },
  {
    quote: "Ouch. Wrong. You know, my uncle used to say, 'McGuirk, if at first you don't succeed, lower your expectations until you look like a genius.' Words to live by.",
    topic: "Family Wisdom"
  },
  {
    quote: "That was wrong. But who cares? Rules are just suggestions made by people with clipboards who couldn't cut it on the field. Wait... I'm holding a clipboard. Forget I said that.",
    topic: "Organizational Logic"
  },
  {
    quote: "Wrong choice. Don't cry. There's no crying in... whatever this is. Digital arcade games? Just hit the next question button and pretend it was a tactical feint.",
    topic: "Sideline Philosophy"
  }
];

/**
 * Returns a random Coach McGuirk quote based on whether the answer was correct or incorrect.
 * @param {boolean} isCorrect 
 * @returns {{ quote: string, topic: string, coach: string }}
 */
export function getRandomCoachQuote(isCorrect) {
  const list = isCorrect ? COACH_CORRECT_QUOTES : COACH_INCORRECT_QUOTES;
  const item = list[Math.floor(Math.random() * list.length)];
  return {
    ...item,
    coach: "Coach McGuirk"
  };
}
