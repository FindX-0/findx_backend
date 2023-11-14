import { Injectable } from '@nestjs/common';

import { KyselyDB } from '@config/database';
import { TicketState } from '@entities/entityEnums';
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
}
