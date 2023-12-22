import { Injectable, OnModuleInit } from '@nestjs/common';

import { GetAllMathSubFieldIds } from '@modules/mathSubField/usecase/getAllMathSubFieldIds';
import { groupByToMap } from '@shared/util';

import { SelectableMathProblem } from '../mathProblem.entity';
import { MathProblemRepository } from '../repository/mathProblem.repository';
import { MathProblemIdStore } from '../repository/mathProblemId.store';

@Injectable()
export class MathProblemIdsInit implements OnModuleInit {
  constructor(
    private readonly mathProblemRepository: MathProblemRepository,
    private readonly getAllMathSubFields: GetAllMathSubFieldIds,
    private readonly mathProblemIdStore: MathProblemIdStore,
  ) {}

  async onModuleInit() {
    const mathSubFieldIds = await this.getAllMathSubFields.getAllIds();
    if (!mathSubFieldIds.length) {
      return;
    }

    await this.mathProblemIdStore.deleteManyByMathSubFieldIds(mathSubFieldIds);

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

      await this.groupAndSaveMathProblemIds(page);

      lastId = page[page.length - 1]?.id ?? null;
    }
  }

  private async groupAndSaveMathProblemIds(page: SelectableMathProblem[]) {
    const mathSubFieldIdToProblem = groupByToMap(page, (e) => e.mathSubFieldId);

    for (const [
      mathSubFieldId,
      mathProblems,
    ] of mathSubFieldIdToProblem.entries()) {
      const mathProblemIds = mathProblems.map((e) => e.id);

      await this.mathProblemIdStore.saveMany({
        mathSubFieldId,
        mathProblemIds,
      });
    }
  }
}
