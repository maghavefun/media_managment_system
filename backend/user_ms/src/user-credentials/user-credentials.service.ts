import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserAuthDTO } from '../DTO/UserAuthDTO';
import * as bcrypt from 'bcrypt';
import { PasswordChangeDTO } from 'src/DTO/passwordChangeDTO';
import { DataSource, EntityManager } from 'typeorm';
import { User_auth } from 'src/entity/User_auth';
import { User_profile } from 'src/entity/User_profile';

@Injectable()
export class UserCredentialsService {
  constructor(private dbSource: DataSource) {}

  async findOne(partialUserDTO: Partial<User_auth>): Promise<User_auth | null> {
    try {
      return await this.dbSource.getRepository(User_auth).findOne({
        where: {
          username: partialUserDTO.username,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async create(
    createUserDTO: UserAuthDTO,
  ): Promise<Omit<User_auth, 'salt' | 'password' | 'profile'> | Error> {
    let createdUser: User_auth;

    try {
      const generatedSalt = await bcrypt.genSalt();

      const cryptedPass = await bcrypt.hash(
        createUserDTO.password,
        generatedSalt,
      );

      await this.dbSource.transaction(async (entityManager: EntityManager) => {
        const profile = await entityManager
          .getRepository(User_profile)
          .create({});

        createdUser = await entityManager.getRepository(User_auth).create({
          username: createUserDTO.username,
          password: cryptedPass,
          salt: generatedSalt,
          profile,
        });
        await entityManager.getRepository(User_auth).save(createdUser);
      });
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }

    return {
      id: createdUser.id,
      username: createdUser.username,
    };
  }

  async updatePassword({
    username,
    previousPassword,
    newPassword,
  }: PasswordChangeDTO) {
    try {
      if (previousPassword === newPassword) {
        throw new BadRequestException(
          'Previous and new password cannot be the same',
        );
      }

      const user = await this.findOne({ username });
      if (!user) {
        throw new UnauthorizedException();
      }

      const cryptedPrevPass = await bcrypt.hash(previousPassword, user.salt);

      if (cryptedPrevPass !== user.password) {
        throw new UnauthorizedException();
      }

      const generatedSalt = await bcrypt.genSalt();
      const cryptedNewPass = await bcrypt.hash(newPassword, generatedSalt);

      await this.dbSource.getRepository(User_auth).update(
        { username },
        {
          password: cryptedNewPass,
          salt: generatedSalt,
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
