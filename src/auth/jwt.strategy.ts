import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;

    const user = this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException(`Not found ${username}`);
    }
    return user;
  }
}
