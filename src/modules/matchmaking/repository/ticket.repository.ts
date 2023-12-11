import { Injectable } from '@nestjs/common';
import { Transaction } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';

import { KyselyDB } from '@config/database';
import { TicketState } from '@entities/entityEnums';
import { DB } from '@entities/entityTypes';
import { TransactionProvider } from '@shared/util';

import {
  NewTicket,
  SelectableTicket,
  TicketUpdate,
} from '../entity/ticket.entity';

@Injectable()
export class TicketRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(
    params: NewTicket,
    txProvider?: TransactionProvider,
  ): Promise<SelectableTicket | null> {
    const entity = await (txProvider?.get() ?? this.db)
      .insertInto('tickets')
      .values(params)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async updateAllProcessing(
    {
      userId,
      payload,
    }: {
      userId: string;
      payload: TicketUpdate;
    },
    txProvider?: TransactionProvider,
  ): Promise<void> {
    await (txProvider?.get() ?? this.db)
      .updateTable('tickets')
      .set(payload)
      .where((eb) =>
        eb('userId', '=', userId).and('state', '=', TicketState.PROCESSING),
      )
      .execute();
  }

  async getAll({ state }: { state: TicketState }): Promise<SelectableTicket[]> {
    return this.db
      .selectFrom('tickets')
      .selectAll()
      .where('state', '=', state)
      .execute();
  }

  async updateById(
    id: string,
    params: TicketUpdate,
    tx?: Transaction<DB>,
  ): Promise<SelectableTicket | null> {
    const entity = await (tx ?? this.db)
      .updateTable('tickets')
      .where('id', '=', id)
      .set(params)
      .returningAll()
      .executeTakeFirst();

    return entity ?? null;
  }

  async updateAllByIds(
    ids: string[],
    payload: TicketUpdate,
    txProvider?: TransactionProvider,
  ) {
    await (txProvider?.get() ?? this.db)
      .updateTable('tickets')
      .where('id', 'in', ids)
      .set(payload)
      .execute();
  }
}
