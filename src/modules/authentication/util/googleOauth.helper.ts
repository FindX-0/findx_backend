import {
  HttpCode,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleApis, google } from 'googleapis';

import { EnvService } from '@config/env';
import { ExceptionMessageCode } from '@shared/constant';

type OAuth2Client = typeof GoogleApis.prototype.auth.OAuth2.prototype;

type GoogleUserInfo = {
  id?: string;
  email?: string;
  name?: string;
};

type GoogleOauthExpiredError = {
  response: {
    status: number;
  };
};

@Injectable()
export class GoogleOauthHelper {
  private readonly oauth2Client: OAuth2Client;

  constructor(private readonly envService: EnvService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.envService.get('GOOGLE_OAUTH_CLIENT_ID'),
    );
  }

  async getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauth2Client.setCredentials({
      access_token: accessToken,
    });

    try {
      const userInfoResponse = await userInfoClient.get({
        auth: this.oauth2Client,
      });

      return userInfoResponse.data;
    } catch (e) {
      const error = e as GoogleOauthExpiredError;

      if (
        error.response?.status &&
        error.response?.status === HttpStatus.UNAUTHORIZED
      ) {
        throw new UnauthorizedException(
          ExceptionMessageCode.GOOGLE_OAUTH_ACCESS_TOKEN_IS_EXPIRED,
        );
      }

      throw new UnauthorizedException(
        ExceptionMessageCode.CANT_SIGN_IN_WITH_GOOGLE,
      );
    }
  }
}
