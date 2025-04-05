import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthSignInDto, AuthSignUpDto } from './dto/auth~credential.dto';
import { UserRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
   constructor(
      private readonly userRepository: UserRepository,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
   ) {}

   // Sign up
   async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
      return this.userRepository.createUser(authSignUpDto);
   }

   // Sign in
   async signIn(authSignInDto: AuthSignInDto): Promise<{ accessToken: string; refreshToken: string }> {
      const { username, password } = authSignInDto;

      const user = await this.userRepository.findOne({ where: { username } });

      if (user && (await bcrypt.compare(password, user.password))) {
         const payload: JwtPayload = { username: username, id: user.id };
         const accessToken: string = this.jwtService.sign(payload, { expiresIn: '15m' });
         const refreshToken: string = this.jwtService.sign(payload, { expiresIn: '5d' });

         // Hash refreshToken trước khi lưu vào DB
         const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
         // Lưu refreshToken vào database
         await this.userRepository.update(user.id, { refreshToken: hashedRefreshToken });

         return { accessToken, refreshToken };
      } else {
         throw new UnauthorizedException('Please check your login credentials');
      }
   }

   // Check username and phoneNumber exist
   async checkIfExists(username: string, phoneNumber: string) {
      return this.userRepository.checkIfExists(username, phoneNumber);
   }

   // Refresh token
   async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
      return this.userRepository.refreshToken(refreshTokenDto);
   }
}
