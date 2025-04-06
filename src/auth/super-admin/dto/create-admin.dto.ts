import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
   @IsString()
   @MinLength(7)
   @MaxLength(20)
   username: string;

   @IsString()
   @MinLength(7)
   @MaxLength(20)
   password: string;

   @IsString()
   phoneNumber: string;

   @IsString()
   @IsNotEmpty()
   role: string;
}
