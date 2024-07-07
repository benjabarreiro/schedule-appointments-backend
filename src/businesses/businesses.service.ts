import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Business } from './business.entity';
import { Connection, Repository } from 'typeorm';
import { RolesIds } from 'src/common/enums';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BusinessesService {
  private businessesRepository: Repository<Business>;
  constructor(
    private readonly connection: Connection,
    private readonly usersService: UsersService,
  ) {
    this.businessesRepository = this.connection.getRepository(Business);
  }

  async findAllBusinesses() {
    try {
      return await this.businessesRepository.find();
    } catch (err) {
      throw new HttpException(
        'There was an error retriving businesses from DB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBusinessById(id: number) {
    try {
      return await this.businessesRepository.findOne({ where: { id } });
    } catch (err) {
      throw new HttpException(
        'There was an error retrieving business with id ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBusinessByName(name: string) {
    try {
      return await this.businessesRepository.findOne({ where: { name } });
    } catch (err) {
      throw new HttpException(
        'There was an error retrieving business with name ' + name,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createBusiness(business: Business) {
    try {
      const existingBusiness = await this.findBusinessByName(business.name);
      if (existingBusiness)
        throw new HttpException('Business already exists', HttpStatus.CONFLICT);

      const newBusiness = await this.businessesRepository.create(business);
      const savedUser = await this.businessesRepository.save(newBusiness);

      await this.usersService.updateUserRole(
        RolesIds.admin,
        savedUser.admin_id,
      );

      return savedUser;
    } catch (err) {
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editBusiness() {
    try {
    } catch (err) {
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBusiness() {
    try {
    } catch (err) {
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
