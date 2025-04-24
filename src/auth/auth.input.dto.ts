import { ApiProperty } from '@nestjs/swagger';
import { BasicPersonnalInfoDTO } from '_shared/dto/param.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterStaffDTO extends BasicPersonnalInfoDTO {
  @ApiProperty({
    type: String,
    name: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    format: 'binary',
    name: 'avatar',
    required: false,
  })
  avatar: string;
}
