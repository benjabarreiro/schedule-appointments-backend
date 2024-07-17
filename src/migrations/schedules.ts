import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Schedules1720638684927 implements MigrationInterface {
  name = 'Schedules1720638684927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schedules',
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
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'employee_id',
            type: 'int',
          },
          {
            name: 'business_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'schedules',
      new TableForeignKey({
        columnNames: ['business_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'businesses',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'schedules',
      new TableForeignKey({
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employees',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('schedules');
    const foreignKeyBusiness = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('business_id') !== -1,
    );
    const foreignKeyEmployee = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('employee_id') !== -1,
    );

    if (foreignKeyBusiness) {
      await queryRunner.dropForeignKey('schedules', foreignKeyBusiness);
    }

    if (foreignKeyEmployee) {
      await queryRunner.dropForeignKey('schedules', foreignKeyEmployee);
    }

    await queryRunner.dropTable('schedules');
  }
}
