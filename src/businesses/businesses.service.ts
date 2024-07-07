import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Business } from './business.entity';
import { Connection, Repository } from 'typeorm';
import { RolesIds } from 'src/common/enums';
import { UsersService } from 'src/users/users.service';
import { UserBusiness } from 'src/users/entities/user-business.entity';
import { BusinessDto, CreateBusinessDto } from './dtos';
import { parseToCamelCase } from 'src/common/utils/parsers';

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

  async findAllBusinesses(): Promise<BusinessDto[]> {
    try {
      const businesses = await this.businessesRepository.find();

      return parseToCamelCase(businesses);
    } catch (err) {
      throw new HttpException(
        'There was an error retriving businesses from DB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBusinessById(id: number): Promise<BusinessDto> {
    try {
      const business = await this.businessesRepository.findOne({
        where: { id },
      });

      return parseToCamelCase(business);
    } catch (err) {
      throw new HttpException(
        'There was an error retrieving business with id ' + id,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBusinessByName(name: string): Promise<BusinessDto> {
    try {
      const business = await this.businessesRepository.findOne({
        where: { name },
      });

      return parseToCamelCase(business);
    } catch (err) {
      throw new HttpException(
        'There was an error retrieving business with name ' + name,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createBusiness(business: CreateBusinessDto): Promise<string> {
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

      return 'Business created succesfully';
    } catch (err) {
      if ([409, 404].some((code) => code === err.status)) throw err;

      throw new HttpException(
        'There was an error creating business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addUserToBusiness(userId: number, businessId: number): Promise<string> {
    try {
      const user = await this.usersService.findUserById(userId);
      const business = await this.businessesRepository.findOne({
        where: { id: businessId },
      });

      if (!user) {
        throw new HttpException(
          `User with id ${userId} does not exits on the DB`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!business) {
        throw new HttpException(
          `Business with id ${businessId} does not exits on the DB`,
          HttpStatus.NOT_FOUND,
        );
      }

      const userBusiness = new UserBusiness();
      userBusiness.user_id = userId;
      userBusiness.business_id = businessId;
      await this.userBusinessRepository.save(userBusiness);

      return `Succesfully added ${user.firstName} ${user.lastName} to ${business.name}`;
    } catch (err) {
      if (err === 404 || err === 500) throw err;
      throw new HttpException(
        `There was an error adding user with id ${userId} to business with id ${businessId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
