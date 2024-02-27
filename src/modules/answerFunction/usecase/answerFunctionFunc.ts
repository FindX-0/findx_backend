import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';

import {
  decimalDigitsLen,
  decimalToInt,
  oneForDecimal,
  oneForInt,
  oneForIntGt10,
  oneForLt10Positive,
  oneForZero,
} from '../../../shared/util';
import {
  randomBoolean,
  randomElement,
  randomInt,
  randomNumber,
  randomPrime,
  randomSign,
} from '../../../shared/util/random';
import { SelectableAnswerFunction } from '../answerFunction.entity';

@Injectable()
export class AnswerFunctionFunc {
  call(params: {
    answerFunction: SelectableAnswerFunction;
    correctAnswer: Decimal;
  }): Decimal | null {
    const { answerFunction, correctAnswer } = params;

    try {
      const generatedAnswer = new Function(
        'num',
        'Decimal',
        'randomBoolean',
        'randomElement',
        'randomInt',
        'randomNumber',
        'randomPrime',
        'randomSign',
        'decimalDigitsLen',
        'oneForIntGt10',
        'oneForLt10Positive',
        'oneForZero',
        'oneForDecimal',
        'oneForInt',
        'decimalToInt',
        answerFunction.func,
      )(
        correctAnswer,
        Decimal,
        randomBoolean,
        randomElement,
        randomInt,
        randomNumber,
        randomPrime,
        randomSign,
        decimalDigitsLen,
        oneForIntGt10,
        oneForLt10Positive,
        oneForZero,
        oneForDecimal,
        oneForInt,
        decimalToInt,
      );

      return generatedAnswer;
    } catch (e) {
      console.error(e);
    }

    return null;
  }
}
