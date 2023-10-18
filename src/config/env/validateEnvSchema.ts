import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { getAllErrorConstraints } from '@shared/util';

import { EnvModule } from './env.module';
import { EnvironmentVariables } from './envVariables';

export function validateEnvSchema(config: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, config, {
    exposeDefaultValues: true,
  });

  const errors = validateSync(finalConfig, {
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    whitelist: true,
  });

  if (errors.length > 0) {
    const errorConstraints = getAllErrorConstraints(errors);
    errorConstraints.forEach((e) => EnvModule.logger.error(e));
  } else {
    EnvModule.logger.verbose('Enviroment initialized');
  }

  return finalConfig;
}
