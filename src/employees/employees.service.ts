import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Employee } from './entities';

@Injectable()
export class EmployeesService {
  private employeeRepository: Repository<Employee>;
  constructor(private readonly connection: Connection) {
    this.employeeRepository = this.connection.getRepository(Employee);
  }
  async createEmployee(userId): Promise<Employee> {
    const newEmployee = await this.employeeRepository.create({
      user_id: userId,
    });
    return await this.employeeRepository.save(newEmployee)[0];
  }

  async findEmployeeByUserId(userId: number): Promise<Employee> {
    return this.employeeRepository.findOne({ where: { user_id: userId } });
  }
}
