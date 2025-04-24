import {
  Logger,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import {
  IUserService,
  IUpdateUserDTO,
  IRegisterUserDTO,
} from './user.service.interface';
import { UserFactory } from '../_shared/factory/user.factory';
import { IAuthService } from 'auth/auth.service.interface';
import { IDBRepository } from 'database/dashboard.repository';
import { User } from 'database/model/user.entity';
import { In } from 'typeorm';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDBRepository,
    private authService: IAuthService,
  ) {}

  async fetchAll(): Promise<User[]> {
    return await this.dashboardRepository.users.find({
      order: { createdAt: 'DESC' },
    });
  }

  async fetchOne(id: string): Promise<User> {
    return (await this.dashboardRepository.users.findOne({
      where: { id },
    })) as User;
  }

  async search(param: Partial<User>): Promise<User> {
    return this.authService.search(param);
  }

  async add(data: IRegisterUserDTO): Promise<User> {
    try {
      const { email, phone } = data;
      let existed: User;
      if (email) existed = await this.authService.search({ email });
      if (phone) existed = await this.authService.search({ phone });
      if (existed!) {
        throw new ConflictException(
          'User account email or phone number allready exist',
        );
      }
      const user = await this.dashboardRepository.users.save(
        await UserFactory.create(data),
      );
      return user;
    } catch (error) {
      this.logger.error(error, 'ERROR::UserService.add');
      throw error;
    }
  }

  async edit(data: IUpdateUserDTO): Promise<User> {
    try {
      const { id } = data;
      const user = await this.fetchOne(id);
      if (user) {
        const userInstance = UserFactory.update(user, data);
        return await this.dashboardRepository.users.save(userInstance);
      }
      throw new NotFoundException('User not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::UserService.editUser');

      throw error;
    }
  }

  async setState(ids: string[]): Promise<boolean> {
    try {
      const users =
        ids && (await this.dashboardRepository.users.findBy({ id: In(ids) }));
      if (users?.length > 0) {
        users.map((user) => {
          user.isActivated = !user.isActivated;
          return user;
        });
        return await this.dashboardRepository.users
          .save(users)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'ERROR::UserService.setState');
      return false;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const user = await this.fetchOne(id);
      if (user) {
        return await this.dashboardRepository.users
          .remove(user)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::UserService.remove');
      throw error;
    }
  }
}
