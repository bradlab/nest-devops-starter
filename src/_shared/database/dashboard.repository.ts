import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserEntity } from './model/user.entity';


export abstract class IDBRepository {
  users: Repository<User>;
}

@Injectable()
export class DashboardRepository
  implements IDBRepository, OnApplicationBootstrap
{
  users: Repository<UserEntity>;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  onApplicationBootstrap(): void {
    this.users = this.userRepository;
  }
}
