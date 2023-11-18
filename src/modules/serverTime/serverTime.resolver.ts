import { Query, Resolver } from '@nestjs/graphql';

import { ServerTimeObject } from './gql/serverTime.object';

@Resolver()
export class ServerTimeResolver {
  @Query(() => ServerTimeObject)
  async getServerTime(): Promise<ServerTimeObject> {
    const payload = new ServerTimeObject();

    payload.serverTime = Date.now();

    return payload;
  }
}
