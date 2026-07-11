import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTripMemberRole1749260000000 implements MigrationInterface {
  name = 'AddTripMemberRole1749260000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."trip_members_role_enum" AS ENUM('OWNER', 'EDITOR', 'VIEWER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_members" ADD "role" "public"."trip_members_role_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "trip_members" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."trip_members_role_enum"`);
  }
}
