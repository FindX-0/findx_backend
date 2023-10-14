import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KyselyModule } from './packages/kyselyModule';
import { PostgresDialect } from 'kysely';
import { createPostgresPool } from './config/database.config';

@Module({
  imports: [
    KyselyModule.forRoot({
      dialect: new PostgresDialect({
        pool: createPostgresPool(),
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
