import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth~credential.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, phoneNumber, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.dataSource
      .getRepository(User)
      .create({ username, phoneNumber, password: hashPassword });
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
}
