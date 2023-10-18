import { Kysely } from 'kysely';

import { DB } from '../../entities';

export type KyselyDB = Kysely<DB>;
