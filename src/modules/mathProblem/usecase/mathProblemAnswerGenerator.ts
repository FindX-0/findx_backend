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

@Injectable()
export class MathProblemAnswerGenerator {
  constructor(
    private readonly answerFunctionQueryService: AnswerFunctionQueryService,
  ) {}

  async call({
    tex,
    mathSubFieldId,
  }: {
    tex: string;
    mathSubFieldId: string;
  }): Promise<MathProblemAnswer[] | null> {
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
        mathSubFieldId,
      });

      return this.generateAnswers(correctAnswer, answerFunctions);
    }

    const answerFunctions = await this.answerFunctionQueryService.getAll({
      numberType: NumberType.DECIMAL,
      mathSubFieldId,
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

      const tex = new Function(
        'num',
        'Decimal',
        'randomBoolean',
        'randomElement',
        'randomInt',
        'randomNumber',
        'randomPrime',
        'randomSign',
        'decimalDigits',
        answerFunc.func,
      )(
        correctAnswer,
        Decimal,
        randomBoolean,
        randomElement,
        randomInt,
        randomNumber,
        randomPrime,
        randomSign,
        decimalDigits,
      ).toString();

      const answer: MathProblemAnswer = {
        isCorrect: false,
        tex,
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
