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

const oneForIntGt10 = (num: Decimal) =>
  num.greaterThan(10) && num.isInt() ? 1 : 0;
const oneForLt10Positive = (num: Decimal) =>
  num.lessThan(10) && num.isPositive() ? 1 : 0;
const oneForZero = (num: Decimal) => (num.equals(0) ? 1 : 0);
const oneForDecimal = (num: Decimal) => (num.isInt() ? 0 : 1);
const oneForInt = (num: Decimal) => (num.isInt() ? 1 : 0);
const decimalToInt = (num: Decimal) =>
  num.isPositive() ? num.floor() : num.ceil();

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
        'decimalDigits',
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
        decimalDigits,
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

const funcs: ((num: Decimal) => Decimal)[] = [
  (num) => {
    // -answer +- random(1, 10) * oneForZero(answer);

    const modifierForZero = Decimal.mul(randomInt(1, 10), oneForZero(num)).mul(
      randomSign(),
    );

    return num.negated().plus(modifierForZero);
  },
  (num) => {
    // +-answer +- random(1, 10);

    const modifier = Decimal.mul(randomInt(1, 10), randomSign());

    return num.mul(randomSign()).plus(modifier);
  },
  (num) => {
    // answer + random(1, 10) + random(1, 10) * oneForZero(answer);

    const modifierForZero = Decimal.mul(randomInt(1, 10), oneForZero(num));

    return num.plus(randomInt(1, 10)).plus(modifierForZero);
  },
  (num) => {
    // answer - random(0, answer) * oneForIntGt10(2 * answer) + random(1, 10) * oneForZero(answer) + 1

    const modifierForIntGt20 = Decimal.mul(
      randomInt(0, num.abs().toNumber()),
      oneForIntGt10(num.mul(2)),
    );

    const modifierForZero = Decimal.mul(randomInt(1, 10), oneForZero(num)).plus(
      1,
    );

    return num.minus(modifierForIntGt20).plus(modifierForZero);
  },
  (num) => {
    // answer * random(2, 5) + random(1, 8) * oneForZero(answer);

    const modifierForZero = Decimal.mul(randomInt(1, 8), oneForZero(num));

    return num.mul(randomInt(2, 5)).plus(modifierForZero);
  },
  (num) => {
    // -answer * random(2, 5) +- random(1, 8) * oneForZero(answer);

    const modifierForZero = Decimal.mul(randomInt(1, 8), oneForZero(num)).mul(
      randomSign(),
    );

    return num.negated().mul(randomInt(2, 5)).plus(modifierForZero);
  },
  (num) => {
    // +-answer +- ceil(answer * uniform(.1, 1)) + random(-5, 5) * oneForZero()

    const modifier = num.mul(randomNumber(0.1, 1)).ceil().mul(randomSign());
    const modifierForZero = Decimal.mul(randomInt(-5, 5), oneForZero(num));

    return num.mul(randomSign()).plus(modifier).plus(modifierForZero);
  },
  (num) => {
    // +-answer +- random(1, 10) * 10^(digitsLength(answer) - 2) * oneForIntGt10(answer) + random(-15, 15) * oneForZero(answer)

    const modifierForIntGt10 = Decimal.pow(10, decimalDigits(num).minus(2))
      .mul(randomInt(1, 10))
      .mul(oneForIntGt10(num))
      .mul(randomSign());

    const modifierForZero = Decimal.mul(randomInt(-15, 15), oneForZero(num));

    return num.mul(randomSign()).plus(modifierForIntGt10).plus(modifierForZero);
  },
  (num) => {
    // ceil(answer * uniform(.1, 1)) +- random(1, 50) / 10 * oneForZero(answer)

    const modifier = num.mul(randomNumber(0.1, 1)).ceil();
    const modifierForZero = Decimal.div(randomInt(1, 50), 10)
      .mul(oneForZero(num))
      .mul(randomSign());

    return modifier.plus(modifierForZero);
  },
  (num) => {
    // prime = randomPrime(answer, { orElse: 1 })
    // intPrime = randomPrime(int(answer), { orElse: 1 })
    //
    // +-answer / prime +- randomElement([.2, .4, .6, .8, 1]) * oneForZero(answer) +- int(answer) / intPrime / 10 * oneForDecimal(answer)

    const prime = randomPrime(num.toNumber()) ?? 1;
    const intPrime = randomPrime(decimalToInt(num).toNumber()) ?? 1;

    const modifierForZero = Decimal.mul(
      randomElement([0.2, 0.4, 0.6, 0.8, 1]) ?? 0,
      oneForZero(num),
    ).mul(randomSign());

    const modifierForDecimal = Decimal.div(decimalToInt(num), intPrime)
      .div(10)
      .mul(oneForDecimal(num))
      .mul(randomSign());

    return num
      .mul(randomSign())
      .div(prime)
      .plus(modifierForZero)
      .plus(modifierForDecimal);
  },
  (num) => {
    // prime = randomPrime(answer, { orElse: 1 })
    // intPrime = randomPrime(int(answer), { orElse: 1 })
    //
    // +-answer / prime +- randomElement([2, 4, 6, 8, 10]) * oneForZero(answer) +- int(answer) / intPrime / 10 * oneForDecimal(answer)

    const prime = randomPrime(num.toNumber()) ?? 1;
    const intPrime = randomPrime(decimalToInt(num).toNumber()) ?? 1;

    const modifierForZero = Decimal.mul(
      randomElement([2, 4, 6, 8, 10]) ?? 0,
      oneForZero(num),
    ).mul(randomSign());

    const modifierForDecimal = Decimal.div(decimalToInt(num), intPrime)
      .div(10)
      .mul(oneForDecimal(num))
      .mul(randomSign());

    return num
      .mul(randomSign())
      .div(prime)
      .plus(modifierForZero)
      .plus(modifierForDecimal);
  },
  (num) => {
    // decimalPart = (answer - int(answer)) * 10^decimalPlaces(answer)
    //
    // +-answer +- randomElement([.5, 1, 1.5, 2]) * oneForZero(answer) +- decimalPart / randomPrime(decimalPart) / 10^decimalPlaces(answer)

    const decimalPart = num
      .minus(decimalToInt(num))
      .mul(Decimal.pow(10, num.decimalPlaces()));
    const decimalPartRandomPrime = randomPrime(decimalPart.toNumber()) ?? 1;

    const modifierForZero = Decimal.mul(
      randomElement([0.5, 1, 1.5, 2]) ?? 0,
      oneForZero(num),
    ).mul(randomSign());

    const modifier = decimalPart
      .div(decimalPartRandomPrime)
      .div(Decimal.pow(10, num.decimalPlaces()))
      .mul(randomSign());

    return num.mul(randomSign()).plus(modifierForZero).plus(modifier);
  },
  (num) => {
    // prime = randomPrime(answer, { orElse: 1 })
    // decimalPart = (answer - int(answer)) * 10^decimalPlaces(answer)
    //
    // +-answer +- answer / prime +- random(15, 30) * oneForZero(answer) +- decimalPart / randomPrime(decimalPart) / 10^decimalPlaces(answer)

    const prime = randomPrime(num.toNumber()) ?? 1;
    const decimalPart = num
      .minus(decimalToInt(num))
      .mul(Decimal.pow(10, num.decimalPlaces()));
    const decimalPartPrime = randomPrime(decimalPart.toNumber()) ?? 1;

    const modifier = num.div(prime).mul(randomSign());
    const modifierForZero = Decimal.mul(randomInt(15, 30), oneForZero(num)).mul(
      randomSign(),
    );
    const secondModifier = decimalPart
      .div(decimalPartPrime)
      .div(Decimal.pow(10, num.decimalPlaces()))
      .mul(randomSign());

    return num
      .mul(randomSign())
      .plus(modifier)
      .plus(modifierForZero)
      .plus(secondModifier);
  },
  (num) => {
    // +-answer * randomElement([.5, 2, .25, .75, 1.25, 1.5, 2.5, 7.5]) + randomElement([1, 1.5, 2, 2.5, 3, 3.5, 4]) * oneForZero(answer)

    const modifierForZero = Decimal.mul(
      randomElement([1, 1.5, 2, 2.5, 3, 3.5, 4]) ?? 0,
      oneForZero(num),
    );

    return num
      .mul(randomSign())
      .mul(randomElement([0.5, 2, 0.25, 0.75, 1.25, 1.5, 2.5, 7.5]) ?? 0)
      .plus(modifierForZero);
  },
  (num) => {
    // +-answer * ceil(uniform(.1, 1) * 10) / 10 + randomElement([1, 1.5, 2, 2.5, 3, 3.5, 4]) * oneForZero(answer)

    const multiplier = Decimal.mul(randomNumber(0.1, 1), 10).ceil().div(10);

    const modifierForZero = Decimal.mul(
      randomElement([1, 1.5, 2, 2.5, 3, 3.5, 4]) ?? 0,
      oneForZero(num),
    );

    return num.mul(randomSign()).mul(multiplier).plus(modifierForZero);
  },
  (num) => {
    // +-answer * ceil(uniform(.1, 1) * 100) / 100 + ceil(uniform(.1, 1) * 100) / 100 * oneForZero(answer)

    const multiplier = Decimal.mul(randomNumber(0.1, 1), 100).ceil().div(100);
    const modifierForZero = Decimal.mul(randomNumber(0.1, 1), 100)
      .ceil()
      .div(100)
      .mul(oneForZero(num));

    return num.mul(randomSign()).mul(multiplier).plus(modifierForZero);
  },
  (num) => {
    // answer +- random(0, abs(int(answer))) + random(0, 5) * oneForZero()

    const modifier = randomInt(0, num.abs().toNumber()) * randomSign();
    const modifierForZero = Decimal.mul(randomInt(0, 5), oneForZero(num));

    return num.plus(modifier).plus(modifierForZero);
  },
  (num) => {
    // abs(answer^2 * oneForLt10Positive(answer * 2) - answer * random(1, 20)) + random(1, 5) * oneForZero()

    const modifierForLt20Positive = num
      .pow(2)
      .mul(oneForLt10Positive(num.mul(2)))
      .abs();

    const modifier = num.mul(randomInt(1, 20)).negated();
    const modifierForZero = Decimal.mul(randomInt(1, 5), oneForZero(num));

    return modifierForLt20Positive.plus(modifier).plus(modifierForZero);
  },
  (num) => {
    // answer^2 * oneForLt10Positive(answer) + 10 +- answer * ceil(uniform(.1, 1) * 10) / 10 * oneForDecimal(answer) +- answer - random(1, 10) + random(1, 10) * oneForZero()

    const modifierForLt10Positive = num.pow(2).mul(oneForLt10Positive(num));

    const modifierForDecimal = num
      .mul(Decimal.mul(randomNumber(0.1, 1), 10).ceil())
      .div(10)
      .mul(oneForDecimal(num))
      .mul(randomSign());

    const modifierForZero = Decimal.mul(randomInt(1, 10), oneForZero(num));

    return modifierForLt10Positive
      .plus(10)
      .plus(modifierForDecimal)
      .plus(num.mul(randomSign()))
      .minus(randomInt(1, 10))
      .plus(modifierForZero);
  },
  (num) => {
    // prime1 = randomPrime(answer, { orElse: 1 })
    // prime2 = randomPrime(answer, { orElse: 1 })
    //
    // answer / prime1 + answer / prime2 +- random(1, 15) * oneForZero()

    const prime1 = randomPrime(num.toNumber()) ?? 1;
    const prime2 = randomPrime(num.toNumber()) ?? 1;

    const modifierForZero = Decimal.mul(randomInt(1, 15), oneForZero(num)).mul(
      randomSign(),
    );

    return num.div(prime1).plus(num.div(prime2)).plus(modifierForZero);
  },
  (num) => {
    // prime1 = randomPrime(answer, { orElse: 1 })
    // prime2 = randomPrime(answer, { orElse: 1 })
    // prime3 = randomPrime(answer, { orElse: 1 })
    //
    // +-answer / prime1 +- answer / prime2 +- random(1, 15) / 10 * oneForZero() + answer / prime3 - random(1, 10) * (answer - int(answer))

    const prime1 = randomPrime(num.toNumber()) ?? 1;
    const prime2 = randomPrime(num.toNumber()) ?? 1;
    const prime3 = randomPrime(num.toNumber()) ?? 1;

    const modifierForZero = Decimal.div(randomInt(1, 15), 10)
      .mul(oneForZero(num))
      .mul(randomSign());

    return num
      .mul(randomSign())
      .div(prime1)
      .plus(num.div(prime2).mul(randomSign()))
      .plus(modifierForZero)
      .plus(num.div(prime3))
      .minus(Decimal.mul(randomInt(1, 10), num.minus(decimalToInt(num))));
  },
  (num) => {
    // prime1 = randomPrime(answer, { orElse: 1 })
    // prime2 = randomPrime(answer, { orElse: 1 })
    //
    // answer / prime1 + answer / prime2 + random(1, 100) / 100 * oneForZero()

    const prime1 = randomPrime(num.toNumber()) ?? 1;
    const prime2 = randomPrime(num.toNumber()) ?? 1;

    const modifierForZero = Decimal.div(randomInt(1, 100), 100).mul(
      oneForZero(num),
    );

    return num.div(prime1).plus(num.div(prime2)).plus(modifierForZero);
  },

  (num) => {
    // prime1 = randomPrime(answer, { orElse: 1 })
    // prime2 = randomPrime(answer, { orElse: 1 })
    // prime3 = randomPrime(answer, { orElse: 1 })
    //
    // answer / prime1 + answer / prime2 + random(1, 15) * oneForZero() + answer / prime3 - random(1, 10) * (answer - int(answer))

    const prime1 = randomPrime(num.toNumber()) ?? 1;
    const prime2 = randomPrime(num.toNumber()) ?? 1;
    const prime3 = randomPrime(num.toNumber()) ?? 1;

    const modifierForZero = Decimal.mul(randomInt(1, 15), oneForZero(num));

    return num
      .div(prime1)
      .plus(num.div(prime2))
      .plus(modifierForZero)
      .plus(num.div(prime3))
      .minus(Decimal.mul(randomInt(1, 10), num.minus(decimalToInt(num))));
  },
  (num) => {
    // decimalZeros = 10^decimalPlaces(answer)
    //
    // answer +- random(1, decimalZeros) / decimalZeros + randomSign()

    const decimalZeros = Decimal.pow(10, num.decimalPlaces());

    const modifier = Decimal.div(
      randomInt(1, decimalZeros.toNumber()),
      decimalZeros,
    ).mul(randomSign());

    return num.plus(modifier).plus(randomSign());
  },
  (num) => {
    // answer +- randomElement([1, 2])

    const modifier = Decimal.mul(randomElement([1, 2]) ?? 0, randomSign());

    return num.plus(modifier);
  },
  (num) => {
    // answer +- randomElement([1, 2, 3, 4 ,5]) / 10^(decimalplaces(answer))

    const modifier = Decimal.div(
      randomElement([1, 2, 3, 4, 5]) ?? 0,
      Decimal.pow(10, num.decimalPlaces()),
    ).mul(randomSign());

    return num.plus(modifier);
  },
  (num) => {
    // answer * randomElement([.1, 10]) +- randomElement([.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9 2]) * oneForZero(answer)

    const modifierForZero = Decimal.mul(
      randomElement([
        0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5,
        1.6, 1.7, 1.8, 1.9, 2,
      ]) ?? 0,
      oneForZero(num),
    );

    return num.mul(randomElement([0.1, 10]) ?? 0).plus(modifierForZero);
  },
  (num) => {
    // answer * randomElement([.01, 100]) +- randomElement([.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9 2]) * oneForZero(answer)

    const modifierForZero = Decimal.mul(
      randomElement([
        0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5,
        1.6, 1.7, 1.8, 1.9, 2,
      ]) ?? 0,
      oneForZero(num),
    ).mul(randomSign());

    return num.mul(randomElement([0.01, 100]) ?? 0).plus(modifierForZero);
  },
  (num) => {
    // answer +- randomElement([.1, .2, .3, .4, .5, .6, .7, .8, .9]) * oneForDecimal(answer) +- answer * oneForInt() +- random(5, 15) * oneForZero()

    const modifierForDecimal = Decimal.mul(
      randomElement([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) ?? 0,
      oneForDecimal(num),
    ).mul(randomSign());

    const modifierForInt = num.mul(oneForInt(num)).mul(randomSign());
    const modifierForZero = Decimal.mul(randomInt(5, 15), oneForZero(num)).mul(
      randomSign(),
    );

    return num
      .plus(modifierForDecimal)
      .plus(modifierForInt)
      .plus(modifierForZero);
  },
  (num) => {
    // answer * randomElement([7, 6, 8, 12, 11, 15]) + random(1, 10) * oneForZero(answer)

    const modifierForZero = Decimal.mul(randomInt(1, 10), oneForZero(num));

    return num
      .mul(randomElement([7, 6, 8, 12, 11, 15]) ?? 0)
      .plus(modifierForZero);
  },
  (num) => {
    // answer * random(1, 15) +- randomElement([
    //     .5, 1, 1.3, 2, 2.9, 3, 3.2, 4, 4.1, 5, 5.5, 6, 6.6, 7, 7.3, 8, 8.5, 9, 9.5, 10
    // ]) * oneForZero(answer)

    const modifierForZero = Decimal.mul(
      randomElement([
        0.5, 1, 1.3, 2, 2.9, 3, 3.2, 4, 4.1, 5, 5.5, 6, 6.6, 7, 7.3, 8, 8.5, 9,
        9.5, 10,
      ]) ?? 0,
      oneForZero(num),
    ).mul(randomSign());

    return num.mul(randomInt(1, 15)).plus(modifierForZero);
  },
  (num) => {
    // answer +- random(2, 10) * ceil(answer / 10) +- random(2, 5) * floor(answer / 100) +- floor(answer * uniform(2, 4)) + randomSign()

    const modifier = Decimal.mul(randomInt(2, 10), num.div(10).ceil()).mul(
      randomSign(),
    );
    const secondModifier = Decimal.mul(
      randomInt(2, 5),
      num.div(100).floor(),
    ).mul(randomSign());
    const thirdModifier = num.mul(randomNumber(2, 4)).floor().mul(randomSign());

    return num
      .plus(modifier)
      .plus(secondModifier)
      .plus(thirdModifier)
      .plus(randomSign());
  },
  (num) => {
    // (answer - int(answer)) * random(2, 5) +- answer +- random(1, 20) * oneForInt(answer)

    const modifier = num
      .minus(decimalToInt(num))
      .mul(randomInt(2, 5))
      .mul(randomSign());

    const modifierForInt = Decimal.mul(randomInt(1, 20), oneForInt(num)).mul(
      randomSign(),
    );

    return modifier.plus(num.mul(randomSign())).plus(modifierForInt);
  },
  (num) => {
    // +- 10 * answer +- answer +- randomElement([.3, .45, .6, .75, .9, 1.05, 1.2]) * oneForZero(answer)

    const modifierForZero = Decimal.mul(
      randomElement([0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2]) ?? 0,
      oneForZero(num),
    ).mul(randomSign());

    return Decimal.mul(10, num)
      .mul(randomSign())
      .plus(num.mul(randomSign()))
      .plus(modifierForZero);
  },
  (num) => {
    // answer + random(11, 15) * oneForInt +- random(1, 10^(decimalPlaces(answer))) / 10^(decimalPlaces(answer)) * oneForDecimal +- randomElement(1, 10) * randomElement(1, 10) / 100 * oneForZero(answer)

    const modifierForInt = Decimal.mul(randomInt(11, 15), oneForInt(num));
  },
  (num) => {
    //   get every digit of number
    // manipulate by + random(1, 10) % 10
    return num;
  },
];
