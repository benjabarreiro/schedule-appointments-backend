import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto, ValidateCreateUserDto } from '../common/dtos';
import { Connection, Repository } from 'typeorm';
import { convertKeysToSnakeCase } from 'src/common/utils/parsers';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private userRepository: Repository<User>;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getRepository(User);
  }

  async createUser(user: ValidateCreateUserDto) {
    try {
      const parsedUser = convertKeysToSnakeCase(user);
      const newUser = await this.userRepository.create(parsedUser);
      return await this.userRepository.save(newUser);
    } catch (err) {
      throw new HttpException(
        'There was an error creating the user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (err) {}
  }

  async findUserByEmail(email: string): Promise<any | undefined> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (err) {
      throw new HttpException(
        'There was an error checking the email in db',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(body: UpdateUserDto, id: number): Promise<any | undefined> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new HttpException(
          `User with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const parsedBody = convertKeysToSnakeCase(body);

      const updatedUser = { ...user, ...parsedBody };

      return await this.userRepository.save(updatedUser);
    } catch (err) {
      if (err.status === 404) throw err;

      throw new HttpException(
        'There was an error updating the user with id: ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserRole(role_id, user_id) {
    try {
      const user = await this.userRepository.findOneBy({ id: user_id });

      if (!user) {
        throw new HttpException(
          `User with id ${user_id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedUser = { ...user, role_id };

      return await this.userRepository.save(updatedUser);
    } catch (err) {
      if (err.status === 404) throw err;

      throw new HttpException(
        'There was an error updating role of the user with id: ' + user_id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('No user exists with id: ' + id);
      }
      return await this.userRepository.delete(id);
    } catch (err) {
      if (err.status === 404) throw err;
      throw new HttpException(
        'There was an error deleting the user with id: ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
