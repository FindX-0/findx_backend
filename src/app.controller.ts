import { Controller, Get } from '@nestjs/common';
import { DB } from './config/database.config';
import { InjectKysely } from './packages/kyselyModule';

@Controller()
export class AppController {
  @Get()
  getOK(): string {
    return 'OK';
  }

  constructor(@InjectKysely() private readonly db: DB) {}

  @Get('/user/all')
  async getHello(): Promise<string> {
    const result = await this.db.selectFrom('users').selectAll().execute();

    return JSON.stringify(result);
  }
}
