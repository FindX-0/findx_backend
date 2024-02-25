import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';

import { decimalDigits } from '../../../shared/util';
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
  }): Decimal {
    const { answerFunction, correctAnswer } = params;

    const generatedAnswer = new Function(
      'num',
      'Decimal',
      'randomBoolean',
      'randomElement',
      'randomInt',
      'randomNumber',
      'randomPrime',
      'randomSign',
      'decimalDigits',
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
      decimalDigits,
    );

    return generatedAnswer;
  }
}
