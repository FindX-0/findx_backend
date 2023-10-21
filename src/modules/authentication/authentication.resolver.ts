import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthenticationService } from './authentication.service';
import { NoAuth } from './decorator/noAuth.decorator';
import { AuthPayloadResponseType } from './gql/authPayload.type';
import { GoogleSignInInput } from './gql/googleSignIn.input';
import { SignUpInput } from './gql/signUp.input';
import { SignInWithGoogle } from './useCase';

@Resolver('authentication')
export class AuthenticationResolver {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly signInWithGoogle: SignInWithGoogle,
  ) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @NoAuth()
  @Mutation(() => AuthPayloadResponseType)
  async signUp(
    @Args('input') input: SignUpInput,
  ): Promise<AuthPayloadResponseType> {
    return this.authenticationService.signUpWithToken(input);
  }

  @NoAuth()
  @Mutation(() => AuthPayloadResponseType)
  async googleSignIn(
    @Args('input') input: GoogleSignInInput,
  ): Promise<AuthPayloadResponseType> {
    return this.signInWithGoogle.call(input.accessToken);
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
