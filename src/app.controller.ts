import { Controller, Get, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { NoAuth } from '@modules/authentication';

@Injectable()
export class AppService {
  constructor(private readonly redis: Redis) {}

  async getOK() {
    this.redis.call('SRANDMEMBER', 'testset', '2', (err, res) =>
      console.log({ err, res }),
    );
    // console.log(await this.redis.get('key'));
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @NoAuth()
  async getOK(): Promise<string> {
    this.appService.getOK();
    return 'OK';
  }
}
