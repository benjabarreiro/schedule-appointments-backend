import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { CreateUserDto } from '../auth/dtos';
import { User } from 'src/entities/user.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly filePath = path.join(__dirname, '..', 'users.json');
  private readonly filePathSrc = path.join(
    __dirname,
    '../../src',
    'users.json',
  );

  private userRepository: Repository<User>;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getRepository(User);
  }

  async createUser(user: CreateUserDto) {
    const newUser = await this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string): Promise<any | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
