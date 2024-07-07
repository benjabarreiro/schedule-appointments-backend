import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Businesses implements MigrationInterface {
  name = 'Business1720299844682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'businesses',
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
            name: 'admin_id',
            type: 'int',
          },
          {
            name: 'plan_id',
            type: 'int',
          },
          {
            name: 'is_active',
            type: 'boolean',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'businesses',
      new TableForeignKey({
        columnNames: ['admin_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'businesses',
      new TableForeignKey({
        columnNames: ['plan_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'plans',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('businesses');
    const foreignKeyPlan = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('plan_id') !== -1,
    );
    const foreignKeyUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('admin_id') !== -1,
    );

    if (foreignKeyPlan) {
      await queryRunner.dropForeignKey('businesses', foreignKeyPlan);
    }

    if (foreignKeyUser) {
      await queryRunner.dropForeignKey('businesses', foreignKeyUser);
    }

    await queryRunner.dropTable('businesses');
  }
}
