import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService as JwtNestService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: JwtNestService) {}

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

  async verifyToken(token) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      throw new HttpException(
        'There was an error verifying the token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
