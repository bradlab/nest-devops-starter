import { ApiProperty } from '@nestjs/swagger';
import { BasicPersonnalInfoDTO } from '_shared/dto/param.dto';
import { SexEnum } from '_shared/enum';
import { User } from 'database/model/user.entity';

export class DocUserDTO
  extends BasicPersonnalInfoDTO
  implements Partial<User>
{
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: String, enum: SexEnum, required: false })
  sex: SexEnum;

  @ApiProperty({ type: Boolean })
  isActivated: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  otpCode?: string;
}

export class DocSignedUserDTO extends DocUserDTO {
  @ApiProperty({ type: String })
  accessToken: string;
}
