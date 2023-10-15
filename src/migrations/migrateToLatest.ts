import {
  createDatabase,
  createDatabaseMigrator,
  handleMigrationResultSet,
} from './migrationUtil';
import 'reflect-metadata';

const migrateToLatest = async () => {
  const db = createDatabase();
  const migrator = createDatabaseMigrator(db);

  const resultSet = await migrator.migrateToLatest();

  handleMigrationResultSet(resultSet);

  await db.destroy();
};

migrateToLatest();
