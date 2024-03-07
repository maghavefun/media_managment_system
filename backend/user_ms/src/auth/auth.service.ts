import { PasswordChangeDTO } from 'src/DTO/passwordChangeDTO';
import { UserAuthDTO } from 'src/DTO/UserAuthDTO';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { UserCredentialsService } from 'src/user-credentials/user-credentials.service';
import { JWTokenDTO } from '../DTO/JWTokenDTO';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User_auth } from 'src/entity/User_auth';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private userCredentialsService: UserCredentialsService,
    private jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
    private config: ConfigService,
  ) {}

  async signIn(username: string, pass: string): Promise<JWTokenDTO> {
    try {
      const user = await this.userCredentialsService.findOne({ username });

      if (!user) {
        throw new UnauthorizedException('Invalid username or password.');
      }

      const cryptedPassword = await bcrypt.hash(pass, user.salt);

      if (cryptedPassword !== user.password) {
        throw new UnauthorizedException('Invalid username or password.');
      }

      const payload = { id: user.id, username: user.username };

      return {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '60s',
          secret: this.config.get('JWT_SECRET'),
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1d',
          secret: this.config.get('JWT_SECRET'),
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async signUp(signUpUserDTO: UserAuthDTO): Promise<JWTokenDTO> {
    let user: Omit<User_auth, 'salt' | 'password' | 'profile'> | Error;

    try {
      user = await this.userCredentialsService.create(signUpUserDTO);
    } catch {
      throw new BadRequestException('User already exist');
    }

    console.log(user);

    return {
      accessToken: await this.jwtService.signAsync(user, {
        expiresIn: '60s',
        secret: this.config.get('JWT_SECRET'),
      }),
      refreshToken: await this.jwtService.signAsync(user, {
        expiresIn: '1d',
        secret: this.config.get('JWT_SECRET'),
      }),
    };
  }

  async refreshToken(): Promise<JWTokenDTO> {
    try {
      const refreshTokenFromReq = this.request.cookies?.refreshToken;
      const refreshTokenData = await this.jwtService.verifyAsync(
        refreshTokenFromReq,
        {
          secret: this.config.get('JWT_SECRET'),
        },
      );

      const user = await this.userCredentialsService.findOne({
        username: refreshTokenData?.username,
      });

      const payload = { id: user.id, username: user.username };

      return {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '60s',
          secret: this.config.get('JWT_SECRET'),
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1d',
          secret: this.config.get('JWT_SECRET'),
        }),
      };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async changePassword(passwordChangeDTO: PasswordChangeDTO) {
    try {
      await this.userCredentialsService.updatePassword(passwordChangeDTO);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new BadRequestException();
    }
  }
}
