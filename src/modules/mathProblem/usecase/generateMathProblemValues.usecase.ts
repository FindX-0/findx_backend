import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Decimal from 'decimal.js';

import { MathProblemAnswerGenerator } from './mathProblemAnswerGenerator';
import { ExceptionMessageCode } from '../../../shared/constant';
import { StringPosition } from '../../../shared/type/string.type';
import {
  arrayChunks,
  arrayEqualsIgnoreOrder,
  generateNumRange,
  groupByToMap,
  product,
} from '../../../shared/util';
import { solveTexExpression } from '../../../shared/util/solveTexExpression';
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
  constructor(
    private readonly mathProblemAnswerGenerator: MathProblemAnswerGenerator,
  ) {}

  /**
   * @param template example: "#0 #1 #2"
   */
  async call({
    template,
    numberParams,
    customStrParams,
    mathSubFieldId,
    answerConditionFunc,
    correctAnswerConditionFunc,
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

    const generatedParams = templateParams
      .map((param) =>
        this.typedTemplateParamToGeneratedTemplateParam(
          param,
          templatePlaceholders,
        ),
      )
      .sort((a, b) => (a.index > b.index ? 1 : -1));

    const replaceParamsProduct = Array.from(
      product(
        ...generatedParams.map((e) => {
          switch (e.__type) {
            case ParamType.NUMBERS:
              return e.numbers;
            case ParamType.CUSTOM_STRINGS:
              return e.customStrings;
          }
        }),
      ),
    );

    const generatedValues: GeneratedNewMathProblemValues[] = [];
    for (const replaceParamsChunk of arrayChunks(replaceParamsProduct, 10)) {
      const values: GeneratedNewMathProblemValues[] = await Promise.all(
        replaceParamsChunk.map(async (chunk) => {
          const tex = this.templateWithParams(template, chunk, generatedParams);

          const correctAnswer = await this.solveCorrectAnswerOnlyNumber(tex);
          if (!correctAnswer) {
            return { answers: null, tex };
          }

          const answerPassesCondition =
            !correctAnswerConditionFunc ||
            new Function('num', correctAnswerConditionFunc)(correctAnswer);

          if (!answerPassesCondition) {
            return { answers: null, tex };
          }

          const answers = await this.mathProblemAnswerGenerator.call({
            tex,
            correctAnswer,
            mathSubFieldId,
            answerConditionFunc,
          });

          return { answers, tex };
        }),
      );

      const filteredValues = values.filter((e) => e.answers && e.tex);

      generatedValues.push(...filteredValues);
    }

    return generatedValues;
  }

  private templateWithParams(
    template: string,
    replaceParams: (string | number)[],
    generatedParams: GeneratedTemplateParam[],
  ): string {
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

    return templated;
  }

  private typedTemplateParamToGeneratedTemplateParam(
    param: TypedTemplateParam,
    templatePlaceholders: TemplatePlaceholder[],
  ): GeneratedTemplateParam {
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

  private async solveCorrectAnswerOnlyNumber(
    tex: string,
  ): Promise<Decimal | null> {
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

    return correctAnswer;
  }
}
