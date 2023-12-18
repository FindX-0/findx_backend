import { Query, Resolver } from '@nestjs/graphql';

import { ServerTimeObject } from './gql/serverTime.object';

@Resolver()
export class ServerTimeResolver {
  @Query(() => ServerTimeObject)
  async getServerTime(): Promise<ServerTimeObject> {
    return {
      serverTime: new Date(),
    };
  }
}
