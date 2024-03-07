import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';

const alpha = 0.01;
const beta = 0.004;
const T = 3;

@Injectable()
export class CalculateMathProblemDifficulty {
  calculate(params: {
    isCorrect: boolean;
    currentDifficulty: Decimal;
    timeSpentInMillis: number;
  }): Decimal {
    const { isCorrect, currentDifficulty, timeSpentInMillis } = params;

    if (isCorrect) {
      return this.forCorrectAnswer({ currentDifficulty, timeSpentInMillis });
    }

    return this.forWrongAnswer({ currentDifficulty, timeSpentInMillis });
  }

  private forCorrectAnswer(params: {
    currentDifficulty: Decimal;
    timeSpentInMillis: number;
  }): Decimal {
    const { currentDifficulty, timeSpentInMillis } = params;

    const modifier = Decimal.sub(
      1,
      Decimal.sub(1, timeSpentInMillis / 1000 / 60)
        .mul(Decimal.div(100, currentDifficulty).minus(1))
        .mul(1 - Math.E ** -alpha),
    );

    return currentDifficulty.mul(modifier);
  }

  private forWrongAnswer(params: {
    currentDifficulty: Decimal;
    timeSpentInMillis: number;
  }): Decimal {
    const { currentDifficulty, timeSpentInMillis } = params;

    const modifier = Decimal.sub(
      1,
      Decimal.div(timeSpentInMillis / 1000, T).mul(
        Decimal.sub(Math.E ** -beta, 1),
      ),
    );

    return currentDifficulty.mul(modifier);
  }
}
