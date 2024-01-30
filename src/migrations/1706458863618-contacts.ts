import { MigrationInterface, QueryRunner } from "typeorm";

export class Contacts1706458863618 implements MigrationInterface {
    name = 'Contacts1706458863618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile_image" ("id" SERIAL NOT NULL, "profile_image" bytea NOT NULL, CONSTRAINT "PK_4a0c83016e1f1dc03ea2fcab948" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "line1" character varying(200) NOT NULL, "line2" character varying(200), "city" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "company" character varying(150), "email" character varying(200), "birthdate" date, "profileImageId" integer, "addressId" integer, CONSTRAINT "REL_900831adf9a2b8cdddef5c8a55" UNIQUE ("profileImageId"), CONSTRAINT "REL_d7748995636532d90c30dbd760" UNIQUE ("addressId"), CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."phone_type_enum" AS ENUM('work', 'personal')`);
        await queryRunner.query(`CREATE TABLE "phone" ("id" SERIAL NOT NULL, "type" "public"."phone_type_enum" NOT NULL, "phone" character varying(20) NOT NULL, "contactId" integer, CONSTRAINT "PK_f35e6ee6c1232ce6462505c2b25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_900831adf9a2b8cdddef5c8a55d" FOREIGN KEY ("profileImageId") REFERENCES "profile_image"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_d7748995636532d90c30dbd7603" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "phone" ADD CONSTRAINT "FK_0d49fa96cb9d5cc46b9598f3489" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phone" DROP CONSTRAINT "FK_0d49fa96cb9d5cc46b9598f3489"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_d7748995636532d90c30dbd7603"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_900831adf9a2b8cdddef5c8a55d"`);
        await queryRunner.query(`DROP TABLE "phone"`);
        await queryRunner.query(`DROP TYPE "public"."phone_type_enum"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "profile_image"`);
    }

}
