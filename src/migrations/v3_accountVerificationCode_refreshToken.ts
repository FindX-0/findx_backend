import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('account_verification_code')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('is_verified', 'boolean', (col) => col.notNull())
    .addColumn('code', 'varchar(16)', (col) => col.notNull())
    .addColumn('user_id', 'bigserial', (col) =>
      col.notNull().references('users.id'),
    )
    .addColumn('created_at', 'varchar(255)', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createTable('refresh_tokens')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('user_id', 'bigserial', (col) =>
      col.notNull().references('users.id'),
    )
    .addColumn('value', 'varchar(1023)', (col) => col.notNull())
    .addColumn('created_at', 'varchar(255)', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('account_verification_code').execute();
  await db.schema.dropTable('refresh_tokens').execute();
}
