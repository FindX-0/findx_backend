import { Decimal } from 'decimal.js';

import { CalculateMathProblemDifficulty } from './calculateMathProblemDifficulty';
import { weightedRandom } from '../../../shared/util/random';

const times: { weight: number; time: number }[] = [
  { weight: 0.0227, time: 5000 },
  { weight: 0.477, time: 6000 },
  { weight: 0.477, time: 7000 },
  { weight: 0.0227, time: 8000 },
];

describe('Simulate math problem difficulty change', () => {
  const calculateMathProblemDifficulty = new CalculateMathProblemDifficulty();

  it('simulate', () => {
    simulate(100, calculateMathProblemDifficulty);
    simulate(1000, calculateMathProblemDifficulty);
    simulate(10_000, calculateMathProblemDifficulty);
  });
});

const simulate = (
  n: number,
  calculateMathProblemDifficulty: CalculateMathProblemDifficulty,
) => {
  let currentDifficulty = new Decimal(50);
  let correctCount = 0;
  let wrongCount = 0;
  let meanTimeSpentInMillis = 0;

  for (let i = 0; i < n; i++) {
    const isCorrect = Math.random() > 0.02;
    if (isCorrect) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      correctCount++;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      wrongCount++;
    }

    const timeSpentInMillis = weightedRandom(times);

    if (!timeSpentInMillis) {
      continue;
    }

    meanTimeSpentInMillis =
      (meanTimeSpentInMillis * i + timeSpentInMillis.time) / (i + 1);

    currentDifficulty = calculateMathProblemDifficulty.calculate({
      isCorrect,
      currentDifficulty,
      timeSpentInMillis: timeSpentInMillis.time,
      meanTimeSpentInMillis: 6000,
    });
  }

  // console.log(
  //   `N = ${n} difficulty = ${currentDifficulty}, correct = ${correctCount}, wrong = ${wrongCount}`,
  // );
};
