import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
   @IsString()
   @IsNotEmpty()
   @MinLength(6, { message: 'Mật khẩu cũ phải có ít nhất 6 ký tự' })
   oldPassword: string;

   @IsNotEmpty()
   @IsString()
   @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
   newPassword: string;

   @IsNotEmpty()
   @IsString()
   @MinLength(6, { message: 'Mật khẩu nhập lại phải có ít nhất 6 ký tự' })
   reNewPassword: string;
}
