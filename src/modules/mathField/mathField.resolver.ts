import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@entities/entityEnums';
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
import { MathFieldCrudService } from './mathFieldCrud.service';

@Resolver()
export class MathFieldResolver {
  constructor(private readonly mathFieldCrudService: MathFieldCrudService) {}

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => MathFieldObject)
  async createMathField(
    @Args('input') input: CreateMathFieldInput,
  ): Promise<MathFieldObject> {
    return this.mathFieldCrudService.create(input);
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => MathFieldObject)
  async updateMathField(
    @Args('input') input: UpdateMathFieldInput,
  ): Promise<MathFieldObject> {
    const { id, ...values } = input;

    return this.mathFieldCrudService.updateById(id, {
      ...(values.name && { name: values.name }),
    });
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SuccessObject)
  async deleteMathField(
    @Args('input') input: IdentifierInput,
  ): Promise<SuccessObject> {
    await this.mathFieldCrudService.deleteById(input.id);

    return { success: true };
  }

  @Query(() => MathFieldObject)
  async getMathFieldById(
    @Args('input') input: IdentifierInput,
  ): Promise<MathFieldObject> {
    return this.mathFieldCrudService.getById(input.id);
  }

  @Query(() => MathFieldPageObject)
  async filterMathFields(
    @Args('input') input: LastIdPageParamsObject,
  ): Promise<MathFieldPageObject> {
    return this.mathFieldCrudService.filter(input);
  }

  @Query(() => [MathFieldObject])
  async getAllMathFields(
    @Args('input') input: GetAllMathFieldsInput,
  ): Promise<MathFieldObject[]> {
    return this.mathFieldCrudService.getAll(input);
  }
}
