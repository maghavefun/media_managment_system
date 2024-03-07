import { User_auth } from 'src/entity/User_auth';
import { IsNotEmpty, Matches } from 'class-validator';
import { constants } from 'src/constants';

export class UserAuthDTO implements Omit<User_auth, 'id' | 'salt' | 'profile'> {
  @IsNotEmpty()
  @Matches(constants.nicknameRegExp, {
    message: 'username should not start with number',
  })
  username: string;

  @IsNotEmpty()
  @Matches(constants.passwordRegExp, {
    message:
      'The password must contain at least one capital and written Latin letter, a number, one of these symbols #?!@$ %^&*- and at the end must consist of at least 8 characters.',
  })
  password: string;
}
