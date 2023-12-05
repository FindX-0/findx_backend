// export class JokerGameEventGatewayService {
//   constructor(
//     private readonly gateway: SocketGateway,
//     private readonly userService: UserMutationService,
//   ) {}

//   async publish(params: {
//     userIds: number[];
//     jokerGameEvent: JokerGameEventWithRelations | null;
//   }): Promise<void> {
//     return this.publishAll({
//       userIds: params.userIds,
//       jokerGameEvents: [params.jokerGameEvent],
//     });
//   }

//   async publishAll(params: {
//     userIds: number[];
//     jokerGameEvents: (JokerGameEventWithRelations | null)[];
//   }): Promise<void> {
//     const { userIds, jokerGameEvents } = params;

//     const socketIds = await this.userService.getUserSocketIdByIds(userIds);

//     for (const event of jokerGameEvents) {
//       if (!event) {
//         continue;
//       }

//       const mapped = plainToInstance(JokerGameEventResponseDto, event);

//       this.gateway.wss
//         .to(socketIds)
//         .emit(GatewayEvent.JOKER_GAME_EVENT, mapped);
//     }
//   }
// }
