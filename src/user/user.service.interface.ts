import { ICreateUserDTO } from 'auth/auth.service.interface';
import { User } from 'database/model/user.entity';

export interface IUpdateUserDTO extends Partial<ICreateUserDTO> {
  id: string;
}

export interface IRegisterUserDTO extends ICreateUserDTO {
  password: string;
  deviceToken?: string;
}

export abstract class IUserService {
  abstract add(data: IRegisterUserDTO): Promise<User>;

  abstract fetchAll(): Promise<User[]>;

  abstract fetchOne(id: string): Promise<User>;

  abstract search(param: Partial<User>): Promise<User>;

  abstract edit(data: IUpdateUserDTO): Promise<User>;

  abstract setState(ids: string[]): Promise<boolean>;

  abstract remove(id: string): Promise<boolean>;

}
