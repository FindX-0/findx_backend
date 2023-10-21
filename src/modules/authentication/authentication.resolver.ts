import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { NoAuth } from './decorator/noAuth.decorator';
import { AuthPayloadType } from './gql/authPayload.type';
import { EmailSignInInput } from './gql/emailSignIn.input';
import { EmailSignUpInput } from './gql/emailSignUp.input';
import { GoogleSignInInput } from './gql/googleSignIn.input';
import { RefreshTokenInput } from './gql/refreshToken.input';
import {
  EmailSignInUseCase,
  GoogleSignInUseCase,
  RefreshTokenUseCase,
} from './useCase';
import { EmailSignUpUseCase } from './useCase/emailSignUp.usecase';

@Resolver('authentication')
export class AuthenticationResolver {
  constructor(
    private readonly emailSignUpUseCase: EmailSignUpUseCase,
    private readonly googleSignInUseCase: GoogleSignInUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly emailSignInUseCase: EmailSignInUseCase,
  ) {}

  @NoAuth()
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @NoAuth()
  @Mutation(() => AuthPayloadType)
  async emailSignUp(
    @Args('input') input: EmailSignUpInput,
  ): Promise<AuthPayloadType> {
    return this.emailSignUpUseCase.call(input);
  }

  @NoAuth()
  @Mutation(() => AuthPayloadType)
  async googleSignIn(
    @Args('input') input: GoogleSignInInput,
  ): Promise<AuthPayloadType> {
    return this.googleSignInUseCase.call(input.accessToken);
  }

  @NoAuth()
  @Mutation(() => AuthPayloadType)
  async emailSignIn(
    @Args('input') input: EmailSignInInput,
  ): Promise<AuthPayloadType> {
    return this.emailSignInUseCase.call(input);
  }

  @NoAuth()
  @Mutation(() => AuthPayloadType)
  async refreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<AuthPayloadType> {
    return this.refreshTokenUseCase.call(input.refreshToken);
  }
}
