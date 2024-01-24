import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@entities/index';
import {
  SuccessObject,
  IdentifierInput,
  LastIdPageParamsObject,
} from '@shared/gql';

import { AnswerFunctionMutationService } from './answerFunctionMutation.service';
import { AnswerFunctionQueryService } from './answerFunctionQuery.service';
import { AnswerFunctionObject } from './gql/answerFunction.object';
import { AnswerFunctionPageObject } from './gql/answerFunctionPage.object';
import { CreateAnswerFunctionInput } from './gql/createAnswerFunction.input';
import { UpdateAnswerFunctionInput } from './gql/updateAnswerFunction.input';
import { NoAuth } from '../authentication/decorator/noAuth.decorator';
import { Roles } from '../authentication/decorator/roles.decorator';
import { HttpAuthPayload } from '../authentication/filter/httpAuthPayload.interceptor';
import { UserAuthPayload } from '../authentication/type/userAuthPayload.type';

@Resolver()
export class AnswerFunctionResolver {
  constructor(
    private readonly answerFunctionMutationService: AnswerFunctionMutationService,
    private readonly answerFunctionQueryService: AnswerFunctionQueryService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => AnswerFunctionObject)
  async createAnswerFunction(
    @Args('input') input: CreateAnswerFunctionInput,
  ): Promise<AnswerFunctionObject> {
    return this.answerFunctionMutationService.create(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => AnswerFunctionObject)
  async updateAnswerFunction(
    @Args('input') input: UpdateAnswerFunctionInput,
    @HttpAuthPayload() payload: UserAuthPayload,
  ): Promise<AnswerFunctionObject> {
    const { id, ...values } = input;

    return this.answerFunctionMutationService.updateById(id, payload, {
      ...(values.func && { func: values.func }),
      ...(values.condition && { condition: values.condition }),
      ...(values.weight && { weight: values.weight }),
    });
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SuccessObject)
  async deleteAnswerFunction(
    @Args('input') input: IdentifierInput,
  ): Promise<SuccessObject> {
    await this.answerFunctionMutationService.deleteById(input.id);

    return { success: true };
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Query(() => AnswerFunctionObject)
  async getAnswerFunctionById(
    @Args('input') input: IdentifierInput,
  ): Promise<AnswerFunctionObject> {
    return this.answerFunctionQueryService.getById(input.id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Query(() => AnswerFunctionPageObject)
  async filterAnswerFunctions(
    @Args('input') input: LastIdPageParamsObject,
  ): Promise<AnswerFunctionPageObject> {
    return this.answerFunctionQueryService.filter(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @NoAuth()
  @Query(() => [AnswerFunctionObject])
  async getAllAnswerFunctions(): Promise<AnswerFunctionObject[]> {
    return this.answerFunctionQueryService.getAll();
  }
}
