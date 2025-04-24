import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth';
import { IUserService } from './user.service.interface';
import { UserGuard } from '../_shared/guard/auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserGuard, { provide: IUserService, useClass: UserService }],
  exports: [IUserService, AuthModule],
})
export class UserModule {}
