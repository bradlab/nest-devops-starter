import { SexEnum } from '_shared/enum';
import { Exclude } from 'class-transformer';
import { PersonAbstract } from 'database/abstract/entity.abstract';
import { Entity, Index, Column } from 'typeorm';

@Entity('users')
@Index(['phone'], { unique: true, where: `deleted_at IS NULL` })
@Index(['email'], { unique: true, where: `deleted_at IS NULL` })
export class UserEntity extends PersonAbstract {
  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true, enum: SexEnum, default: SexEnum.UNKNOWN })
  sex?: SexEnum;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  code?: string;

  get fullname() {
    return `${this.firstname} ${this.lastname}`;
  }
}

export class User extends UserEntity {};

export interface SignedUser extends Partial<User> {
  accessToken: string;
}
