import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Decimal } from 'decimal.js';

import { NumberType } from '../../../entities';
import { decimalDigits } from '../../../shared/util';
import {
  randomBoolean,
  randomElement,
  randomInt,
  randomNumber,
  randomPrime,
  randomSign,
  weightedRandom,
} from '../../../shared/util/random';
import { solveTexExpression } from '../../../shared/util/solveTexExpression';
import { SelectableAnswerFunction } from '../../answerFunction/answerFunction.entity';
import { AnswerFunctionQueryService } from '../../answerFunction/answerFunctionQuery.service';
import { MathProblemAnswer } from '../mathProblem.entity';

type MathAnswerFunc = {
  func: (num: Decimal) => Decimal;
  weight: number;
  condition?: (num: Decimal) => boolean;
};

const intFuncOptions: MathAnswerFunc[] = [
  {
    weight: 1,
    func: (num) => {
      // -answer;

      return num.negated();
    },
  },
  {
    weight: 1,
    func: (num) => {
      // (+-)answer +- rand(1-10)

      const optionalNegatedNum = num.mul(randomSign());
      const randomSignRange = randomSign() * randomInt(1, 10);

      return optionalNegatedNum.plus(randomSignRange);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // (+-)answer * rand(2-10)

      const optionalNegatedNum = num.mul(randomSign());
      const randomNumRange = randomInt(2, 10);

      return optionalNegatedNum.mul(randomNumRange);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // (+-)answer +- ceil(answer * uniform(.1-1))

      const optionalNegatedNum = num.mul(randomSign());
      const modifier = num.mul(randomNumber(0.1, 1)).ceil().mul(randomSign());

      return optionalNegatedNum.plus(modifier);
    },
  },

  {
    weight: 1,
    func: (num) => {
      // ceil(answer * uniform(0.1 - 1));

      return num.mul(randomNumber(0.1, 1)).ceil();
    },
  },
  {
    weight: 1,
    condition: (num) => num.greaterThan(10),
    func: (num) => {
      // answer > 10:
      //   (+-)answer +- rand(1-10) * 10^(intLen-2)

      const optionalNegatedNum = num.mul(randomSign());
      const modifier = new Decimal(randomInt(1, 10))
        .mul(randomSign())
        .mul(Decimal.pow(10, decimalDigits(num).minus(2)));

      return optionalNegatedNum.plus(modifier);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // (answer * rand(2 - 10)) / randPrime(answer);

      const randPrime = randomPrime(num.toNumber());
      if (!randPrime) {
        return num;
      }

      return num.mul(randomInt(2, 10)).div(randPrime);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // (+-)answer +- answer/randPrime(answer)

      const randPrime = randomPrime(num.toNumber());
      if (!randPrime) {
        return num;
      }

      const optionalNegatedNum = num.mul(randomSign());
      const modifier = num.mul(randomSign()).div(randPrime);

      return optionalNegatedNum.plus(modifier);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // (+-)answer +- (answer/randPrime(answer)) * rand(2-5)

      const randPrime = randomPrime(num.toNumber());
      if (!randPrime) {
        return num;
      }

      const optionalNegatedNum = num.mul(randomSign());
      const modifier = num
        .mul(randomSign())
        .div(randPrime)
        .mul(randomInt(2, 5));

      return optionalNegatedNum.plus(modifier);
    },
  },
  {
    weight: 1,
    condition: (num) => num.lessThan(10_000),
    func: (num) => {
      // if answer < 10_000:
      //   answer^2

      return num.pow(2);
    },
  },
  {
    weight: 1,
    condition: (num) => num.lessThan(500),
    func: (num) => {
      // if answer < 500:
      //   answer^3

      return num.pow(3);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // answer * rand([0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1.25, 1.5, 2.5, 7.5]);

      const randMultiplier = randomElement([
        0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1.25, 1.5, 2.5, 7.5,
      ]);
      if (!randMultiplier) {
        return num;
      }

      return num.mul(randMultiplier);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // answer * (1 +- rand([0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1.25, 1.5, 2.5, 7.5]));

      const randMultiplier = randomElement([
        0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1.25, 1.5, 2.5, 7.5,
      ]);
      if (!randMultiplier) {
        return num;
      }

      const modifier = Decimal.mul(randomSign(), randMultiplier).add(1);

      return num.mul(modifier);
    },
  },
  {
    weight: 1,
    condition: (num) => num.lessThan(10),
    func: (num) => {
      // if answer < 10:
      //   answer +- rand([.05, .1, .2, .25, .5, .75, 1.25, 1.5, 2.5, 7.5])

      const randMultiplier = randomElement([
        0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1.25, 1.5, 2.5, 7.5,
      ]);
      if (!randMultiplier) {
        return num;
      }

      const modifier = Decimal.mul(randomSign(), randMultiplier);

      return num.plus(modifier);
    },
  },
];

