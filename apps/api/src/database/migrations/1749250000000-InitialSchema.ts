import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1749250000000 implements MigrationInterface {
  name = 'InitialSchema1749250000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(
      `CREATE TYPE "public"."trips_status_enum" AS ENUM('planning', 'active', 'closed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."trips_base_currency_enum" AS ENUM('BRL', 'ARS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."expenses_currency_enum" AS ENUM('BRL', 'ARS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."expenses_category_enum" AS ENUM('comida', 'hospedagem', 'transporte', 'passeios', 'compras', 'outros')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."category_budgets_category_enum" AS ENUM('comida', 'hospedagem', 'transporte', 'passeios', 'compras', 'outros')`,
    );

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "trips" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "initials" character varying(4) NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "status" "public"."trips_status_enum" NOT NULL DEFAULT 'planning',
        "base_currency" "public"."trips_base_currency_enum" NOT NULL DEFAULT 'BRL',
        "total_budget" numeric(12,2),
        "owner_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_trips_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_trips_owner" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "trip_members" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "trip_id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "initials" character varying(4) NOT NULL,
        "user_id" uuid,
        CONSTRAINT "PK_trip_members_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_trip_members_trip" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_trip_members_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "expenses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "trip_id" uuid NOT NULL,
        "description" character varying NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "currency" "public"."expenses_currency_enum" NOT NULL,
        "date" date NOT NULL,
        "category" "public"."expenses_category_enum" NOT NULL,
        "payer_id" uuid NOT NULL,
        "receipt_url" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_expenses_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_expenses_trip" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_expenses_payer" FOREIGN KEY ("payer_id") REFERENCES "trip_members"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "expense_splits" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "expense_id" uuid NOT NULL,
        "member_id" uuid NOT NULL,
        "share" numeric(12,2) NOT NULL,
        CONSTRAINT "PK_expense_splits_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_expense_splits_expense" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_expense_splits_member" FOREIGN KEY ("member_id") REFERENCES "trip_members"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "category_budgets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "trip_id" uuid NOT NULL,
        "category" "public"."category_budgets_category_enum" NOT NULL,
        "limit_amount" numeric(12,2) NOT NULL,
        CONSTRAINT "PK_category_budgets_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_category_budgets_trip_category" UNIQUE ("trip_id", "category"),
        CONSTRAINT "FK_category_budgets_trip" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "settlements" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "trip_id" uuid NOT NULL,
        "from_member_id" uuid NOT NULL,
        "to_member_id" uuid NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "settled_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_settlements_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_settlements_trip" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_settlements_from_member" FOREIGN KEY ("from_member_id") REFERENCES "trip_members"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_settlements_to_member" FOREIGN KEY ("to_member_id") REFERENCES "trip_members"("id") ON DELETE CASCADE
      )
    `);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "settlements"`);
    await queryRunner.query(`DROP TABLE "category_budgets"`);
    await queryRunner.query(`DROP TABLE "expense_splits"`);
    await queryRunner.query(`DROP TABLE "expenses"`);
    await queryRunner.query(`DROP TABLE "trip_members"`);
    await queryRunner.query(`DROP TABLE "trips"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."category_budgets_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."expenses_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."expenses_currency_enum"`);
    await queryRunner.query(`DROP TYPE "public"."trips_base_currency_enum"`);
    await queryRunner.query(`DROP TYPE "public"."trips_status_enum"`);
  }
}
