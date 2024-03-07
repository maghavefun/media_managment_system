import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserProfilePartialDTO } from 'src/DTO/UserProfileDTOs';
import { User_profile } from 'src/entity/User_profile';
import { DataSource } from 'typeorm';

@Injectable()
export class UserProfileService {
  constructor(private dbSource: DataSource) {}

  async update(id: string, userUpdateDTO: UserProfilePartialDTO) {
    try {
      await this.dbSource
        .getRepository(User_profile)
        .update({ user_id: id }, userUpdateDTO);

      return this.dbSource
        .getRepository(User_profile)
        .findOneBy({ user_id: id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOneBy(id: string) {
    try {
      const data = await this.dbSource
        .getRepository(User_profile)
        .findOneBy({ user_id: id });

      if (!data) {
        throw new NotFoundException();
      }

      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getListOfUsersBy(params: UserProfilePartialDTO) {
    try {
      return await this.dbSource.getRepository(User_profile).findBy(params);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
