import { Controller, Get } from '@nestjs/common';

import { NoAuth } from '@modules/authentication';

@Controller()
export class AppController {
  @Get()
  @NoAuth()
  async getOK(): Promise<string> {
    return 'OK';
  }
}
