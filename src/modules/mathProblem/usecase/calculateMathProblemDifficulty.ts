import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';

const alpha = 0.01;
const beta = 0.004;

type Params = {
  currentDifficulty: Decimal;
  timeSpentInMillis: number;
  meanTimeSpentInMillis: number;
};

@Injectable()
export class CalculateMathProblemDifficulty {
  calculate(params: { isCorrect: boolean } & Params): Decimal {
    const { isCorrect } = params;

    const newDifficulty = isCorrect
      ? this.forCorrectAnswer(params)
      : this.forWrongAnswer(params);

    return newDifficulty.clamp(1, 100);
  }

  private forWrongAnswer(params: Params): Decimal {
    const { currentDifficulty, timeSpentInMillis } = params;

    const modifier = Decimal.add(
      1,
      Decimal.sub(1, timeSpentInMillis / 1000 / 60)
        .mul(Decimal.div(100, currentDifficulty).minus(1))
        .mul(1 - Math.E ** -alpha),
    );

    // console.log({
    //   isCorrect: 'false',
    //   modifier,
    //   currentDifficulty,
    //   timeSpentInMillis,
    // });

    return currentDifficulty.mul(modifier);
  }

  private forCorrectAnswer(params: Params): Decimal {
    const { currentDifficulty, timeSpentInMillis, meanTimeSpentInMillis } =
      params;

    const modifier = Decimal.sub(
      1,
      Decimal.mul(
        timeSpentInMillis / 1000,
        Decimal.sub(60, meanTimeSpentInMillis / 1000)
          .div(60)
          .div(meanTimeSpentInMillis / 1000)
          .mul(1 - Math.E ** -beta),
      ),
    );

    // console.log({
    //   isCorrect: 'true',
    //   modifier,
    //   currentDifficulty,
    //   timeSpentInMillis,
    //   meanTimeSpentInMillis,
    // });

    return currentDifficulty.mul(modifier);
  }
}
