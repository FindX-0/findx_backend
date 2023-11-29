import { Insertable, Selectable, Updateable } from 'kysely';

import { Ticket } from '@entities/entityTypes';

export type SelectableTicket = Selectable<Ticket>;
export type NewTicket = Insertable<Ticket>;
export type TicketUpdate = Updateable<Ticket>;
