import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { UserAuthPayload } from '@modules/authentication/type/userAuthPayload.type';
import { SubmitMathProblemAnswerInput } from '@modules/mathBattle/gql/submitMathProblemAnswer.input';
import { SuccessObject } from '@shared/gql';

import { GetMathBattleMathProblemsInput } from './gql/getMathBattleMathProblems.input';
import { GetMathBattleMatchMathProblems } from './usecase/getMathBattleMatchMathProblems.usecase';
import { SubmitMathProblemAnswer } from './usecase/submitMathProblemAnswer.usecase';
import { HttpAuthPayload } from '../authentication/filter/httpAuthPayload.interceptor';
import { MathBattleMathProblemObject } from '../mathProblem/gql/mathProblem/mathBattleMathProblem.object';

@Resolver()
export class MathBattleResolver {
  constructor(
    private readonly submitMathProblemAnswerUsecase: SubmitMathProblemAnswer,
    private readonly getMathBattleMatchMathProblems: GetMathBattleMatchMathProblems,
  ) {}

  @Query(() => [MathBattleMathProblemObject])
  async getMathBattleMathProblems(
    @Args('input') input: GetMathBattleMathProblemsInput,
  ): Promise<MathBattleMathProblemObject[]> {
    return this.getMathBattleMatchMathProblems.call(input.matchId);
  }

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
