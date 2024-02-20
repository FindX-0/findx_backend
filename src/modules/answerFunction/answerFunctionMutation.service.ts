import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import {
  AnswerFunctionUpdateWeightNum,
  SelectableAnswerFunction,
  NewAnswerFunctionWeightNum,
} from './answerFunction.entity';
import { AnswerFunctionRepository } from './answerFunction.repository';
import { NormalizeAnswerFunctionWeight } from './usecase/normalizeAnswerFunctionWeight.usecase';
import { Role } from '../../entities';
import { AdminUserQueryService } from '../adminUser/adminUserQuery.service';
import { UserAuthPayload } from '../authentication/type/userAuthPayload.type';

@Injectable()
export class AnswerFunctionMutationService {
  constructor(
    private readonly answerFunctionRepository: AnswerFunctionRepository,
    private readonly normalizeAnswerFunctionWeight: NormalizeAnswerFunctionWeight,
    private readonly adminUserQueryService: AdminUserQueryService,
  ) {}

  async create(
    values: NewAnswerFunctionWeightNum,
  ): Promise<SelectableAnswerFunction> {
    await this.normalizeAnswerFunctionWeight.normalizeForCreate(values);

    const entity = await this.answerFunctionRepository.create({
      ...values,
      weight: values.weight.toString(),
    });

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_ANSWER_FUNCTION,
      );
    }

    return entity;
  }

  async updateById(
    id: string,
    userAuthPayload: UserAuthPayload,
    values: AnswerFunctionUpdateWeightNum,
  ): Promise<SelectableAnswerFunction> {
    await this.normalizeAnswerFunctionWeight.normalizeForUpdate(id, values);

    const { weight, condition, func, mathSubFieldId } = values;

    const adminUser = userAuthPayload.isAdmin
      ? await this.adminUserQueryService.getById(userAuthPayload.userId)
      : null;

    const isAdminUserSuperAdmin =
      adminUser?.roles.includes(Role.SUPER_ADMIN) ?? false;

    const entity = await this.answerFunctionRepository.updateById(id, {
      ...(condition && isAdminUserSuperAdmin && { condition }),
      ...(func && isAdminUserSuperAdmin && { func }),
      ...(mathSubFieldId && isAdminUserSuperAdmin && { mathSubFieldId }),
      ...(weight && { weight: weight.toString() }),
    });

    if (!entity) {
      throw new NotFoundException(
        ExceptionMessageCode.ANSWER_FUNCTION_NOT_FOUND,
      );
    }

    return entity;
  }

  async deleteById(id: string): Promise<void> {
    await this.normalizeAnswerFunctionWeight.normalizeForDelete(id);

    const didDelete = await this.answerFunctionRepository.deleteById(id);

    if (!didDelete) {
      throw new NotFoundException(
        ExceptionMessageCode.ANSWER_FUNCTION_NOT_FOUND,
      );
    }
  }
}
