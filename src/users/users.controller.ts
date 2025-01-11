import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/common/dtos';
import { updateUserSchema } from 'src/common/schemas';
import { JoiValidationPipe } from 'src/common/pipes';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {}

  @Get('/:id')
  async getUser(@Param('id') id) {
    try {
      return await this.usersService.findUserById(Number(id));
    } catch (err) {
      throw err;
    }
  }

  @Put('/:id')
  async updateUser(
    @Body(new JoiValidationPipe<UpdateUserDto>(updateUserSchema))
    body: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<string> {
    return await this.usersService.updateUser(body, Number(id));
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<string> {
    const parsedId = parseInt(id);

    return await this.usersService.deleteUser(parsedId);
  }
}
