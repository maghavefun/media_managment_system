import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserCredentialsModule } from './user-credentials/user-credentials.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileController } from './user-profile/user-profile.controller';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UserProfileService } from './user-profile/user-profile.service';

@Module({
  imports: [
    AuthModule,
    UserCredentialsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/entity/*.{ts,js}'],
        migrations: [__dirname + '/migrations/*.{ts,js}'],
        synchronize: config.get('NODE_ENV') === 'dev',
      }),
    }),
    UserProfileModule,
  ],
  controllers: [AppController, UserProfileController],
  providers: [AppService, UserProfileService],
})
export class AppModule {}
