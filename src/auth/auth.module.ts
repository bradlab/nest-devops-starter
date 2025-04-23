import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IAuthService } from './auth.service.interface';
import { DBRepositoryModule } from 'database/database.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1 days' },
      verifyOptions: { ignoreExpiration: true },
    }),
    DBRepositoryModule,
  ],
  controllers: [AuthController],
  providers: [{ provide: IAuthService, useClass: AuthService }],
  exports: [IAuthService, JwtModule, DBRepositoryModule],
})
export class AuthModule {}
