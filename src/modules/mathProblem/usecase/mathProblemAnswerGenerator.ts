import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Decimal } from 'decimal.js';

import { weightedRandom } from '../../../shared/util/random';
import { SelectableAnswerFunction } from '../../answerFunction/answerFunction.entity';
import { AnswerFunctionQueryService } from '../../answerFunction/answerFunctionQuery.service';
import { AnswerFunctionFunc } from '../../answerFunction/usecase/answerFunctionFunc';
import { MathProblemAnswer } from '../mathProblem.entity';

@Injectable()
export class MathProblemAnswerGenerator {
  constructor(
    private readonly answerFunctionQueryService: AnswerFunctionQueryService,
    private readonly answerFunctionFunc: AnswerFunctionFunc,
  ) {}

  async call({
    tex,
    correctAnswer,
    mathSubFieldId,
    answerConditionFunc,
  }: {
    tex: string;
    correctAnswer: Decimal;
    mathSubFieldId: string;
    answerConditionFunc: string | null;
  }): Promise<MathProblemAnswer[] | null> {
    if (!tex || correctAnswer.isNaN()) {
      return null;
    }

    const answerFunctions = await this.answerFunctionQueryService.getAll({
      mathSubFieldId,
    });

    return this.generateAnswers({
      correctAnswer,
      answerFunctions,
      answerConditionFunc,
    });
  }

  private generateAnswers({
    correctAnswer,
    answerFunctions,
    answerConditionFunc,
  }: {
    correctAnswer: Decimal;
    answerFunctions: SelectableAnswerFunction[];
    answerConditionFunc: string | null;
  }): MathProblemAnswer[] {
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

      const answerFunction = weightedRandom(filteredOptions);
      if (!answerFunction) {
        throw new InternalServerErrorException(
          "couldn't get weighted random answer function",
        );
      }

      const generatedAnswer = this.answerFunctionFunc.call({
        answerFunction: {
          ...answerFunction,
          weight: answerFunction.weight.toString(),
        },
        correctAnswer,
      });

      if (!generatedAnswer) {
        continue;
      }

      const answer: MathProblemAnswer = {
        isCorrect: false,
        tex: generatedAnswer.toString(),
      };

      const answerPassesCondition =
        !answerConditionFunc ||
        new Function('num', answerConditionFunc)(generatedAnswer);

      if (!answerPassesCondition) {
        continue;
      }

      const alreadyExists = randomAnswers.some((randomAnswer) => {
        return randomAnswer.tex === answer.tex;
      });
      const sameAsAnswer = correctAnswer.eq(generatedAnswer);

      if (alreadyExists || sameAsAnswer) {
        continue;
      }

      randomAnswers.push(answer);
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
