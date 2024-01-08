import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '../../../shared/constant';
import { StringPosition } from '../../../shared/type/string.type';
import {
  arrayEqualsIgnoreOrder,
  generateNumRange,
  groupByToMap,
  product,
} from '../../../shared/util';
import {
  GenerateMathProblemValuesArgs,
  GeneratedNewMathProblemValues,
  TemplateCustomStrParam,
  TemplateNumberParam,
} from '../mathProblem.type';

enum ParamType {
  NUMBERS,
  CUSTOM_STRINGS,
}

type TypedTemplateNumberParam = TemplateNumberParam & {
  __type: ParamType.NUMBERS;
};

type TypedTemplateCustomStrParam = TemplateCustomStrParam & {
  __type: ParamType.CUSTOM_STRINGS;
};

type TemplatePlaceholder = {
  templateParamIndex: number;
  positions: StringPosition[];
  placeholder: string;
};

type TypedTemplateParam =
  | TypedTemplateNumberParam
  | TypedTemplateCustomStrParam;

type GeneratedTemplateParam = {
  index: number;
  positions: StringPosition[];
  placeholder: string;
} & (
  | { __type: ParamType.NUMBERS; numbers: number[] }
  | { __type: ParamType.CUSTOM_STRINGS; customStrings: string[] }
);

@Injectable()
export class GenerateMathProblemValues {
  /**
   * @param template example: "#0 #1 #2"
   */
  async call({
    template,
    numberParams,
    customStrParams,
    mathFieldId,
    mathSubFieldId,
  }: GenerateMathProblemValuesArgs): Promise<GeneratedNewMathProblemValues[]> {
    const templatePlaceholders = this.parseTemplatePlaceholders(template);

    const templateParams: TypedTemplateParam[] = [
      ...numberParams.map((e) => ({
        ...e,
        __type: ParamType.NUMBERS as const,
      })),
      ...customStrParams.map((e) => ({
        ...e,
        __type: ParamType.CUSTOM_STRINGS as const,
      })),
    ];

    this.validateTemplateParamIndices(templateParams, templatePlaceholders);

    const generatedParams: GeneratedTemplateParam[] = templateParams
      .map<GeneratedTemplateParam>((param) => {
        const templatePlaceholder = templatePlaceholders.find(
          (placeholder) => placeholder.templateParamIndex === param.index,
        );

        if (!templatePlaceholder) {
          throw new BadRequestException(
            ExceptionMessageCode.INVALID_TEMPLATE_PARAMS,
          );
        }

        if (param.__type === ParamType.NUMBERS) {
          const numbers = generateNumRange(param.min, param.max, param.step);

          return {
            index: param.index,
            placeholder: templatePlaceholder.placeholder,
            numbers,
            positions: templatePlaceholder.positions,
            __type: ParamType.NUMBERS,
          };
        }

        const customStrings = param.values?.split(',') ?? [];

        if (!customStrings.length) {
          throw new BadRequestException(
            ExceptionMessageCode.INVALID_CUSTOM_STRING_PARAMS,
          );
        }

        return {
          index: param.index,
          placeholder: templatePlaceholder.placeholder,
          customStrings,
          positions: templatePlaceholder.positions,
          __type: ParamType.CUSTOM_STRINGS,
        };
      })
      .sort((a, b) => (a.index > b.index ? 1 : -1));

    const replaceParamsProduct = product(
      ...generatedParams.map((e) => {
        switch (e.__type) {
          case ParamType.NUMBERS:
            return e.numbers;
          case ParamType.CUSTOM_STRINGS:
            return e.customStrings;
        }
      }),
    );

    const generatedValues: GeneratedNewMathProblemValues[] = [];
    for (const replaceParams of replaceParamsProduct) {
      let templated = template;

      for (let i = 0; i < replaceParams.length; i++) {
        const generatedParam = generatedParams[i];

        if (!generatedParam) {
          throw new InternalServerErrorException('templateParam not found');
        }

        const replaceParam = replaceParams[i];

        if (!replaceParam) {
          throw new InternalServerErrorException('replace param is undefined');
        }

        templated = templated.replace(
          new RegExp(generatedParam.placeholder, 'g'),
          replaceParam?.toString(),
        );
      }

      generatedValues.push({
        correctAnswer: '',
        mathFieldId,
        mathSubFieldId,
        tex: templated,
      });
    }

    generatedValues.map((e) => e.tex).forEach((e) => console.log(e));

    return generatedValues;
  }

  private validateTemplateParamIndices(
    templateParams: TypedTemplateParam[],
    templatePlaceholders: TemplatePlaceholder[],
  ): void {
    const templatePlaceholderIndices = templatePlaceholders.map(
      (e) => e.templateParamIndex,
    );
    const templateParamIndices = templateParams.map((e) => e.index);

    if (
      !arrayEqualsIgnoreOrder(templateParamIndices, templatePlaceholderIndices)
    ) {
      throw new BadRequestException(
        ExceptionMessageCode.INVALID_TEMPLATE_PARAMS,
      );
    }
  }

  private parseTemplatePlaceholders(template: string): TemplatePlaceholder[] {
    const templateParamRegexp = /#(\d)/g;

    return Array.from(
      groupByToMap<number, RegExpMatchArray>(
        Array.from(template.matchAll(templateParamRegexp)),
        (m) => {
          const templateParamIndex = m[1];
          const parsedTemplateParamIndex = parseInt(
            templateParamIndex ?? 'INVALID_INT',
          );

          if (isNaN(parsedTemplateParamIndex)) {
            return -1;
          }

          return parsedTemplateParamIndex;
        },
      ).entries(),
    ).map(([templateParamIndex, matches]) => {
      const firstMatch = matches[0];

      if (!firstMatch?.input) {
        throw new InternalServerErrorException('first match input not found');
      }

      return {
        templateParamIndex,
        placeholder: firstMatch[0],
        positions:
          matches?.map((m) => ({
            startIndex: m.index ?? -1,
            endIndex: (m.index ?? -1) + (m[m.length - 2]?.length ?? 0) - 1,
          })) ?? [],
      };
    });
  }
}

// accept if we want only non-negatives
// and generate till it satisfies,
// if looping throw
// function primeFactors(n: number) {
//   const arr: number[] = [];
//   let i = 2;
//   while (i <= n) {
//     if (n % i == 0) {
//       n = n / i;
//       arr.push(i);
//     } else {
//       i++;
//     }
//   }
//   return arr;
// }
