import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { NoAuth } from './decorator/noAuth.decorator';
import { AuthPayloadObject } from './gql/authPayload.object';
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
  @Mutation(() => AuthPayloadObject)
  async emailSignUp(
    @Args('input') input: EmailSignUpInput,
  ): Promise<AuthPayloadObject> {
    return this.emailSignUpUseCase.call(input);
  }

  @NoAuth()
  @Mutation(() => AuthPayloadObject)
  async googleSignIn(
    @Args('input') input: GoogleSignInInput,
  ): Promise<AuthPayloadObject> {
    return this.googleSignInUseCase.call(input.accessToken);
  }

  @NoAuth()
  @Mutation(() => AuthPayloadObject)
  async emailSignIn(
    @Args('input') input: EmailSignInInput,
  ): Promise<AuthPayloadObject> {
    return this.emailSignInUseCase.call(input);
  }

  @NoAuth()
  @Mutation(() => AuthPayloadObject)
  async refreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<AuthPayloadObject> {
    return this.refreshTokenUseCase.call(input.refreshToken);
  }
}
