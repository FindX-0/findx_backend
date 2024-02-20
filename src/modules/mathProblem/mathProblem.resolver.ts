import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@entities/index';
import {
  SuccessObject,
  IdentifierInput,
  LastIdPageParamsObject,
} from '@shared/gql';

import { BulkCreateMathProblemInput } from './gql/createMathProblem/bulkCreateMathPropblem.input';
import { CreateMathProblemInput } from './gql/createMathProblem/createMathProblem.input';
import { CreateMathProblemResObject } from './gql/createMathProblem/createMathProblemRes.object';
import { CountGenerateMathProblemValuesInput } from './gql/generateMathProblem/countGenerateMathProblemValues.input';
import { GenerateMathProblemValuesInput } from './gql/generateMathProblem/generateMathProblemValues.input';
import { GenerateMathProblemValuesObject } from './gql/generateMathProblem/generateMathProblemValues.object';
import { MathProblemObject } from './gql/mathProblem/mathProblem.object';
import { MathProblemPageObject } from './gql/mathProblemPage.object';
import { UpdateMathProblemInput } from './gql/updateMathProblem.input';
import { MathProblemMutationService } from './mathProblemMutation.service';
import { MathProblemQueryService } from './mathProblemQuery.service';
import { CountGenerateMathProblemValues } from './usecase/countGenerateMathProblemValues.usecase';
import { GenerateMathProblemValues } from './usecase/generateMathProblemValues.usecase';
import { CountObject } from '../../shared/gql/count.object';
import { Roles } from '../authentication/decorator/roles.decorator';
import { MediaFileQueryService } from '../mediaFile/mediaFileQuery.service';

@Resolver()
export class MathProblemResolver {
  constructor(
    private readonly mathProblemQueryService: MathProblemQueryService,
    private readonly mathProblemMutationService: MathProblemMutationService,
    private readonly mediaFileCrudService: MediaFileQueryService,
    private readonly generateNewMathProblemValuesUsecase: GenerateMathProblemValues,
    private readonly countGenerateMathProblemValuesUsecase: CountGenerateMathProblemValues,
  ) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => CreateMathProblemResObject)
  async createMathProblem(
    @Args('input') input: CreateMathProblemInput,
  ): Promise<CreateMathProblemResObject> {
    return this.mathProblemMutationService.create({
      ...input,
      imageMediaIds: input.imageMediaIds ?? [],
    });
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => [CreateMathProblemResObject])
  async bulkCreateMathProblem(
    @Args('input') input: BulkCreateMathProblemInput,
  ): Promise<CreateMathProblemResObject[]> {
    return this.mathProblemMutationService.bulkCreate(
      input.values.map((e) => ({
        ...e,
        imageMediaIds: e.imageMediaIds ?? [],
        generatedBatchName: input.generatedBatchName,
      })),
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => MathProblemObject)
  async updateMathProblem(
    @Args('input') input: UpdateMathProblemInput,
  ): Promise<MathProblemObject> {
    const { id, ...values } = input;

    const mathProblem = await this.mathProblemMutationService.updateById(id, {
      ...(values.difficulty && { difficulty: values.difficulty }),
      ...(values.text && { text: values.text }),
      ...(values.tex && { tex: values.tex }),
      ...(values.mathFieldId && { mathFieldId: values.mathFieldId }),
      ...(values.mathSubFieldId && { mathSubFieldId: values.mathSubFieldId }),
      ...(values.imageMediaIds && { imageMediaIds: values.imageMediaIds }),
      ...(values.answers && { answers: values.answers }),
    });

    const images = mathProblem.imageMediaIds?.length
      ? await this.mediaFileCrudService.getByIds(mathProblem.imageMediaIds)
      : [];

    return { ...mathProblem, images };
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => SuccessObject)
  async deleteMathProblem(
    @Args('input') input: IdentifierInput,
  ): Promise<SuccessObject> {
    await this.mathProblemMutationService.deleteById(input.id);

    return { success: true };
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Query(() => MathProblemObject)
  async getMathProblemById(
    @Args('input') input: IdentifierInput,
  ): Promise<MathProblemObject> {
    const mathProblem = await this.mathProblemQueryService.getById(input.id);

    const images = mathProblem.imageMediaIds?.length
      ? await this.mediaFileCrudService.getByIds(mathProblem.imageMediaIds)
      : [];

    return { ...mathProblem, images };
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Query(() => MathProblemPageObject)
  async filterMathProblems(
    @Args('input') input: LastIdPageParamsObject,
  ): Promise<MathProblemPageObject> {
    return this.mathProblemQueryService.filter({
      ...input,
      includeMathField: true,
      includeMathSubField: true,
    });
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Query(() => [GenerateMathProblemValuesObject])
  async generateMathProblemValues(
    @Args('input') input: GenerateMathProblemValuesInput,
  ): Promise<GenerateMathProblemValuesObject[]> {
    return this.generateNewMathProblemValuesUsecase.call(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Query(() => CountObject)
  async countGenerateMathProblemValues(
    @Args('input') input: CountGenerateMathProblemValuesInput,
  ): Promise<CountObject> {
    const count = await this.countGenerateMathProblemValuesUsecase.call(input);

    return { count };
  }
}
