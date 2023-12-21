import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

import { MathProblemRepository } from './mathProblem.repository';

@Injectable()
export class MathProblemIdStore implements OnModuleInit {
  constructor(
    private readonly redis: Redis,
    private readonly mathProblemRepository: MathProblemRepository,
    // private readonly mathSubFieldQueryService: MathSubFieldQueryService,
  ) {}

  async onModuleInit() {
    // const mathSubFieldIds = await this.mathSubFieldQueryService.getAllIds();
    // console.log({ mathSubFieldIds });
    // if (!mathSubFieldIds.length) {
    //   return;
    // }

    // const mathProblemIdCollectionNames = mathSubFieldIds.map((id) =>
    //   this.getCollectionName(id),
    // );
    // await this.redis.del(...mathProblemIdCollectionNames);

    const count = await this.mathProblemRepository.count({});
    if (!count) {
      return;
    }

    const limit = 1000;
    const pageCount = Math.ceil(count / limit);

    let lastId: string | null = null;
    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
      const page = await this.mathProblemRepository.filter({
        lastId,
        limit,
      });

      // console.log({ page });

      lastId = page[page.length - 1]?.id ?? null;
    }
  }

  async save({
    mathSubFieldId,
    mathProblemId,
  }: {
    mathSubFieldId: string;
    mathProblemId: string;
  }) {
    const collectionName = this.getCollectionName(mathSubFieldId);

    await this.redis.sadd(collectionName, mathProblemId);
  }

  async getRandomByMathSubFieldId(
    mathSubFieldId: string,
    count: number,
  ): Promise<string[]> {
    const collectionName = this.getCollectionName(mathSubFieldId);

    const mathProblemIds = await this.redis.call(
      'SRANDMEMBER',
      collectionName,
      count.toString(),
    );

    if (!Array.isArray(mathProblemIds)) {
      return [];
    }

    return mathProblemIds as string[];
  }

  private getCollectionName(mathSubFieldId: string): string {
    return `mathSubFieldProblems_${mathSubFieldId}`;
  }
}
