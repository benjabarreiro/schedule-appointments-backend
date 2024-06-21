import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dtos';
import * as path from 'path';
import { JwtService } from '@nestjs/jwt';
import { hashSync, compareSync } from 'bcrypt';
import { Roles, Status } from 'src/enums';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly filePath = path.join(__dirname, '..', 'users.json');
  private readonly filePathSrc = path.join(
    __dirname,
    '../../src',
    'users.json',
  );

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async createUser(body: CreateUserDto): Promise<string> {
    const userExist = await this.usersService.findUserByEmail(body.email);
    if (userExist) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.hashPassword(body.password);
    const bodyWithHashedPassword = {
      ...body,
      password: hashedPassword,
      role: Number(Roles.Patient),
      status: Status.Pending,
    };

    await this.usersService.createUser(bodyWithHashedPassword);
    return 'User created!';
  }

  async login(body: LoginUserDto): Promise<string> {
    const user = await this.validateUserPassword(body.email, body.password);
    const token = await this.generateToken({
      userName: user.email,
    });
    return token;
  }

  async validateUserPassword(email: string, password: string) {
    const userExist = await this.usersService.findUserByEmail(email);

    if (!userExist) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (!compareSync(password, userExist.password)) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return userExist;
  }

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = hashSync(password, 10);
    return hashedPassword;
  }
}
