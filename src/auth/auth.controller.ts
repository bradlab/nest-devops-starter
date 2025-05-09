import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { IAuthService } from './auth.service.interface';
import {
  SigninAccoutDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  UpdatePwdDTO,
} from '_shared/dto/auth.dto';
import { UserGuard } from '_shared/guard/auth.guard';
import { SignedUser, User } from 'database/model/user.entity';
import { UserFactory } from '_shared/factory/user.factory';
import { DocSignedUserDTO } from './doc.user.dto';
import { GetUser, Public } from '_shared/decorator';

@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  @Public()
  @Get('check.email/:email')
  @ApiOperation({
    summary: 'Check email',
    description:
      'This endpoint allows to check if the email exist before register it',
  })
  @ApiParam({ type: String, name: 'email' })
  @ApiResponse({ type: Boolean })
  checkEmail(@Param('email') email: string): Promise<boolean> {
    return this.authService.checkEmail(email);
  }

  @Public()
  @Get('check.phone/:phone')
  @ApiOperation({
    summary: 'Check phone',
    description:
      'This endpoint allows to check if the phone exist before register it',
  })
  @ApiParam({ type: String, name: 'phone' })
  @ApiResponse({ type: Boolean })
  checkPhone(@Param('phone') phone: string): Promise<boolean> {
    return this.authService.checkPhone(phone);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('token.signin')
  @ApiOperation({ summary: 'Token connexion' })
  // @ApiResponse({ type: DocSignedUserDTO })
  signinByToken(@GetUser() user: User): Partial<User> {
    return UserFactory.getUser(user);
  }

  /**
   * @method POST
   */

  @Post('signin')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'User connexion endpoint' })
  @ApiBody({ type: SigninAccoutDTO })
  @ApiResponse({ type: DocSignedUserDTO })
  async signin(@Body() data: SigninAccoutDTO): Promise<SignedUser> {
    const { accessToken, user } = await this.authService.signin(data);
    if (user) {
      return {
        accessToken,
        ...UserFactory.getUser(user),
      };
    }
    throw new UnauthorizedException('User not found');
  }

  @Post('password.forgot')
  @ApiOperation({
    summary: 'Forgot password',
    description:
      "Ce endpoint permet à un utilisateur de notifier à un admin qu'il a oublié son mot de passe",
  })
  @ApiBody({ type: ForgotPasswordDTO })
  @ApiResponse({ type: String })
  async forgotPassword(@Body() data: ForgotPasswordDTO): Promise<string> {
    return await this.authService.forgotPassword(data);
  }

  @Post('password.reset')
  @ApiOperation({
    summary: 'Reset password',
    description: "Réinitialiser le mot de passe de l'utilisateur",
  })
  @ApiBody({ type: ResetPasswordDTO })
  @ApiResponse({ type: Boolean })
  async resetPassword(@Body() data: ResetPasswordDTO): Promise<boolean> {
    return await this.authService.resetPassword({
      ...data,
      otpCode: data.otpCode?.toString(),
    });
  }

  @Patch('password.update')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update account's password",
    description: "Modifier le mot de passe de l'utilisateur",
  })
  @ApiBody({ type: UpdatePwdDTO })
  @ApiResponse({ type: Boolean })
  async updatePassword(
    @GetUser() user: User,
    @Body() data: UpdatePwdDTO,
  ): Promise<boolean> {
    return await this.authService.updatePassword(user, data);
  }
}
