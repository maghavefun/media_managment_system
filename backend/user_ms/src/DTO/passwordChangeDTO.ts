import { IsNotEmpty, Matches } from 'class-validator';
import { constants } from 'src/constants';

export class PasswordChangeDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Matches(constants.passwordRegExp)
  previousPassword: string;

  @IsNotEmpty()
  @Matches(constants.passwordRegExp)
  @Matches(constants.passwordRegExp, {
    message:
      'The password must contain at least one capital and written Latin letter, a number, one of these symbols #?!@$ %^&*- and at the end must consist of at least 8 characters.',
  })
  newPassword: string;
}
