import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@entities/entityEnums';
import { Roles } from '@modules/authentication/decorator/roles.decorator';
import { MediaFileQueryService } from '@modules/mediaFile';
import {
  IdentifierInput,
  SuccessObject,
  LastIdPageParamsObject,
} from '@shared/gql';

import { CreateMathProblemInput } from './gql/createMathProblem.input';
import { MathProblemPageObject } from './gql/mathProblemPage.object';
import { MathProblemObject } from './gql/mathProfilem.object';
import { UpdateMathProblemInput } from './gql/updateMathProblem.input';
import { MathProblemCrudService } from './mathProblemCrud.service';

@Resolver()
export class MathProblemResolver {
  constructor(
    private readonly mathProblemCrudService: MathProblemCrudService,
    private readonly mediaFileCrudService: MediaFileQueryService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => MathProblemObject)
  async createMathProblem(
    @Args('input') input: CreateMathProblemInput,
  ): Promise<MathProblemObject> {
    const { imageMediaIds, ...restOfInput } = input;

    const mathProblem = await this.mathProblemCrudService.create({
      ...restOfInput,
      imageMediaIds: imageMediaIds ?? [],
    });

    const images = imageMediaIds?.length
      ? await this.mediaFileCrudService.getByIds(imageMediaIds)
      : [];

    return { ...mathProblem, images };
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => MathProblemObject)
  async updateMathProblem(
    @Args('input') input: UpdateMathProblemInput,
  ): Promise<MathProblemObject> {
    const { id, ...values } = input;

    const mathProblem = await this.mathProblemCrudService.updateById(id, {
      ...(values.difficulty && { difficulty: values.difficulty }),
      ...(values.text && { text: values.text }),
      ...(values.tex && { tex: values.tex }),
      ...(values.mathFieldId && { mathFieldId: values.mathFieldId }),
      ...(values.mathSubFieldId && { mathSubFieldId: values.mathSubFieldId }),
      ...(values.imageMediaIds && { imageMediaIds: values.imageMediaIds }),
    });

    const images = mathProblem.imageMediaIds?.length
      ? await this.mediaFileCrudService.getByIds(mathProblem.imageMediaIds)
      : [];

    return { ...mathProblem, images };
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SuccessObject)
  async deleteMathProblem(
    @Args('input') input: IdentifierInput,
  ): Promise<SuccessObject> {
    await this.mathProblemCrudService.deleteById(input.id);

    return { success: true };
  }

  @Query(() => MathProblemObject)
  async getMathProblemById(
    @Args('input') input: IdentifierInput,
  ): Promise<MathProblemObject> {
    const mathProblem = await this.mathProblemCrudService.getById(input.id);

    const images = mathProblem.imageMediaIds?.length
      ? await this.mediaFileCrudService.getByIds(mathProblem.imageMediaIds)
      : [];

    return { ...mathProblem, images };
  }

  @Query(() => MathProblemPageObject)
  async filterMathProblems(
    @Args('input') input: LastIdPageParamsObject,
  ): Promise<MathProblemPageObject> {
    return this.mathProblemCrudService.filter(input);
  }
}
