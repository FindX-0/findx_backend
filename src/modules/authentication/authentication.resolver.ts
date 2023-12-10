import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@entities/entityEnums';
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
import {
  AdminRefreshTokenUseCase,
  AdminUserSignInUseCase,
  AdminUserSignUpUseCase,
  EmailSignInUseCase,
  GoogleSignInUseCase,
  RefreshTokenUseCase,
} from './useCase';
import { DeviceSignInUseCase } from './useCase/deviceSignIn.usecase';
import { EmailSignUpUseCase } from './useCase/emailSignUp.usecase';

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
  async deviceSignIn(
    @Args('input') input: DeviceSignInInput,
  ): Promise<AuthPayloadObject> {
    return this.deviceSignInUsecase.call(input);
  }

  @NoAuth()
  @Mutation(() => AuthPayloadObject)
  async refreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<AuthPayloadObject> {
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
