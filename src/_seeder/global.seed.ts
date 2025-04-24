import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { DataGenerator } from '_shared/helper/data.generator';
import { IRegisterUserDTO, IUserService } from 'user/user.service.interface';

@Injectable()
export class GlobalSeed implements OnApplicationBootstrap {
  private logger = new Logger();
  constructor(private readonly adminService: IUserService) {}

  async onApplicationBootstrap(): Promise<void> {
    this.createAdmin();
  }

  async createAdmin() {
    try {
      const data: IRegisterUserDTO = {
        email: 'admin.user@gmail.com',
        password: DataGenerator.randomString(),
        firstname: 'Admin',
        lastname: 'User',
        phone: '+22890109010',
        address: 'Avedji, Lomé - Togo',
      };
      let existed = await this.adminService.search({
        email: data.email,
        // matricule: data.matricule,
      });
      if (!existed)
        existed = await this.adminService.search({
          email: data.email,
          phone: data.phone,
        });
      if (!existed) {
        const user = await this.adminService.add(data);
        this.logger.log('ADMIN ====== USER', {
          email: user?.email,
          pwd: data.password,
        });
      }
    } catch (error) {
      this.logger.error(error.message, 'ERROR::GlobalSeed.createAdmin');
    }
  }
}
