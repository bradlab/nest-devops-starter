import {
  IForgotPasswordDTO,
  ISigninAccoutDTO,
  IUpdatePwdDTO,
  IBasicPersonnalInfoDTO,
} from '_shared/interface';
import { User } from 'database/model/user.entity';

export interface ICreateUserDTO extends IBasicPersonnalInfoDTO {
  avatar?: string;
}

export interface ISignedUserDTO {
  user: User;
  deviceToken?: string;
  accessToken: string;
}
export interface IUserQuery {
  ids?: string[];
  courriel?: string;
  phone?: string;
}
export interface IResetPasswordDTO extends ISigninAccoutDTO {
  otpCode: string;
}

export abstract class IAuthService {
  abstract signin(data: ISigninAccoutDTO): Promise<ISignedUserDTO>;

  abstract checkEmail(email: string): Promise<boolean>;

  abstract checkPhone(phone: string): Promise<boolean>;

  abstract updatePassword(user: User, data: IUpdatePwdDTO): Promise<boolean>;

  abstract forgotPassword(data: IForgotPasswordDTO): Promise<string>;

  abstract resetPassword(data: IResetPasswordDTO): Promise<boolean>;

  abstract search(data: Partial<User>): Promise<User>;
}
