import { Roles } from '../enums';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class roles1718187752537 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log(Roles.Patient, process.env.Patient);
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'enum',
            enum: [
              Roles.Patient,
              Roles.Secretary,
              Roles.Doctor,
              Roles.Healthcare,
              Roles.Administrator,
            ],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles');
  }
}
