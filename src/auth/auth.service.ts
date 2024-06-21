import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { Roles, Status } from 'src/enums';
import { UsersService } from 'src/users/users.service';
import { EmailsService } from 'src/emails/email.servicie';
import { generateValidationCode, hashPassword } from './utils';

interface ValidationRecord {
  code: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  private validationRecords: ValidationRecord[] = [];
  private readonly codeExpirationMinutes = 15;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailsService,
  ) {
    this.startCleanupTask();
  }

  async createUser(body: CreateUserDto): Promise<string> {
    const userExist = await this.usersService.findUserByEmail(body.email);
    if (userExist) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hashPassword(body.password);
    const bodyWithHashedPassword = {
      ...body,
      password: hashedPassword,
      role: Number(Roles.Patient),
      status: Status.Pending,
    };

    await this.usersService.createUser(bodyWithHashedPassword);
    return await this.sendValidationCode(body.email);
  }

  async login(body: LoginUserDto): Promise<string> {
    const user = await this.validateUserPassword(body.email, body.password);
    const token = await this.jwtService.sign({
      userName: user.email,
    });
    return token;
  }

  async sendValidationCode(email: string) {
    const code = generateValidationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.codeExpirationMinutes);

    this.validationRecords.push({ code, expiresAt });

    await this.emailService.sendEmail(
      email,
      'Email Validation Code',
      `Your validation code is: ${code}`,
    );

    return 'Validation code sent';
  }

  validateCode(code: string): boolean {
    const now = new Date();
    this.validationRecords = this.validationRecords.filter(
      (record) => record.expiresAt > now,
    );

    const record = this.validationRecords.find(
      (record) => record.code === code,
    );

    if (record && record.expiresAt > now) {
      this.removeRecord(record);
      //update user in DB
      return true;
    }

    return false;
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
    }, 60000); // Run cleanup every minute
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
}
