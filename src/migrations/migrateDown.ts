import {
  createDatabase,
  createDatabaseMigrator,
  handleMigrationResultSet,
} from './migrationUtil';

const migrateDown = async () => {
  const db = createDatabase();
  const migrator = createDatabaseMigrator(db);

  const resultSet = await migrator.migrateDown();

  handleMigrationResultSet(resultSet);

  await db.destroy();
};

migrateDown();
