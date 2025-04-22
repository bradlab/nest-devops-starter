export interface ISigninAccoutDTO {
  email?: string;
  phone?: string;
  deviceToken?: string;
  password: string;
}
export interface ISignedDTO {
  user: any;
  deviceToken?: string;
  accessToken: string;
}

export interface IForgotPasswordDTO {
  email?: string;
  phone?: string;
}

export interface IResetPasswordDTO extends ISigninAccoutDTO {
  otpCode: string;
}

export interface IForgotPasswordDTO {
  email?: string;
  phone?: string;
}

export interface IUpdatePwdDTO {
  oldPassword: string;
  newPassword: string;
}
