import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserCredentialsModule } from '../user-credentials/user-credentials.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  imports: [
    UserCredentialsModule,
    JwtModule.register({
      global: true,
    }),
  ],
})
export class AuthModule {}
