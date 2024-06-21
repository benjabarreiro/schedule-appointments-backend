import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../auth/dtos';
import { User } from 'src/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { convertKeysToSnakeCase } from 'src/lib/utils/parsers';

@Injectable()
export class UsersService {
  private userRepository: Repository<User>;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getRepository(User);
  }

  async createUser(user: CreateUserDto) {
    const parsedUser = convertKeysToSnakeCase(user);
    const newUser = await this.userRepository.create(parsedUser);
    return await this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string): Promise<any | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUser(body: UpdateUserDto, id: number): Promise<any | undefined> {
    const user = await this.userRepository.findOneBy({ id });
    const parsedBody = convertKeysToSnakeCase(body);

    const updatedUser = { ...user, parsedBody };

    return await this.userRepository.save(updatedUser);
  }
}
