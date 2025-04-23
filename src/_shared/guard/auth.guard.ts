import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DataHelper } from '_shared/helper/data.helper';
import { IJwtPayload } from 'database/abstract';
import { User } from 'database/model/user.entity';
import { Request } from 'express';
import { IAuthService } from '../../auth/auth.service.interface';



export const _extractTokenFromHeader = (
  request: Request,
): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger();

  constructor(
    private authService: IAuthService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    try {
      const token = _extractTokenFromHeader(request);
      if (token) {
        const payload: IJwtPayload = await this._getPayload(token);
        const client = await this._validate(payload);
        request['user'] = client;
        if (!client) {
          throw new UnauthorizedException();
        }
        return true;
      }
      throw new UnauthorizedException();
    } catch (error) {
      this.logger.error(error.message, 'ERROR::UserGuard -> status ' + error.status)
      if (error.status === 401) {
        throw error;
      }
      return false;
    }
  }

  private async _getPayload(token: string): Promise<IJwtPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
      ignoreExpiration: process.env.NODE_ENV === 'prod' ? false : true,
    });
  }

  private async _validate(payload: IJwtPayload): Promise<User | undefined> {
    let user: User;
    if (!DataHelper.isEmpty(payload)) {
      user = await this.authService.search({
        ...payload,
        isActivated: true,
      });
      return user;
    }
  }
}
