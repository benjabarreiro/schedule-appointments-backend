import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto, ValidateCreateUserDto } from '../common/dtos';
import { Connection, Repository } from 'typeorm';
import {
  convertKeysToSnakeCase,
  parseToCamelCase,
} from 'src/common/utils/parsers';
import { User } from './entities/user.entity';
import { UserAuthDto, UserDto } from './dtos';

@Injectable()
export class UsersService {
  private userRepository: Repository<User>;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getRepository(User);
  }

  async createUser(user: ValidateCreateUserDto): Promise<UserAuthDto> {
    try {
      const parsedUser = convertKeysToSnakeCase(user);
      const newUser = await this.userRepository.create(parsedUser);
      return await this.userRepository.save(newUser)[0];
    } catch (err) {
      throw new HttpException(
        'There was an error creating the user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserById(id: number): Promise<UserDto | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      const parsedUser = parseToCamelCase(user);
      return parsedUser.map((user) => new UserDto(user));
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

  async updateUser(
    body: UpdateUserDto,
    id: number,
  ): Promise<UserDto | undefined> {
    try {
      const user = await this.findUserById(id);

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

  async updateUserRole(roleId, userId): Promise<string> {
    try {
      const user = await this.findUserById(userId);

      if (!user) {
        throw new HttpException(
          `User with id ${userId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedUser = { ...user, roleId };

      await this.userRepository.save(updatedUser);

      return `User's role with id ${userId} has been updated to the role ${roleId}`;
    } catch (err) {
      if (err.status === 404) throw err;

      throw new HttpException(
        'There was an error updating role of the user with id: ' + userId,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: number): Promise<string> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('No user exists with id: ' + id);
      }
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
}
