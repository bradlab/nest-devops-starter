import { Module } from '@nestjs/common';
import { GlobalSeed } from './global.seed';
import { UserModule } from 'user/user.module';

@Module({
  imports: [UserModule],
  providers: [GlobalSeed],
})
export class SeedsModule {}
