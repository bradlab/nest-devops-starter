import { DataHelper } from "_shared/helper/data.helper";
import { HashFactory } from "_shared/helper/hash.helper";
import { User } from "database/model/user.entity";
import { IRegisterUserDTO, IUpdateUserDTO } from "user/user.service.interface";


export abstract class UserFactory {
  static async create(data: IRegisterUserDTO): Promise<User> {
    const user = new User();
    user.email = data.email;
    user.phone = data.phone;
    user.email = data.email;
    user.phone = data.phone;
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    user.avatar = data.avatar;
    user.address = data.address;
    user.sex = data.sex;
    user.password = await HashFactory.hashPwd(data.password);
    return user;
  }

  static update(user: User, data: IUpdateUserDTO): User {
    user.firstname = data.firstname ?? user.firstname;
    user.lastname = data.lastname ?? user.lastname;
    user.address = data.address ?? user.address;
    user.avatar = data.avatar ?? user.avatar;
    user.sex = data.sex ?? user.sex;

    return user;
  }

  static getUser(user: User): Partial<User> {
    if (user) {
      return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstname: user.firstname,
        lastname: user.lastname,
        fullname: user.fullname,
        address: user.address,
        avatar: DataHelper.getFileLink(user.avatar!),
        sex: user.sex,
        isActivated: user.isActivated,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
    return null as any;
  }
}
