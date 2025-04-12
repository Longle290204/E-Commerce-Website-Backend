import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './auth.repository';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from 'src/roles/entity/role.entity';

@Module({
   imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.registerAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: {
               expiresIn: 60,
            },
         }),
      }),
      TypeOrmModule.forFeature([User, UserRepository, Role]),
   ],
   controllers: [AuthController],
   providers: [AuthService, UserRepository, JwtStrategy, ConfigService],
   exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
