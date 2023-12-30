import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { HttpAuthPayload } from '@modules/authentication/filter/httpAuthPayload.interceptor';
import { UserAuthPayload } from '@modules/authentication/type/userAuthPayload.type';
import { SubmitMathProblemAnswerInput } from '@modules/mathBattle/gql/submitMathProblemAnswer.input';
import { SuccessObject } from '@shared/gql';

import { SubmitMathProblemAnswer } from './usecase/submitMathProblemAnswer.usecase';

@Resolver()
export class MathBattleResolver {
  constructor(
    private readonly submitMathProblemAnswerUsecase: SubmitMathProblemAnswer,
  ) {}

  @Mutation(() => SuccessObject)
  async submitMathProblemAnswer(
    @HttpAuthPayload() authPayload: UserAuthPayload,
    @Args('input') input: SubmitMathProblemAnswerInput,
  ): Promise<SuccessObject> {
    await this.submitMathProblemAnswerUsecase.call({
      userId: authPayload.userId,
      matchId: input.matchId,
      mathProblemId: input.mathProblemId,
      answer: input.answer,
    });

    return { success: true };
  }
}
