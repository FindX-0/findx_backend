import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import { SelectableMatch } from '../entity/match.entity';
import { MatchRepository } from '../repository/match.repository';

@Injectable()
export class MatchQueryService {
  constructor(private readonly matchRepository: MatchRepository) {}

  async getMathProblemIdsById(id: string): Promise<string[]> {
    const mathProblemIds = await this.matchRepository.getMathProblemIdsById(id);

    if (!mathProblemIds) {
      throw new NotFoundException(ExceptionMessageCode.MATCH_NOT_FOUND);
    }

    return mathProblemIds;
  }

  async getById(
    id: string,
    options?: {
      validateUserIncluded?: {
        userId: string;
      };
    },
  ): Promise<SelectableMatch> {
    const match = await this.matchRepository.getById(id);

    if (!match) {
      throw new NotFoundException(ExceptionMessageCode.MATCH_NOT_FOUND);
    }

    const validateIncludedUserId = options?.validateUserIncluded?.userId;
    if (
      validateIncludedUserId &&
      !match.userIds.includes(validateIncludedUserId)
    ) {
      throw new ForbiddenException(ExceptionMessageCode.MATCH_USER_NOT_FOUND);
    }

    return match;
  }
}
