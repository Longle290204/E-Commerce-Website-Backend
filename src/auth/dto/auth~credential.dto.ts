import { IsNumberString, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  username: string;

  @IsNumberString()
  @MinLength(10)
  phoneNumber: string;

  @IsString()
  @MinLength(7)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}
