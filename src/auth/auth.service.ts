import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, ValidateCreateUserDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { Roles, Status } from 'src/enums';
import { UsersService } from 'src/users/users.service';
import { EmailsService } from 'src/emails/email.servicie';
import { generateValidationCode, hashPassword } from './utils';
import { ValidationRecord } from './interfaces';

@Injectable()
export class AuthService {
  private validationRecords: ValidationRecord[] = [];
  private readonly codeExpirationMinutes = 5;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailsService,
  ) {
    this.startCleanupTask();
  }

  async createUser(body: CreateUserDto): Promise<string> {
    try {
      const userExist = await this.usersService.findUserByEmail(body.email);
      if (userExist) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const hashedPassword = await hashPassword(body.password);
      const bodyWithHashedPassword: ValidateCreateUserDto = {
        ...body,
        password: hashedPassword,
        role: Roles.Patient,
        status: Status.Pending,
      };

      return await this.sendValidationCode(bodyWithHashedPassword);
    } catch (err) {
      throw err;
    }
  }

  async login(body: LoginUserDto): Promise<string> {
    try {
      const user = await this.validateUserPassword(body.email, body.password);
      const token = await this.generateToken({ email: user.email });
      return token;
    } catch (err) {
      throw err;
    }
  }

  async sendValidationCode(user: ValidateCreateUserDto) {
    try {
      const code = generateValidationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + this.codeExpirationMinutes);

      this.validationRecords.push({ code, expiresAt, user });

      await this.emailService.sendEmail(
        user.email,
        'Email Validation Code',
        `Your validation code is: ${code}`,
      );

      return 'Validation code sent';
    } catch (err) {
      throw err;
    }
  }

  async validateCode(code: string): Promise<string> {
    const now = new Date();

    const record = this.validationRecords.find(
      (record) => record.code === code,
    );

    if (!record) {
      throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);
    }

    if (record && record.expiresAt < now) {
      throw new HttpException('Expired code', HttpStatus.UNAUTHORIZED);
    }

    try {
      await this.usersService.createUser({
        ...record.user,
        status: Status.Active,
      });
      await this.emailService.sendEmail(
        record.user.email,
        'User created',
        'Your user was created successfully',
      );
      return await this.generateToken({ email: record.user.email });
    } catch (err) {
      throw err;
    } finally {
      this.removeRecord(record);
    }
  }

  private removeRecord(record: ValidationRecord) {
    this.validationRecords = this.validationRecords.filter((r) => r !== record);
  }

  private startCleanupTask() {
    setInterval(() => {
      const now = new Date();
      this.validationRecords = this.validationRecords.filter(
        (record) => record.expiresAt > now,
      );
    }, 60000);
  }

  async validateUserPassword(email: string, password: string) {
    try {
      const userExist = await this.usersService.findUserByEmail(email);

      if (!userExist) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      if (!compareSync(password, userExist.password)) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      return userExist;
    } catch (err) {
      throw err;
    }
  }

  async generateToken(payload: any): Promise<string> {
    try {
      return this.jwtService.sign(payload);
    } catch (err) {
      throw new HttpException(
        'There was an error logging in the user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
