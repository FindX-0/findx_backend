import { ExecutionContext, ContextType } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const getContextRequest = (context: ExecutionContext) => {
  if (context.getType<ContextType | 'graphql'>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext().req;
  }
  return context.switchToHttp().getRequest();
};
