import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  IdentifierInput,
  SuccessObject,
  LastIdPageParamsObject,
} from '@shared/gql';

import { CreateMathFieldInput } from './gql/createMathField.input';
import { MathFieldObject } from './gql/mathField.type';
import { MathFieldPageObject } from './gql/mathFIeldPage.object';
import { UpdateMathFieldInput } from './gql/updateMathField.input';
import { MathFieldCrudService } from './mathFieldCrud.service';

@Resolver()
export class MathFieldResolver {
  constructor(private readonly mathFieldCrudService: MathFieldCrudService) {}

  @Mutation(() => MathFieldObject)
  async createMathField(
    @Args('input') input: CreateMathFieldInput,
  ): Promise<MathFieldObject> {
    return this.mathFieldCrudService.create(input);
  }

  @Mutation(() => MathFieldObject)
  async updateMathField(
    @Args('input') input: UpdateMathFieldInput,
  ): Promise<MathFieldObject> {
    const { id, ...values } = input;

    return this.mathFieldCrudService.updateById(id, {
      ...(values.name && { name: values.name }),
    });
  }

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
}
