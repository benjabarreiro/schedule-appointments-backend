import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/auth/dtos';
import { updateUserSchema } from 'src/auth/schemas';
import { UserPipe } from 'src/auth/pipes';
import { UsersGuard } from 'src/guards/users.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/:id')
  @UseGuards(UsersGuard)
  async updateUser(
    @Body(new UserPipe(updateUserSchema)) body: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateUser(body, Number(id));
  }

  @Delete('/:id')
  @UseGuards(UsersGuard)
  async deleteUser(@Param('id') id: string) {
    const parsedId = parseInt(id);

    return await this.usersService.deleteUser(parsedId);
  }
}
