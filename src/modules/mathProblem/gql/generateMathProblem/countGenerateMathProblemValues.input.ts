import { InputType } from '@nestjs/graphql';

import { GenerateMathProblemValuesInputParams } from './generateMathProblemParams.input';

@InputType()
export class CountGenerateMathProblemValuesInput extends GenerateMathProblemValuesInputParams {}
