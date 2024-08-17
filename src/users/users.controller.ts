import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/common/dtos';
import { updateUserSchema } from 'src/common/schemas';
import { JoiValidationPipe } from 'src/common/pipes';
import { UsersGuard } from 'src/common/guards/users.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {}

  @Get('/:id')
  async getUser() {}

  @Put('/:id')
  @UseGuards(UsersGuard)
  async updateUser(
    @Body(new JoiValidationPipe<UpdateUserDto>(updateUserSchema))
    body: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<string> {
    return await this.usersService.updateUser(body, Number(id));
  }

  @Delete('/:id')
  @UseGuards(UsersGuard)
  async deleteUser(@Param('id') id: string): Promise<string> {
    const parsedId = parseInt(id);

    return await this.usersService.deleteUser(parsedId);
  }
}
