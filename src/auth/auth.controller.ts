import { Controller, Query, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth~credential.dto';
import { AuthSignInDto } from './dto/auth~credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService) {}

   @Post('/signUp')
   signUp(@Body() authSignUpDto: AuthSignUpDto): Promise<void> {
      return this.authService.signUp(authSignUpDto);
   }

   @Post('/signIn')
   signIn(@Body() authSignInDto: AuthSignInDto): Promise<{ accessToken: string }> {
      return this.authService.signIn(authSignInDto);
   }

   @Post('/checkIfExist')
   async checkExist(@Body() { username, phoneNumber }: { username?: string; phoneNumber?: string }) {
      return this.authService.checkIfExists(username, phoneNumber);
   }

   @Post('/refreshToken')
   @HttpCode(HttpStatus.OK)
   refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
      return this.authService.refreshToken(refreshTokenDto);
   }
}
