import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@entities/index';
import { SuccessObject } from '@shared/gql';

import { NoAuth } from './decorator/noAuth.decorator';
import { Roles } from './decorator/roles.decorator';
import { AdminSignInInput } from './gql/adminSignIn.input';
import { AdminSignUpInput } from './gql/adminSignUp.input';
import { AuthPayloadObject } from './gql/authPayload.object';
import { DeviceSignInInput } from './gql/deviceSignIn.input';
import { EmailSignInInput } from './gql/emailSignIn.input';
import { EmailSignUpInput } from './gql/emailSignUp.input';
import { GoogleSignInInput } from './gql/googleSignIn.input';
import { JwtTokenPayloadObject } from './gql/jwtTokenPayload.object';
import { RefreshTokenInput } from './gql/refreshToken.input';
import { AdminRefreshToken } from './useCase/adminRefreshToken.usecase';
import { AdminUserSignIn } from './useCase/adminUserSignIn.usecase';
import { AdminUserSignUp } from './useCase/adminUserSignUp.usecase';
import { DeviceSignIn } from './useCase/deviceSignIn.usecase';
import { EmailSignIn } from './useCase/emailSignIn.usecase';
import { EmailSignUp } from './useCase/emailSignUp.usecase';
import { GoogleSignIn } from './useCase/googleSignIn.usecase';
import { RefreshToken } from './useCase/refreshToken.usecase';

@Resolver('authentication')
export class AuthenticationResolver {
  constructor(
    private readonly emailSignUpUseCase: EmailSignUp,
    private readonly googleSignInUseCase: GoogleSignIn,
    private readonly refreshTokenUseCase: RefreshToken,
    private readonly emailSignInUseCase: EmailSignIn,
    private readonly adminUserSignInUseCase: AdminUserSignIn,
    private readonly adminUserSignUpUseCase: AdminUserSignUp,
    private readonly adminRefreshTokenUseCase: AdminRefreshToken,
    private readonly deviceSignInUsecase: DeviceSignIn,
  ) {}

  @Query(() => SuccessObject)
  async authenticationStatus(): Promise<SuccessObject> {
    return { success: true };
  }

  @NoAuth()
  @Mutation(() => AuthPayloadObject)
  async emailSignUp(
    @Args('input') input: EmailSignUpInput,
  ): Promise<AuthPayloadObject> {
    return this.emailSignUpUseCase.call(input);
  }

  @NoAuth()
  @Mutation(() => AuthPayloadObject)
  async emailSignIn(
    @Args('input') input: EmailSignInInput,
  ): Promise<AuthPayloadObject> {
    return this.emailSignInUseCase.call(input);
  }

  @NoAuth()
  @Mutation(() => JwtTokenPayloadObject)
  async googleSignIn(
    @Args('input') input: GoogleSignInInput,
  ): Promise<JwtTokenPayloadObject> {
    return this.googleSignInUseCase.call(input.accessToken);
  }

  @NoAuth()
  @Mutation(() => JwtTokenPayloadObject)
  async deviceSignIn(
    @Args('input') input: DeviceSignInInput,
  ): Promise<JwtTokenPayloadObject> {
    return this.deviceSignInUsecase.call(input);
  }

  @NoAuth()
  @Mutation(() => JwtTokenPayloadObject)
  async refreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<JwtTokenPayloadObject> {
    return this.refreshTokenUseCase.call(input.refreshToken);
  }

  @NoAuth()
  @Mutation(() => JwtTokenPayloadObject)
  async adminSignIn(
    @Args('input') input: AdminSignInInput,
  ): Promise<JwtTokenPayloadObject> {
    return this.adminUserSignInUseCase.call(input);
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => JwtTokenPayloadObject)
  async adminSignUp(
    @Args('input') input: AdminSignUpInput,
  ): Promise<JwtTokenPayloadObject> {
    return this.adminUserSignUpUseCase.call(input);
  }

  @NoAuth()
  @Mutation(() => JwtTokenPayloadObject)
  async adminRefreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<JwtTokenPayloadObject> {
    return this.adminRefreshTokenUseCase.call(input.refreshToken);
  }
}
