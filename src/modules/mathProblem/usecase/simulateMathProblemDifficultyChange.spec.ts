import { Decimal } from 'decimal.js';

import { CalculateMathProblemDifficulty } from './calculateMathProblemDifficulty';
import { weightedRandom } from '../../../shared/util/random';

const times: { weight: number; time: number }[] = [
  { weight: 0.098, time: 1000 },
  { weight: 0.106, time: 2000 },
  { weight: 0.11, time: 3000 },
  { weight: 0.11, time: 4000 },
  { weight: 0.106, time: 5000 },
  { weight: 0.098, time: 6000 },
  { weight: 0.087, time: 7000 },
  { weight: 0.074, time: 8000 },
  { weight: 0.06, time: 9000 },
  { weight: 0.048, time: 10000 },
  { weight: 0.036, time: 11000 },
  { weight: 0.026, time: 12000 },
  { weight: 0.018, time: 13000 },
  { weight: 0.012, time: 14000 },
  { weight: 0.008, time: 15000 },
  { weight: 0.005, time: 16000 },
];

describe('Simulate math problem difficulty change', () => {
  const calculateMathProblemDifficulty = new CalculateMathProblemDifficulty();

  it('simulate', () => {
    simulate(100, calculateMathProblemDifficulty);
    // simulate(500, calculateMathProblemDifficulty);
    // simulate(1000, calculateMathProblemDifficulty);
  });
});

const simulate = (
  n: number,
  calculateMathProblemDifficulty: CalculateMathProblemDifficulty,
) => {
  let currentDifficulty = new Decimal(50);
  let correctCount = 0;
  let wrongCount = 0;

  for (let i = 0; i < n; i++) {
    const isCorrect = Math.random() > 0.1;
    if (isCorrect) {
      correctCount++;
    } else {
      wrongCount++;
    }

    const timeSpentInMillis = weightedRandom(times);

    if (!timeSpentInMillis) {
      continue;
    }

    currentDifficulty = calculateMathProblemDifficulty.calculate({
      isCorrect,
      currentDifficulty,
      timeSpentInMillis: timeSpentInMillis.time,
    });

    console.log(currentDifficulty);
  }

  console.log(
    `N = ${n} difficulty = ${currentDifficulty}, correct = ${correctCount}, wrong = ${wrongCount}`,
  );
};
