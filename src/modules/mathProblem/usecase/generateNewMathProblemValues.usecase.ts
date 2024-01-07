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
} from '../../../shared/util';

enum ParamType {
  NUMBERS,
  CUSTOM_STRINGS,
}

type GeneratedNewMathProblemValues = {
  correctAnswer: string;
  mathFieldId: string;
  mathSubFieldId: string;
  tex: string;
};

type TemplateNumberParam = {
  index: number;
  min: number;
  max: number;
  step: number;
};

type TypedTemplateNumberParam = TemplateNumberParam & {
  __type: ParamType.NUMBERS;
};

type TemplateCustomStrParam = {
  index: number;
  values: string;
};

type TypedTemplateCustomStrParam = TemplateCustomStrParam & {
  __type: ParamType.CUSTOM_STRINGS;
};

type GenerateNewMathProblemValuesArgs = {
  template: string;
  numberParams: TemplateNumberParam[];
  customStrParams: TemplateCustomStrParam[];
  mathFieldId: string;
  mathSubFieldId: string;
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
export class GenerateMathProblems {
  /**
   * @param template example: "#0 #1 #2"
   */
  async call({
    template,
    numberParams,
    customStrParams,
    mathFieldId,
    mathSubFieldId,
  }: GenerateNewMathProblemValuesArgs): Promise<
    GeneratedNewMathProblemValues[]
  > {
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

    const generatedTemplateCount = generatedParams.reduce(
      (prev, curr) => prev * this.getTemplateParamCount(curr),
      1,
    );

    const generatedValues: GeneratedNewMathProblemValues[] = [];
    const templateParamIndices = generatedParams.map((param) => ({
      ...param,
      replaceParamIndex: 0,
      paramCount: this.getTemplateParamCount(param),
    }));

    const changingIndex = 0;
    for (let i = 0; i < generatedTemplateCount; i++) {
      let templated = template;
      console.log('template = ' + template);

      for (const templateParamIndex of templateParamIndices) {
        let replaceParam: string | undefined;

        switch (templateParamIndex.__type) {
          case ParamType.NUMBERS:
            replaceParam =
              templateParamIndex.numbers[
                templateParamIndex.replaceParamIndex
              ]?.toString();

            break;
          case ParamType.CUSTOM_STRINGS:
            replaceParam =
              templateParamIndex.customStrings[
                templateParamIndex.replaceParamIndex
              ];

            break;
        }

        if (!replaceParam) {
          throw new InternalServerErrorException('replace param is undefined');
        }

        console.log({
          templated,
          placeholder: templateParamIndex.placeholder,
          replaceParam,
        });
        templated = templated.replace(
          templateParamIndex.placeholder,
          replaceParam,
        );
      }

      console.log(templated);

      break;

      // generatedValues.push({
      //   correctAnswer: '',
      //   mathFieldId,
      //   mathSubFieldId,
      //   tex: templated,
      // });

      // const changingTemplateParamIndex = templateParamIndices.find(
      //   (e) => e.index === changingIndex,
      // );

      // if (!changingTemplateParamIndex) {
      //   break;
      // }

      // if (changingTemplateParamIndex.index) {
      // }
    }

    console.log(generatedValues);

    return [];
  }

  private getTemplateParamCount(templateParam: GeneratedTemplateParam): number {
    return templateParam.__type === ParamType.NUMBERS
      ? templateParam.numbers.length
      : templateParam.customStrings.length;
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
