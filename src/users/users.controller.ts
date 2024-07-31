import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/common/dtos';
import { updateUserSchema } from 'src/common/schemas';
import { JoiValidationPie } from 'src/common/pipes';
import { UsersGuard } from 'src/common/guards/users.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/:id')
  @UseGuards(UsersGuard)
  async updateUser(
    @Body(new JoiValidationPie<UpdateUserDto>(updateUserSchema))
    body: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<string> {
    if (body && !Object.keys(body).length)
      throw new HttpException('Body cannot be empty', HttpStatus.BAD_REQUEST);
    return await this.usersService.updateUser(body, Number(id));
  }

  @Delete('/:id')
  @UseGuards(UsersGuard)
  async deleteUser(@Param('id') id: string): Promise<string> {
    const parsedId = parseInt(id);

    return await this.usersService.deleteUser(parsedId);
  }
}
