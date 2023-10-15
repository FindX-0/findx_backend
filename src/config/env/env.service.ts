import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './envVariables';

@Injectable()
export class EnvService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  get<T extends keyof EnvironmentVariables>(key: T): EnvironmentVariables[T] {
    return this.configService.getOrThrow<EnvironmentVariables[T]>(key);
  }

  getInstance() {
    return this.configService;
  }
}
