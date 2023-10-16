import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthenticationService } from './authentication.service';
import { NoAuth } from './decorator/noAuth.decorator';
import { AuthPayloadResponseDto } from './dto/authPayload.dto';
import { SignUpInputDto } from './dto/signUpInput.dto';

@Resolver('authentication')
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @NoAuth()
  @Mutation(() => AuthPayloadResponseDto)
  async signUp(@Args('input') input: SignUpInputDto) {
    return this.authenticationService.signUpWithToken(input);
  }

  // @NoAuth()
  // @Post('signIn')
  // async signIn(@Body() body: SignInBodyDto): Promise<AuthPayloadResponseDto> {
  //   return this.authenticationService.signInWithToken(body);
  // }

  // @NoAuth()
  // @HttpCode(HttpStatus.OK)
  // @Post('refresh')
  // async refresh(
  //   @Body() body: RefreshTokenBodyDto,
  // ): Promise<AuthPayloadResponseDto> {
  //   return this.authenticationService.refreshToken(body.refreshToken);
  // }
}
