import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../common/dtos';
import { Connection, Repository } from 'typeorm';
import {
  convertKeysToSnakeCase,
  parseToCamelCase,
} from 'src/common/utils/parsers';
import { User } from './entities/user.entity';
import { UserAuthDto, UserDto } from './dtos';
import { IJwt } from 'src/jwt/interfaces';
import { RolesIds } from 'src/common/enums';

@Injectable()
export class UsersService {
  private userRepository: Repository<User>;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getRepository(User);
  }

  async createUser(user: CreateUserDto): Promise<IJwt> {
    try {
      const parsedUser = convertKeysToSnakeCase(user);
      const newUser = await this.userRepository.create(parsedUser);
      const createdUser = await this.userRepository.save(newUser);
      return {
        id: createdUser['id'],
        email: createdUser['email'],
        roles: [{ roleId: RolesIds.patient }],
      };
    } catch (err) {
      throw new HttpException(
        'There was an error creating the user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserById(id: number): Promise<UserDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new HttpException(
          `User with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const parsedUser = parseToCamelCase(user);

      return new UserDto(parsedUser);
    } catch (err) {
      throw new HttpException(
        'There was an error finding user with id ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByEmail(email: string): Promise<UserAuthDto | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return parseToCamelCase(user);
    } catch (err) {
      throw new HttpException(
        'There was an error checking the email in db',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(body: UpdateUserDto, id: number): Promise<string> {
    try {
      const user = await this.findUserById(id);

      const updatedUser = { ...user, ...body };
      const parsedBody = convertKeysToSnakeCase(updatedUser);

      await this.userRepository.save(parsedBody);

      return `User with id ${id} was updated successfully`;
    } catch (err) {
      if (err.status === 404) throw err;

      throw new HttpException(
        'There was an error updating the user with id: ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: number): Promise<string> {
    try {
      await this.findUserById(id);
      await this.userRepository.delete(id);

      return `User with id ${id} has been successfully deleted`;
    } catch (err) {
      if (err.status === 404) throw err;
      throw new HttpException(
        'There was an error deleting the user with id: ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserPassword(email: string, newPassword: string) {
    try {
      const userInfo = await this.findUserByEmail(email);
      const userInfoWithNewPassword = { ...userInfo, password: newPassword };

      await this.userRepository.save(userInfoWithNewPassword);
      return 'Password changed correctly';
    } catch (err) {
      throw err;
    }
  }
}
