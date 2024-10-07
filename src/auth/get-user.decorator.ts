import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (_data, cx: ExecutionContextHost): User => {
    const req = cx.switchToHttp().getRequest();
    return req.user;
  },
);
