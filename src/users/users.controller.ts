import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/common/dtos';
import { updateUserSchema } from 'src/common/schemas';
import { UserPipe } from 'src/common/pipes';
import { UsersGuard } from 'src/common/guards/users.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/:id')
  @UseGuards(UsersGuard)
  async updateUser(
    @Body(new UserPipe(updateUserSchema)) body: UpdateUserDto,
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
