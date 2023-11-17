import { Query, Resolver } from '@nestjs/graphql';

import { ServerTimeType } from './gql/serverTime.type';

@Resolver()
export class ServerTimeResolver {
  @Query(() => ServerTimeType)
  async getServerTime(): Promise<ServerTimeType> {
    const payload = new ServerTimeType();

    payload.serverTime = Date.now();

    return payload;
  }
}
