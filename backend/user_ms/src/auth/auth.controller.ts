import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';
import { UserAuthDTO } from 'src/DTO/UserAuthDTO';
import { PasswordChangeDTO } from 'src/DTO/passwordChangeDTO';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign_in')
  async signIn(@Body() signInDTO: UserAuthDTO, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } = await this.authService.signIn(
        signInDTO.username,
        signInDTO.password,
      );

      res.cookie('refreshToken', refreshToken).json({ accessToken });
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign_up')
  async signUp(@Body() signUpDTO: UserAuthDTO, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.signUp(signUpDTO);

      res.cookie('refreshToken', refreshToken).json({ accessToken });
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('refresh')
  async refreshToken(@Res() res: Response) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.refreshToken();

      res.cookie('refreshToken', refreshToken).json({ accessToken });
    } catch {
      throw new UnauthorizedException();
    }
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Put('change_password')
  changePassword(@Body() passwordChangeDTO: PasswordChangeDTO) {
    return this.authService.changePassword(passwordChangeDTO);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/isUserAuthorized')
  getProfile(@Res() res: Response): Response {
    return res.send(HttpStatus.OK);
  }
}
