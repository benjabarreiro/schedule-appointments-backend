import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class UserBusiness implements MigrationInterface {
  name = 'UserBusiness1720371330206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_business',
        columns: [
          {
            name: 'user_id',
            type: 'int',
            isPrimary: true,
          },
          { name: 'business_id', type: 'int', isPrimary: true },
        ],
      }),
    );

    await queryRunner.createForeignKeys('user_business', [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
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
    const table = await queryRunner.getTable('user_business');
    const foreignKeys = table.foreignKeys.filter(
      (fk) =>
        fk.columnNames.indexOf('user_id') !== -1 ||
        fk.columnNames.indexOf('business_id') !== -1,
    );
    await queryRunner.dropForeignKeys('user_business', foreignKeys);
    await queryRunner.dropTable('user_business');
  }
}
