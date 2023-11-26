import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@entities/entityEnums';
import { Roles } from '@modules/authentication/decorator/roles.decorator';
import {
  IdentifierInput,
  SuccessObject,
  LastIdPageParamsObject,
} from '@shared/gql';

import { CreateMathSubFieldInput } from './gql/createMathSubField.input';
import { MathSubFieldObject } from './gql/mathSubField.object';
import { MathSubFieldPageObject } from './gql/mathSubFIeldPage.object';
import { UpdateMathSubFieldInput } from './gql/updateMathSubField.input';
import { MathSubFieldCrudService } from './mathSubFieldCrud.service';

@Resolver()
export class MathSubFieldResolver {
  constructor(
    private readonly mathSubFieldCrudService: MathSubFieldCrudService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => MathSubFieldObject)
  async createMathSubField(
    @Args('input') input: CreateMathSubFieldInput,
  ): Promise<MathSubFieldObject> {
    return this.mathSubFieldCrudService.create(input);
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => MathSubFieldObject)
  async updateMathSubField(
    @Args('input') input: UpdateMathSubFieldInput,
  ): Promise<MathSubFieldObject> {
    const { id, ...values } = input;

    return this.mathSubFieldCrudService.updateById(id, {
      ...(values.name && { name: values.name }),
      ...(values.mathFieldId && { mathFieldId: values.mathFieldId }),
    });
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SuccessObject)
  async deleteMathSubField(
    @Args('input') input: IdentifierInput,
  ): Promise<SuccessObject> {
    await this.mathSubFieldCrudService.deleteById(input.id);

    return { success: true };
  }

  @Query(() => MathSubFieldObject)
  async getMathSubFieldById(
    @Args('input') input: IdentifierInput,
  ): Promise<MathSubFieldObject> {
    return this.mathSubFieldCrudService.getById(input.id);
  }

  @Query(() => MathSubFieldPageObject)
  async filterMathSubFields(
    @Args('input') input: LastIdPageParamsObject,
  ): Promise<MathSubFieldPageObject> {
    return this.mathSubFieldCrudService.filter(input);
  }
}
