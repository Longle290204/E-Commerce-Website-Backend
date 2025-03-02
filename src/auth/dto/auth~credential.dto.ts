import { IsNumberString, IsString, Matches, MaxLength, MinLength } from 'class-validator';

// auth/dto/auth-signup.dto.ts
export class AuthSignUpDto {
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

// auth/dto/auth-signin.dto.ts
export class AuthSignInDto {
   @IsString()
   @MinLength(7)
   @MaxLength(20)
   username: string;

   @IsString()
   @MinLength(7)
   @MaxLength(20)
   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'password is too weak',
   })
   password: string;
}
