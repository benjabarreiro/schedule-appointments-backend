import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1731062305256 implements MigrationInterface {
  name = 'Migrations1731062305256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`plans\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` enum ('employee', 'admin') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`schedules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`employee_id\` int NOT NULL, \`is_active\` TINYINT(1) NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`appointments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateTime\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`userId\` int NULL, \`scheduleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`birth_date\` date NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`profession\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_business_role_profession\` (\`userBusinessRoleId\` int NOT NULL, \`professionId\` int NOT NULL, PRIMARY KEY (\`userBusinessRoleId\`, \`professionId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_business_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NULL, \`business_id\` int NULL, \`role_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`businesses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL, \`plan_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`schedules\` ADD CONSTRAINT \`FK_schedules_user_business_role_employee_id\` FOREIGN KEY (\`employee_id\`) REFERENCES \`user_business_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_appointments_users_user_id\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_appointments_schedules_schedule_id\` FOREIGN KEY (\`scheduleId\`) REFERENCES \`schedules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_business_role_profession\` ADD CONSTRAINT \`FK_user_business_role_profession_user_business_role_id\` FOREIGN KEY (\`userBusinessRoleId\`) REFERENCES \`user_business_role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_business_role_profession\` ADD CONSTRAINT \`FK_user_business_role_profession_profession_id\` FOREIGN KEY (\`professionId\`) REFERENCES \`profession\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_business_role\` ADD CONSTRAINT \`FK_user_business_role_users_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_business_role\` ADD CONSTRAINT \`FK_user_business_role_businesses_business_id\` FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_business_role\` ADD CONSTRAINT \`FK_user_business_role_roles_role_id\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`businesses\` ADD CONSTRAINT \`FK_businesses_plans_plan_id\` FOREIGN KEY (\`plan_id\`) REFERENCES \`plans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`businesses\` DROP FOREIGN KEY \`FK_businesses_plans_plan_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_business_role\` DROP FOREIGN KEY \`FK_user_business_role_roles_role_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_business_role\` DROP FOREIGN KEY \`FK_user_business_role_businesses_business_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_business_role\` DROP FOREIGN KEY \`FK_user_business_role_users_user_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_business_role_profession\` DROP FOREIGN KEY \`FK_user_business_role_profession_profession_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_business_role_profession\` DROP FOREIGN KEY \`FK_user_business_role_profession_user_business_role_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_appointments_schedules_schedule_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_appointments_users_user_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`schedules\` DROP FOREIGN KEY \`FK_schedules_user_business_role_employee_id\``,
    );

    await queryRunner.query(`DROP TABLE \`businesses\``);
    await queryRunner.query(`DROP TABLE \`user_business_role\``);
    await queryRunner.query(`DROP TABLE \`user_business_role_profession\``);
    await queryRunner.query(`DROP TABLE \`profession\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`appointments\``);
    await queryRunner.query(`DROP TABLE \`schedules\``);
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(`DROP TABLE \`plans\``);
  }
}
