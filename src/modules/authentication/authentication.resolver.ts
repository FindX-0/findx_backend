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
import { AdminRefreshTokenUseCase } from './useCase/adminRefreshToken.usecase';
import { AdminUserSignInUseCase } from './useCase/adminUserSignIn.usecase';
import { AdminUserSignUpUseCase } from './useCase/adminUserSignUp.usecase';
import { DeviceSignInUseCase } from './useCase/deviceSignIn.usecase';
import { EmailSignInUseCase } from './useCase/emailSignIn.usecase';
import { EmailSignUpUseCase } from './useCase/emailSignUp.usecase';
import { GoogleSignInUseCase } from './useCase/googleSignIn.usecase';
import { RefreshTokenUseCase } from './useCase/refreshToken.usecase';

@Resolver('authentication')
export class AuthenticationResolver {
  constructor(
    private readonly emailSignUpUseCase: EmailSignUpUseCase,
    private readonly googleSignInUseCase: GoogleSignInUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly emailSignInUseCase: EmailSignInUseCase,
    private readonly adminUserSignInUseCase: AdminUserSignInUseCase,
    private readonly adminUserSignUpUseCase: AdminUserSignUpUseCase,
    private readonly adminRefreshTokenUseCase: AdminRefreshTokenUseCase,
    private readonly deviceSignInUsecase: DeviceSignInUseCase,
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
