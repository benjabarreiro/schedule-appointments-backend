import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UserDto } from './dtos';
import { promises as fs } from 'fs';
import * as path from 'path';
import { JwtService } from '@nestjs/jwt';
import { hashSync, compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly filePath = path.join(__dirname, '..', 'users.json');
  private readonly filePathSrc = path.join(
    __dirname,
    '../../src',
    'users.json',
  );

  constructor(private readonly jwtService: JwtService) {}

  async createUser(body: CreateUserDto): Promise<string> {
    const usersData = await this.readJsonFile();
    if (!this.validateExistingUser(body.userName, usersData)) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.hashPassword(body.password);
    const updateUsersData = [
      ...usersData,
      { ...body, password: hashedPassword },
    ];

    await this.writeJsonFile(updateUsersData);
    return 'User created!';
  }

  async login(body: LoginUserDto): Promise<string> {
    const user = await this.validateUserPassword(body.userName, body.password);
    const token = await this.generateToken({
      userName: user.userName,
    });
    return token;
  }

  async readJsonFile(): Promise<CreateUserDto[] | []> {
    const data = await fs.readFile(this.filePath, 'utf8');
    return JSON.parse(data);
  }

  async writeJsonFile(data: UserDto[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    await fs.writeFile(this.filePathSrc, JSON.stringify(data, null, 2), 'utf8');
  }

  validateExistingUser(userName: string, usersData: UserDto[]): boolean {
    return !usersData.some((users) => users.userName === userName);
  }

  async validateUserPassword(userName: string, password: string) {
    const usersData = await this.readJsonFile();
    const user = usersData.find((user) => user.userName === userName);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (!compareSync(password, user.password)) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = hashSync(password, 10);
    return hashedPassword;
  }
}
