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
        'Unknown case of calculating trophies, userMetas.length !== 2',
      );
    }

    const userMeta = userMetas.find((e) => e.userId === userId);
    if (!userMeta) {
      throw new NotFoundException(ExceptionMessageCode.USER_META_NOT_FOUND);
    }

    const otherUserMeta = userMetas.find((e) => e.userId !== userId);

    const trophyDiff = (otherUserMeta?.trophies ?? 0) - userMeta.trophies;

    const strs =
      await this.standardTrophyRangeSystemQueryService.getBellowClosestByMathFieldId(
        {
          mathFieldId: match.mathFieldId,
          trophy: userMeta.trophies,
        },
      );

    const modifier =
      trophyDiff > 0 ? Math.floor(trophyDiff / 10) : Math.ceil(trophyDiff / 10);

    switch (matchResultOutcome) {
      case MatchResultOutcome.WIN:
        return Math.max(1, strs!.winChange + modifier);
      case MatchResultOutcome.LOSE:
        return Math.min(-1, strs!.loseChange + modifier);
      default:
        return 0;
    }
  }
}
