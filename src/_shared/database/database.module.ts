import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardRepository, IDBRepository } from './dashboard.repository';
import { UserEntity } from './model/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],
  providers: [
    {
      provide: IDBRepository,
      useClass: DashboardRepository,
    },
  ],
  exports: [IDBRepository],
})
export class DBRepositoryModule {}
