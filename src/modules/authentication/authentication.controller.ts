import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { NoAuth } from './decorator/noAuth.decorator';
import { AuthPayloadResponseDto } from './dto/authPayload.dto';
import { RefreshTokenBodyDto } from './dto/refreshTokenBody.dto';
import { SignInBodyDto } from './dto/signInBody.dto';
import { SignUpBodyDto } from './dto/signUpBody.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @NoAuth()
  @Post('signUp')
  async signUp(@Body() body: SignUpBodyDto): Promise<AuthPayloadResponseDto> {
    return this.authenticationService.signUpWithToken(body);
  }

  @NoAuth()
  @Post('signIn')
  async signIn(@Body() body: SignInBodyDto): Promise<AuthPayloadResponseDto> {
    return this.authenticationService.signInWithToken(body);
  }

  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body() body: RefreshTokenBodyDto,
  ): Promise<AuthPayloadResponseDto> {
    return this.authenticationService.refreshToken(body.refreshToken);
  }
}
