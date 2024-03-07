import { IsNotEmpty, IsJWT } from 'class-validator';

export class JWTokenDTO {
  @IsNotEmpty()
  @IsJWT()
  accessToken: string;

  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