const floatFuncOptions: MathAnswerFunc[] = [
  {
    weight: 1,
    func: (num) => {
      // -answer;

      return num.negated();
    },
  },
  {
    weight: 1,
    func: (num) => {
      // (+-)answer +- rand(1-10)

      const optionalNegatedNum = num.mul(randomSign());
      const randomSignRange = randomSign() * randomInt(1, 10);

      return optionalNegatedNum.plus(randomSignRange);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // (+-)answer * rand(2-10)

      const optionalNegatedNum = num.mul(randomSign());
      const randomNumRange = randomInt(2, 10);

      return optionalNegatedNum.mul(randomNumRange);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // (+-)answer +- ceil(answer * uniform(.1-1))

      const optionalNegatedNum = num.mul(randomSign());
      const modifier = num.mul(randomNumber(0.1, 1)).ceil().mul(randomSign());

      return optionalNegatedNum.plus(modifier);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // ceil(answer * uniform(0.1 - 1));

      return num.mul(randomNumber(0.1, 1)).ceil();
    },
  },
  {
    weight: 1,
    condition: (num) => num.lessThan(10_000),
    func: (num) => {
      // if answer < 10_000:
      //   answer^2

      return num.pow(2);
    },
  },
  {
    weight: 1,
    condition: (num) => num.lessThan(500),
    func: (num) => {
      // if answer < 500:
      //   answer^3

      return num.pow(3);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // answer */ rand([.1, .2, .4, .5, .8, 2, 4, 5, 10])

      const randMultiplier = randomElement([
        0.1, 0.2, 0.4, 0.5, 0.8, 2, 4, 5, 10,
      ]);
      if (!randMultiplier) {
        return num;
      }

      return randomBoolean()
        ? num.mul(randMultiplier)
        : num.div(randMultiplier);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // answerInt = answer * 10^decimalLen(answer)
      // answer / randPrime(answerInt);

      const answerInt = num.mul(Decimal.pow(10, num.decimalPlaces()));

      const randPrime = randomPrime(answerInt.toNumber());
      if (!randPrime) {
        return num;
      }

      return num.div(randPrime);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // answerInt = answer * 10^decimalLen(answer)
      // (+-)answer +- answer/randPrime(answerInt)

      const answerInt = num.mul(Decimal.pow(10, num.decimalPlaces()));

      const randPrime = randomPrime(answerInt.toNumber());
      if (!randPrime) {
        return num;
      }

      const optionalNegatedNum = num.mul(randomSign());
      const modifier = num.mul(randomSign()).div(randPrime);

      return optionalNegatedNum.plus(modifier);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // answerInt = answer * 10^decimalLen(answer)
      // (+-)answer +- (answer/randPrime(answerInt)) * rand(2-5)

      const answerInt = num.mul(Decimal.pow(10, num.decimalPlaces()));

      const randPrime = randomPrime(answerInt.toNumber());
      if (!randPrime) {
        return num;
      }

      const optionalNegatedNum = num.mul(randomSign());
      const modifier = num.div(randPrime).mul(randomSign() * randomInt(2, 5));

      return optionalNegatedNum.plus(modifier);
    },
  },
  {
    weight: 1,
    func: (num) => {
      // answer +- rand([1, 2]);

      return num.add(randomSign() * randomInt(1, 2));
    },
  },
  {
    weight: 1,
    func: (num) => {
      // answer * rand([0.1, 0.01, 0.001, 10, 100, 1000]);

      const randMultiplier = randomElement([0.1, 0.01, 0.001, 10, 100, 1000]);
      if (!randMultiplier) {
        return num;
      }

      return num.mul(randMultiplier);
    },
  },
];

const answerFunctionHelpers = `
const randomBoolean = () => Math.random() < 0.5;
const randomSign = () => randomBoolean() ? -1 : 1;
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
`;

@Injectable()
export class MathProblemAnswerGenerator {
  constructor(
    private readonly answerFunctionQueryService: AnswerFunctionQueryService,
  ) {}

  async call(tex: string): Promise<MathProblemAnswer[] | null> {
    if (!tex) {
      return null;
    }

    const correctAnswerTex = await solveTexExpression(tex);
    if (!correctAnswerTex) {
      return null;
    }

    const isCorrectAnswerNumber = /^-?[0-9]\d*(\.\d+)?$/.test(correctAnswerTex);
    if (!isCorrectAnswerNumber) {
      return null;
    }

    const correctAnswer = new Decimal(correctAnswerTex);

    if (correctAnswer.isNaN()) {
      return null;
    }

    if (correctAnswer.isInt()) {
      const answerFunctions = await this.answerFunctionQueryService.getAll({
        numberType: NumberType.INTEGER,
      });

      return this.generateAnswers(correctAnswer, answerFunctions);
    }

    const answerFunctions = await this.answerFunctionQueryService.getAll({
      numberType: NumberType.DECIMAL,
    });

    return this.generateAnswers(correctAnswer, answerFunctions);
  }

  private generateAnswers(
    correctAnswer: Decimal,
    answerFunctions: SelectableAnswerFunction[],
  ): MathProblemAnswer[] {
    const filteredOptions = answerFunctions
      .filter((answerFunc) => {
        if (!answerFunc.condition) {
          return true;
        }

        const conditionFunc = new Function('num', answerFunc.condition);

        return conditionFunc(correctAnswer);
      })
      .map((answerFunc) => {
        return {
          ...answerFunc,
          weight: parseFloat(answerFunc.weight),
        };
      });

    let safecondition = 0;
    const randomAnswers: MathProblemAnswer[] = [];
    while (safecondition < 1000 && randomAnswers.length < 3) {
      safecondition++;

      const answerFunc = weightedRandom(filteredOptions);
      if (!answerFunc) {
        throw new InternalServerErrorException(
          "couldn't get weighted random answer function",
        );
      }

      const func = new Function(
        'num',
        answerFunctionHelpers + '\n\n' + answerFunc.func,
      );

      const answer: MathProblemAnswer = {
        isCorrect: false,
        tex: func(correctAnswer).toString(),
      };

      if (!randomAnswers.includes(answer)) {
        randomAnswers.push(answer);
      }
    }

    return [
      {
        isCorrect: true,
        tex: correctAnswer.toString(),
      },
      ...randomAnswers,
    ];
  }
}
