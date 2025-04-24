import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from './auth.service.interface';
import { IResetPasswordDTO } from './auth.service.interface';
import { ISignedUserDTO } from './auth.service.interface';
import { User } from 'database/model/user.entity';
import {
  IForgotPasswordDTO,
  ISigninAccoutDTO,
  IUpdatePwdDTO,
} from '_shared/interface';
import { DataGenerator } from '_shared/helper/data.generator';
import { HashFactory } from '_shared/helper/hash.helper';
import { IDBRepository } from 'database/dashboard.repository';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger();
  constructor(
    private dataRepository: IDBRepository,
    private jwtService: JwtService,
  ) {}

  async signin(data: ISigninAccoutDTO): Promise<ISignedUserDTO> {
    try {
      const { email, phone } = data;
      if (email || phone) {
        const user = await this._validateUser(data);
        if (user) {
          return {
            accessToken: this.jwtService.sign({ email, phone, id: user.id }),
            user,
          };
        }
      }
      throw new UnauthorizedException();
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.signin');
      throw error;
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    try {
      const user = await this.search({ email });
      return user ? true : false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.checkEmail');
      throw error;
    }
  }

  async checkPhone(phone: string): Promise<boolean> {
    try {
      const user = await this.search({ phone });
      return user ? true : false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.checkPhone');
      throw error;
    }
  }

  async updatePassword(
    signedUser: User,
    data: IUpdatePwdDTO,
  ): Promise<boolean> {
    try {
      const { oldPassword, newPassword } = data;
      const user = await this.search({ id: signedUser.id });
      if (user) {
        if (await HashFactory.isRightPwd(oldPassword, user.password)) {
          user.password = await HashFactory.hashPwd(newPassword);
          return await this.dataRepository.users.save(user).then(() => true);
        }
        throw new UnauthorizedException();
      }
      throw new NotFoundException('User not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.updatePassword');

      throw error;
    }
  }

  async forgotPassword(data: IForgotPasswordDTO): Promise<string> {
    try {
      const user = await this.search(data);
      if (user) {
        user.code = DataGenerator.randomNumber();
        // TODO: Send notification
        return (await this.dataRepository.users
          .update(user.id, user)
          .then(() => user.code)) as any;
      }
      throw new NotFoundException('User not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.forgotPassword');
      throw error;
    }
  }

  async resetPassword(data: IResetPasswordDTO): Promise<boolean> {
    try {
      const { phone, password, otpCode } = data;
      const user = await this.search({ phone });
      if (user && otpCode && user?.code === otpCode) {
        user.code = null as any;
        user.password = await HashFactory.hashPwd(password);
        return await this.dataRepository.users.save(user).then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.resetPassword');
      throw error;
    }
  }

  private async _validateUser(data: ISigninAccoutDTO): Promise<User> {
    const { phone, email, password } = data;
    const user = await this.search({ phone, email, isActivated: true });
    if (user && (await HashFactory.isRightPwd(password, user.password))) {
      return user;
    }
    return null as any;
  }

  async search(data: Partial<User>): Promise<User> {
    try {
      const { email, phone, isActivated, id } = data;
      let options = <Partial<User>>{};
      if (id) options.id = id;
      if (isActivated) options.isActivated = isActivated;
      if (phone) {
        options.phone = phone;
      } else if (email) {
        options.email = email;
      } else {
        options = { ...data };
      }
      const user = await this.dataRepository.users.findOne({
        where: { ...options },
      });
      return user as any;
    } catch (error) {
      this.logger.error(error, 'ERROR::AuthService.search');
      throw error;
    }
  }
}
