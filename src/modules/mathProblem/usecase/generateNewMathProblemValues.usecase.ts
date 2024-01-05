import { BadRequestException, Injectable } from '@nestjs/common';

import { ExceptionMessageCode } from '../../../shared/constant';
import {
  arrayEqualsIgnoreOrder,
  generateNumRange,
  groupByToMap,
} from '../../../shared/util';

type GeneratedNewMathProblemValues = {
  correctAnswer: string;
  mathFieldId: string;
  mathSubFieldId: string;
  tex: string;
};

type TemplateNumberParam = {
  __type: 'number';
  index: number;
  min: number;
  max: number;
  step: number;
};

type TemplateCustomStrParam = {
  __type: 'customStr';
  index: number;
  values: string;
};

type GenerateNewMathProblemValuesArgs = {
  template: string;
  numberParams: TemplateNumberParam[];
  customStrParams: TemplateCustomStrParam[];
};

type TemplatePlaceholder = {
  templateParamIndex: number;
  indices: {
    startIndex: number;
    endIndex: number;
  }[];
};

type TemplateParam = TemplateNumberParam | TemplateCustomStrParam;

@Injectable()
export class GenerateMathProblems {
  /**
   * @param template example: "#0 #1 #2"
   */
  async call({
    template,
    numberParams,
    customStrParams,
  }: GenerateNewMathProblemValuesArgs): Promise<
    GeneratedNewMathProblemValues[]
  > {
    const templatePlaceholders = this.parseTemplatePlaceholders(template);

    const templateParams: TemplateParam[] = [
      ...numberParams,
      ...customStrParams,
    ];

    this.validateTemplateParamIndices(templateParams, templatePlaceholders);

    const generatedNumberParams = numberParams.map((param) => {
      const numbers = generateNumRange(param.min, param.max, param.step);

      return { index: param.index, numbers };
    });

    const generatedCustomStrParams = customStrParams.map((param) => {
      const customStrings = param.values.split(',');

      if (!customStrings.length) {
        throw new BadRequestException(
          ExceptionMessageCode.INVALID_CUSTOM_STRING_PARAMS,
        );
      }

      return { index: param.index, customStrings };
    });

    return [];
  }

  private validateTemplateParamIndices(
    templateParams: TemplateParam[],
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
        (e) => {
          const templateParamIndex = e[1];
          const parsedTemplateParamIndex = parseInt(
            templateParamIndex ?? 'INVALID_INT',
          );

          if (isNaN(parsedTemplateParamIndex)) {
            return -1;
          }

          return parsedTemplateParamIndex;
        },
      ).entries(),
    ).map(([templateParamIndex, matches]) => ({
      templateParamIndex,
      indices:
        matches?.map((m) => ({
          startIndex: m.index ?? -1,
          endIndex: (m.index ?? -1) + (m[m.length - 2]?.length ?? 0) - 1,
        })) ?? [],
    }));
  }
}
