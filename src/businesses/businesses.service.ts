import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Business } from './business.entity';
import { Connection, Repository } from 'typeorm';
import { RolesIds } from 'src/common/enums';
import { BusinessDto, CreateBusinessDto } from './dtos';
import {
  convertKeysToSnakeCase,
  parseToCamelCase,
} from 'src/common/utils/parsers';
import { UpdateBusinessDto } from './dtos/update.dto';
import { UserBusinessRoleService } from 'src/user-business-role/user-business-role.service';

@Injectable()
export class BusinessesService {
  private businessesRepository: Repository<Business>;
  constructor(
    private readonly connection: Connection,
    private readonly userBusinessRoleService: UserBusinessRoleService,
  ) {
    this.businessesRepository = this.connection.getRepository(Business);
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

      if (!business) {
        throw new HttpException(
          'There are no businesses with the id ' + id,
          HttpStatus.NOT_FOUND,
        );
      }

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

  async createBusiness(
    business: CreateBusinessDto,
    userId: number,
  ): Promise<string> {
    try {
      const existingBusiness = await this.findBusinessByName(business.name);
      if (existingBusiness)
        throw new HttpException('Business already exists', HttpStatus.CONFLICT);

      const parsedBody = convertKeysToSnakeCase(business);
      const newBusiness = await this.businessesRepository.create(parsedBody);

      const createdBusiness = await this.businessesRepository.save(newBusiness);
      await this.userBusinessRoleService.createUserBusinessRoleRelation(
        userId,
        createdBusiness['id'],
        RolesIds.admin,
      );

      //we assume plan was purchased
      return 'Business created succesfully';
    } catch (err) {
      if ([409, 404].some((code) => code === err.status)) throw err;

      throw new HttpException(
        'There was an error creating business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBusiness(body: UpdateBusinessDto, businessId): Promise<String> {
    try {
      const business = await this.findBusinessById(businessId);

      const parsedBody = convertKeysToSnakeCase({ ...business, ...body });

      await this.businessesRepository.save(parsedBody);

      return `Business with id ${businessId} updated successfully`;
    } catch (err) {
      if (err.status === 404) throw err;

      throw new HttpException(
        'There was an error updating business with id ' + businessId,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteBusiness(id: number) {
    try {
      await this.businessesRepository.delete(id);
      return `Business with id ${id} was deleted succesfully`;
    } catch (err) {
      throw new HttpException(
        `There was an error deleting business with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
