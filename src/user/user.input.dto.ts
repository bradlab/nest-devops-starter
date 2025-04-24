import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BasicPersonnalInfoDTO } from '_shared/dto/param.dto';
import { IsString, IsUUID } from 'class-validator';

export class UserAccoutDTO extends BasicPersonnalInfoDTO {
  @ApiProperty({ type: String, format: 'binary', required: false })
  avatar?: string;
}

export class RegisterUserDTO extends UserAccoutDTO {
  @ApiProperty({
    type: String,
    name: 'password',
  })
  @IsString()
  password: string;
}

export class UpdateUserDTO extends PartialType(UserAccoutDTO) {
  @ApiProperty({
    type: String,
    name: 'id',
    description: 'ID of the given user',
  })
  @IsString()
  @IsUUID()
  id: string;
}
