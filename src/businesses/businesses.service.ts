import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Business } from './business.entity';
import { Connection, Repository } from 'typeorm';
import { RolesIds } from 'src/common/enums';
import { UsersService } from 'src/users/users.service';
import { UserBusiness } from 'src/users/entities/user-business.entity';

@Injectable()
export class BusinessesService {
  private businessesRepository: Repository<Business>;
  private userBusinessRepository: Repository<UserBusiness>;
  constructor(
    private readonly connection: Connection,
    private readonly usersService: UsersService,
  ) {
    this.businessesRepository = this.connection.getRepository(Business);
    this.userBusinessRepository = this.connection.getRepository(UserBusiness);
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

  async addUserToBusiness(userId, businessId) {
    try {
      const user = await this.usersService.findUserById(userId);
      const business = await this.businessesRepository.findOne(businessId);

      if (user && business) {
        const userBusiness = new UserBusiness();
        userBusiness.user_id = userId;
        userBusiness.business_id = businessId;
        userBusiness.user = user;
        userBusiness.business = business;

        await this.userBusinessRepository.save(userBusiness);
      }
    } catch (err) {}
  }

  async removeUserFromBusiness() {}

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
