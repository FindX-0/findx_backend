import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('email', 'varchar(255)', (col) =>
      col.notNull().defaultTo('default@example.com'),
    )
    .addColumn('passwordHash', 'varchar(255)', (col) =>
      col.notNull().defaultTo(''),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .dropColumn('email')
    .dropColumn('passwordHash')
    .execute();
}
