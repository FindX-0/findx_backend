import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@entities/entityEnums';
import { Roles } from '@modules/authentication/decorator/roles.decorator';
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
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => MathProblemObject)
  async createMathProblem(
    @Args('input') input: CreateMathProblemInput,
  ): Promise<MathProblemObject> {
    return this.mathProblemCrudService.create({ ...input, imagePaths: [] });
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => MathProblemObject)
  async updateMathProblem(
    @Args('input') input: UpdateMathProblemInput,
  ): Promise<MathProblemObject> {
    const { id, ...values } = input;

    values;

    return this.mathProblemCrudService.updateById(id, {
      ...(values.difficulty && { difficulty: values.difficulty }),
      ...(values.text && { text: values.text }),
      ...(values.tex && { tex: values.tex }),
      ...(values.mathFieldId && { mathFieldId: values.mathFieldId }),
      ...(values.mathSubFieldId && { mathSubFieldId: values.mathSubFieldId }),
    });
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
    return this.mathProblemCrudService.getById(input.id);
  }

  @Query(() => MathProblemPageObject)
  async filterMathProblems(
    @Args('input') input: LastIdPageParamsObject,
  ): Promise<MathProblemPageObject> {
    return this.mathProblemCrudService.filter(input);
  }
}
