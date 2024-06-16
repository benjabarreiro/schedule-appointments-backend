import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dtos';

@Injectable()
export class UsersService {
  private readonly filePath = path.join(__dirname, '..', 'users.json');
  private readonly filePathSrc = path.join(
    __dirname,
    '../../src',
    'users.json',
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const newUser = await this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
