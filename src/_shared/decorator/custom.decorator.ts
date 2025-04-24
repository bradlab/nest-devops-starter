import {
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { DataHelper } from '../helper/data.helper';
import { User } from 'database/model/user.entity';

export const Public = () => SetMetadata('isPublic', true);

export const GetUser = createParamDecorator((_, context): User => {
  const req = context.getArgs()[0];
  if (!DataHelper.isEmpty(req?.user)) return req.user;

  throw new UnauthorizedException();
});
