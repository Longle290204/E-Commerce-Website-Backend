import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthSignUpDto } from './dto/auth~credential.dto';
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserRepository extends Repository<User> {
   constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly dataSource: DataSource,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
   ) {
      super(userRepository.target, userRepository.manager, userRepository.queryRunner);
   }

   async createUser(authSignUpDto: AuthSignUpDto): Promise<void> {
      const { username, phoneNumber, password } = authSignUpDto;

      // Kiểm tra username tồn tại
      const usernameExists = await this.dataSource.getRepository(User).findOne({ where: { username } });
      if (usernameExists) {
         throw new ConflictException('Username đã tồn tại');
      }

      // Kiểm tra số điện thoại tồn tại
      const phoneNumberExist = await this.dataSource.getRepository(User).findOne({ where: { phoneNumber } });
      if (phoneNumberExist) {
         throw new ConflictException(`Số điện thoại đã tồn tại`);
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      const user = this.dataSource.getRepository(User).create({ username, phoneNumber, password: hashPassword });
      // This is add into memory but it not yet save in database

      try {
         await this.dataSource.getRepository(User).save(user);
         // In process exception error unique username, it will take when save in database
      } catch (error) {
         if (error.code === '23505') {
            // 23505 represent constraint unique violation error
            throw new ConflictException('Username already exist');
         } else {
            throw new InternalServerErrorException();
         }
      }
   }

   // Check if username and phone number exist
   async checkIfExists(username: string, phoneNumber: string) {
      if (username) {
         const user = await this.userRepository.findOne({ where: { username } });
         return { exists: !!user };
      }

      if (phoneNumber) {
         const user = await this.userRepository.findOne({ where: { phoneNumber } });
         return { exists: !!user };
      }
   }

   // Refresh token
   async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
      const { refreshToken } = refreshTokenDto;
      try {
         // 1. Xác thực và giải mã refresh token
         const payload = this.jwtService.verify(refreshToken, {
            secret: this.configService.get('JWT_SECRET'),
         });

         // 2. Tìm người dùng từ payload
         const user = await this.userRepository.findOneBy({ id: payload.id });
         if (!user) {
            throw new UnauthorizedException(`Người dùng không tồn tại`);
         }

         // 3. Kiểm tra refresh token có hợp lệ không (so với DB)
         const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
         if (!isMatch) {
            throw new UnauthorizedException(`RefreshToken không hợp lệ`);
         }

         // 4. Tạo Access Token mới
         const newAccessToken = this.jwtService.sign({ username: user.username, id: user.id }, { expiresIn: '15m' });

         // 5. Tạo Refresh Token mới
         const newRefreshToken = this.jwtService.sign({ username: user.username, id: user.id }, { expiresIn: '5d' });

         // 6. Lưu refresh token mới vào database
         await this.updateRefreshToken(user.id, newRefreshToken);

         return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken, // ⚠ Trả về refresh token mới
         };
      } catch (error) {
         throw new UnauthorizedException(`Refresh token không hợp lệ hoặc đã hết hạn`);
      }
   }

   async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
      const hashedToken = await this.hashToken(refreshToken);
      await this.userRepository.update(userId, { refreshToken: hashedToken });
   }

   private async hashToken(refreshToken: string): Promise<string> {
      const salt = await bcrypt.genSalt();
      const hashToken = await bcrypt.hash(refreshToken, salt);
      return hashToken;
   }
}
