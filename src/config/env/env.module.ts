import {
  DynamicModule,
  Global,
  Logger,
  Module,
  Provider,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENV_SERVICE_TOKEN } from './env.constant';
import { EnvService } from './env.service';
import { EnvModuleOptions } from './envVariables';
import { validateEnvSchema } from './validateEnvSchema';

const ENV = process.env['NODE_ENV'];

@Global()
@Module({
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {
  public static readonly logger = new Logger(EnvModule.name);

  /**
   * @default isGlobal:true
   * @default ignoreEnvVars:true
   * @returns {DynamicModule}
   */
  public static forRoot(options?: EnvModuleOptions): DynamicModule {
    this.logger.verbose(
      `Started initializing enviroment variables, env=${ENV}`,
    );

    const provider: Provider = {
      provide: ENV_SERVICE_TOKEN,
      useClass: EnvService,
    };

    return {
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          // predefined/system environment variables will not be validated
          ignoreEnvVars: true,
          validate: validateEnvSchema,
          envFilePath: ['.env.development.local', `.env.${ENV}`],
          ...options,
        }),
      ],
      module: EnvModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
