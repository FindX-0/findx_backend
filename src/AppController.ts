import { Controller, Get } from '@nestjs/common';

import { NoAuth } from './modules/authentication/decorator/noAuth.decorator';

@Controller()
export class AppController {
  @Get()
  @NoAuth()
  async getOK(): Promise<string> {
    return 'OK';
  }
}
