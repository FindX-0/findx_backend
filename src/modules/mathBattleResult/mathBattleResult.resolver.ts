import { Args, Query, Resolver } from '@nestjs/graphql';

import { GetMathBattleResultsInput } from './gql/getMathBattleResults.input';
import { MathBattleResultObject } from './gql/mathBattleResult.object';
import { MathBattleResultQueryService } from './mathBattleResultQuery.service';

@Resolver()
export class MathBattleResultResolver {
  constructor(
    private readonly mathBattleResultQueryService: MathBattleResultQueryService,
  ) {}

  @Query(() => [MathBattleResultObject])
  async getMathBattleResults(
    @Args('input') input: GetMathBattleResultsInput,
  ): Promise<MathBattleResultObject[]> {
    return this.mathBattleResultQueryService.getAllByMatchId(input.matchId);
  }
}
