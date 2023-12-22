import { Insertable, Selectable, Updateable } from 'kysely';

import { Ticket } from '@entities/index';

export type SelectableTicket = Selectable<Ticket>;
export type NewTicket = Insertable<Ticket>;
export type TicketUpdate = Updateable<Ticket>;
