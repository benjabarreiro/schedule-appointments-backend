import { Body, Controller, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/auth/dtos';
import { updateUserSchema } from 'src/auth/schemas';
import { UserPipe } from 'src/auth/pipes';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/:id')
  async updateUser(
    @Body(new UserPipe(updateUserSchema)) body: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateUser(body, Number(id));
  }
}
