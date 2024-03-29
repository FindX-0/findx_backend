import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@entities/index';
import { SuccessObject, IdentifierInput } from '@shared/gql';

import { CreateMathSubFieldInput } from './gql/createMathSubField.input';
import { FilterMathSubFieldsInput } from './gql/filterMathSubFields.input';
import { MathSubFieldWithRelationsObject } from './gql/mathSubField/mathSubFieldWithRelations.object';
import { MathSubFieldPageObject } from './gql/mathSubFIeldPage.object';
import { UpdateMathSubFieldInput } from './gql/updateMathSubField.input';
import { MathSubFieldMutationService } from './mathSubFieldMutation.service';
import { MathSubFieldQueryService } from './mathSubFieldQuery.service';
import { Roles } from '../authentication/decorator/roles.decorator';

@Resolver()
export class MathSubFieldResolver {
  constructor(
    private readonly mathSubFieldMutationService: MathSubFieldMutationService,
    private readonly mathSubFielQueryService: MathSubFieldQueryService,
  ) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => MathSubFieldWithRelationsObject)
  async createMathSubField(
    @Args('input') input: CreateMathSubFieldInput,
  ): Promise<MathSubFieldWithRelationsObject> {
    return this.mathSubFieldMutationService.create(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => MathSubFieldWithRelationsObject)
  async updateMathSubField(
    @Args('input') input: UpdateMathSubFieldInput,
  ): Promise<MathSubFieldWithRelationsObject> {
    const { id, ...values } = input;

    return this.mathSubFieldMutationService.updateById(id, {
      ...(values.name && { name: values.name }),
      ...(values.mathFieldId && { mathFieldId: values.mathFieldId }),
    });
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => SuccessObject)
  async deleteMathSubField(
    @Args('input') input: IdentifierInput,
  ): Promise<SuccessObject> {
    await this.mathSubFieldMutationService.deleteById(input.id);

    return { success: true };
  }

  @Query(() => MathSubFieldWithRelationsObject)
  async getMathSubFieldById(
    @Args('input') input: IdentifierInput,
  ): Promise<MathSubFieldWithRelationsObject> {
    return this.mathSubFielQueryService.getById(input.id);
  }

  @Query(() => MathSubFieldPageObject)
  async filterMathSubFields(
    @Args('input') input: FilterMathSubFieldsInput,
  ): Promise<MathSubFieldPageObject> {
    return this.mathSubFielQueryService.filter(input);
  }
}
