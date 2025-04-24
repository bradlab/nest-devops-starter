import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiQuery,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { IUserService } from './user.service.interface';
import { RegisterUserDTO, UpdateUserDTO } from './user.input.dto';
import { UserFactory } from '../_shared/factory/user.factory';
import { GetUser } from '../_shared/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'config/base.config';
import { UserGuard } from '_shared/guard/auth.guard';
import { IDParamDTO, IDsParamDTO } from '_shared/dto/param.dto';
import { DataGenerator } from '_shared/helper/data.generator';
import { DocUserDTO } from 'auth/doc.user.dto';
import { User } from 'database/model/user.entity';

@ApiTags('User as User management')
@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Get()
  @ApiOperation({
    summary: 'Users list',
    description: 'Fetch all users in the DB',
  })
  @ApiResponse({ type: DocUserDTO, isArray: true })
  async all(): Promise<Partial<User>[]> {
    const users = await this.userService.fetchAll();
    return users.map((user) => UserFactory.getUser(user));
  }

  // @HasPermission(RuleEnum.CAN_SHOW_USER)
  @Get(':id')
  @ApiOperation({
    summary: 'One User',
    description: 'Fetch user account by ID',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the needed clinic',
  })
  @ApiResponse({ type: DocUserDTO })
  async show(@Param() { id }: IDParamDTO): Promise<Partial<User>> {
    return UserFactory.getUser(await this.userService.fetchOne(id));
  }

  /**
   * @method POST
   */

  // @ApiExcludeEndpoint()
  @Post()
  // @HasPermission(RuleEnum.CAN_CREATE_USER)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Create account user',
    description: 'As an admin, you can create user for your business',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: BaseConfig.setFilePath,
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.imageFileFilter,
    }),
  )
  async create(
    @Body() data: RegisterUserDTO,
    @UploadedFile() file: any,
  ): Promise<Partial<User> | undefined> {
    data.avatar = file ? file.filename : undefined;
    data.password = DataGenerator.randomString();
    const user = await this.userService.add(data);
    if (user) return { ...UserFactory.getUser(user), password: data.password };
  }

  /**
   * @method PATCH
   */

  @Patch()
  // @HasPermission(RuleEnum.CAN_UPDATE_USER)
  @ApiOperation({ summary: 'Update user account' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({ type: DocUserDTO })
  async update(@Body() data: UpdateUserDTO): Promise<Partial<User>> {
    return UserFactory.getUser(await this.userService.edit(data));
  }

  @Patch('state')
  // @HasPermission(RuleEnum.CAN_SET_USER_STATE)
  @ApiOperation({ summary: "Modification d'état des utilisateurs" })
  @ApiBody({
    type: IDsParamDTO,
    description: 'Id des utilisateurs concernés',
  })
  @ApiResponse({ type: Boolean })
  async setState(@Body() { ids }: IDsParamDTO): Promise<boolean> {
    if (ids) {
      if (ids && typeof ids === 'string') ids = [ids];
      return await this.userService.setState(ids);
    }
    return false;
  }

  /**
   * @method DELETE
   */

  @Delete(':id')
  // @HasPermission(RuleEnum.CAN_DELETE_USER)
  @ApiOperation({ summary: 'Remove Account' })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the user to remove',
  })
  @ApiResponse({ type: Boolean })
  remove(@Param() { id }: IDParamDTO): Promise<boolean> {
    return this.userService.remove(id);
  }
}
