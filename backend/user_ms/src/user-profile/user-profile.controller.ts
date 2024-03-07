import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserProfilePartialDTO } from 'src/DTO/UserProfileDTOs';

@Controller('profile')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AuthGuard)
  @Put('update')
  async update(
    @Param('id') id: string,
    @Body() userUpdateDTO: UserProfilePartialDTO,
  ) {
    return await this.userProfileService.update(id, userUpdateDTO);
  }

  @HttpCode(HttpStatus.FOUND)
  @UseGuards(AuthGuard)
  @Get()
  async getOneBy(@Param('id') id: string) {
    return this.userProfileService.getOneBy(id);
  }

  @HttpCode(HttpStatus.FOUND)
  @UseGuards(AuthGuard)
  @Get('list')
  async getListOfUsersBy(@Param() params: UserProfilePartialDTO) {
    return await this.userProfileService.getListOfUsersBy(params);
  }
}
