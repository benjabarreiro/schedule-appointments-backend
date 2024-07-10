import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class EmployeeBusiness implements MigrationInterface {
  name = 'EmployeeBusiness1720542486463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'employee_business',
        columns: [
          {
            name: 'employee_id',
            type: 'int',
            isPrimary: true,
          },
          { name: 'business_id', type: 'int', isPrimary: true },
        ],
      }),
    );

    await queryRunner.createForeignKeys('employee_business', [
      new TableForeignKey({
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employees',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['business_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'businesses',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('employee_business');
    const foreignKeys = table.foreignKeys.filter(
      (fk) =>
        fk.columnNames.indexOf('employee_id') !== -1 ||
        fk.columnNames.indexOf('business_id') !== -1,
    );
    await queryRunner.dropForeignKeys('employee_business', foreignKeys);
    await queryRunner.dropTable('employee_business');
  }
}
