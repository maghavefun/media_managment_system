import { Module } from '@nestjs/common';
import { UserCredentialsService } from './user-credentials.service';

@Module({
  providers: [UserCredentialsService],
  exports: [UserCredentialsService],
})
export class UserCredentialsModule {}
