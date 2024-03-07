import { User_profile } from 'src/entity/User_profile';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { constants } from 'src/constants';
import { User_auth } from 'src/entity/User_auth';

export class UserProfileCreateDTO implements User_profile {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @Matches(constants.nameRegExp)
  @Length(20)
  @IsOptional()
  first_name: string;

  @Matches(constants.nameRegExp)
  @Length(20)
  @IsOptional()
  second_name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsDate()
  @IsOptional()
  birth_date: Date;

  @IsUUID()
  @IsOptional()
  avatar_id: string;

  credentials: User_auth;
}

export class UserProfilePartialDTO
  implements Omit<Partial<User_profile>, 'user_id'>
{
  @Matches(constants.nameRegExp)
  @Length(20)
  @IsOptional()
  first_name?: string;

  @Matches(constants.nameRegExp)
  @Length(20)
  @IsOptional()
  second_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsDate()
  @IsOptional()
  birth_date?: Date;

  @IsUUID()
  @IsOptional()
  avatar_id?: string;
}
