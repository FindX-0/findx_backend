import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class MathProblemIdStore {
  constructor(private readonly redis: Redis) {}

  async saveMany({
    mathSubFieldId,
    mathProblemIds,
  }: {
    mathSubFieldId: string;
    mathProblemIds: string[];
  }) {
    const collectionName = this.getCollectionName(mathSubFieldId);

    await this.redis.sadd(collectionName, ...mathProblemIds);
  }

  async deleteManyByMathSubFieldIds(mathSubFieldIds: string[]) {
    const collectionNames = mathSubFieldIds.map((id) =>
      this.getCollectionName(id),
    );

    await this.redis.del(...collectionNames);
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
