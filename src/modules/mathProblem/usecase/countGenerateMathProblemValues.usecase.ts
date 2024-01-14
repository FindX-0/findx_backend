import { Injectable } from '@nestjs/common';

import { CountGenerateMathProblemValuesArgs } from '../mathProblem.type';

@Injectable()
export class CountGenerateMathProblemValues {
  async call({
    numberParams,
    customStrParams,
  }: CountGenerateMathProblemValuesArgs): Promise<number> {
    if (!numberParams.length && !customStrParams.length) {
      return 0;
    }

    let count = 1;

    for (const numberParam of numberParams) {
      const numberCount = Math.floor(
        (numberParam.max - numberParam.min) / numberParam.step,
      );

      if (numberCount <= 1) {
        continue;
      }

      count *= numberCount;
    }

    for (const strParam of customStrParams) {
      const strParamCount = strParam.values.split(',').length;

      if (strParamCount <= 1) {
        continue;
      }

      count *= strParamCount;
    }

    return count;
  }
}
