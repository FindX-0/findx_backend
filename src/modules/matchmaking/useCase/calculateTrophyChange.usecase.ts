import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '../../../shared/constant';
import { MatchResultOutcome } from '../../../shared/type/matchResultOutcome';
import { StandardTrophyRangeSystemQueryService } from '../../standardTrophyRangeSystem/standardTrophyRangeSystemQuery.service';
import { UserMetaQueryService } from '../../userMeta/userMetaQuery.service';
import { SelectableMatch } from '../entity/match.entity';

type Args = {
  userId: string;
  match: SelectableMatch;
  matchResultOutcome: MatchResultOutcome;
};

@Injectable()
export class CalculateTrophyChange {
  constructor(
    private readonly userMetaQueryService: UserMetaQueryService,
    private readonly standardTrophyRangeSystemQueryService: StandardTrophyRangeSystemQueryService,
  ) {}

  async call({ userId, match, matchResultOutcome }: Args): Promise<number> {
    const userMetas = await this.userMetaQueryService.getByUserIds(
      match.userIds,
    );

    if (userMetas.length !== 2) {
      throw new InternalServerErrorException(
        'Unknown case of calculating trophies',
      );
    }

    const trophyDiff = Math.abs(
      userMetas[0]!.trophies - userMetas[1]!.trophies,
    );

    const userMeta = userMetas.find((e) => e.userId === userId);
    if (!userMeta) {
      throw new NotFoundException(ExceptionMessageCode.USER_META_NOT_FOUND);
    }

    const strs =
      await this.standardTrophyRangeSystemQueryService.getBellowClosestByMathFieldId(
        {
          mathFieldId: match.mathFieldId,
          trophy: userMeta.trophies,
        },
      );

    switch (matchResultOutcome) {
      case MatchResultOutcome.WIN:
        return strs.winChange - Math.floor(trophyDiff / 10);
      case MatchResultOutcome.LOSE:
        return strs.winChange + Math.floor(trophyDiff / 10);
      default:
        return 0;
    }
  }
}
