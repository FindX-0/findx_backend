import { Injectable } from '@nestjs/common';
import { Transaction } from 'kysely';

import { KyselyDB } from '@config/database';
import { TicketState } from '@entities/entityEnums';
import { DB } from '@entities/entityTypes';
import {
  NewTicket,
  SelectableTicket,
  TicketUpdate,
} from '@entities/ticket.entity';
import { InjectKysely } from '@packages/kyselyModule';

@Injectable()
export class TicketRepository {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async create(params: NewTicket): Promise<SelectableTicket> {
    return this.db
      .insertInto('tickets')
      .values(params)
      .returningAll()
      .executeTakeFirst();
  }

  async updateAllProcessing({
    userId,
    payload,
  }: {
    userId: string;
    payload: TicketUpdate;
  }) {
    return this.db
      .updateTable('tickets')
      .set(payload)
      .where((eb) =>
        eb('userId', '=', userId).and('state', '=', TicketState.PROCESSING),
      );
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
    return (tx ?? this.db)
      .updateTable('tickets')
      .where('id', '=', id)
      .set(params)
      .returningAll()
      .executeTakeFirst();
  }
}
