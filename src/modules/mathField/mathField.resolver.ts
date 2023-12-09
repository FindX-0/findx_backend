import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@entities/entityEnums';
import { NoAuth } from '@modules/authentication';
import { Roles } from '@modules/authentication/decorator/roles.decorator';
import {
  IdentifierInput,
  SuccessObject,
  LastIdPageParamsObject,
} from '@shared/gql';

import { CreateMathFieldInput } from './gql/createMathField.input';
import { GetAllMathFieldsInput } from './gql/getAllMathFields.input';
import { MathFieldObject } from './gql/mathField.object';
import { MathFieldPageObject } from './gql/mathFIeldPage.object';
import { UpdateMathFieldInput } from './gql/updateMathField.input';
import { MathFieldMutationService } from './mathFieldMutation.service';
import { MathFieldQueryService } from './mathFieldQuery.service';

@Resolver()
export class MathFieldResolver {
  constructor(
    private readonly mathFieldMutationService: MathFieldMutationService,
    private readonly mathFieldQueryService: MathFieldQueryService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => MathFieldObject)
  async createMathField(
    @Args('input') input: CreateMathFieldInput,
  ): Promise<MathFieldObject> {
    return this.mathFieldMutationService.create(input);
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => MathFieldObject)
  async updateMathField(
    @Args('input') input: UpdateMathFieldInput,
  ): Promise<MathFieldObject> {
    const { id, ...values } = input;

    return this.mathFieldMutationService.updateById(id, {
      ...(values.name && { name: values.name }),
    });
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SuccessObject)
  async deleteMathField(
    @Args('input') input: IdentifierInput,
  ): Promise<SuccessObject> {
    await this.mathFieldMutationService.deleteById(input.id);

    return { success: true };
  }

  @Query(() => MathFieldObject)
  async getMathFieldById(
    @Args('input') input: IdentifierInput,
  ): Promise<MathFieldObject> {
    return this.mathFieldQueryService.getById(input.id);
  }

  @Query(() => MathFieldPageObject)
  async filterMathFields(
    @Args('input') input: LastIdPageParamsObject,
  ): Promise<MathFieldPageObject> {
    return this.mathFieldQueryService.filter(input);
  }

  @NoAuth()
  @Query(() => [MathFieldObject])
  async getAllMathFields(
    @Args('input') input: GetAllMathFieldsInput,
  ): Promise<MathFieldObject[]> {
    return this.mathFieldQueryService.getAll(input);
  }
}
