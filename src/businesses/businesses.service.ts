import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Business } from './business.entity';
import { Connection, Repository } from 'typeorm';
import { RolesIds } from 'src/common/enums';
import { UsersService } from 'src/users/users.service';
import { EmployeeBusiness } from 'src/users/entities';
import { BusinessDto, CreateBusinessDto } from './dtos';
import { parseToCamelCase } from 'src/common/utils/parsers';

@Injectable()
export class BusinessesService {
  private businessesRepository: Repository<Business>;
  private employeeBusinessRepository: Repository<EmployeeBusiness>;
  constructor(
    private readonly connection: Connection,
    private readonly usersService: UsersService,
  ) {
    this.businessesRepository = this.connection.getRepository(Business);
    this.employeeBusinessRepository =
      this.connection.getRepository(EmployeeBusiness);
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
      //primero buscamos si existe el employee
      let employee = await this.usersService.findEmployeeByUserId(userId);
      let user;

      //si no existe employee
      if (!employee) {
        //validamos que el user con userId exista
        user = await this.usersService.findUserById(userId);
        //creamos el employee
        employee = await this.usersService.createEmployee(user.id);
      }

      //buscamos el business
      //TO DO: Hay que validar que el usuario logueadso sea de la empresa
      const business = await this.businessesRepository.findOne({
        where: { id: businessId },
      });

      if (!business) {
        throw new HttpException(
          `Business with id ${businessId} does not exits on the DB`,
          HttpStatus.NOT_FOUND,
        );
      }

      //generamos relacion employee - empresa
      const userBusiness = new EmployeeBusiness();
      userBusiness.employee_id = employee.id;
      userBusiness.business_id = businessId;
      await this.employeeBusinessRepository.save(userBusiness);

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
