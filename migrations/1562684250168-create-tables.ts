import { MigrationInterface, QueryRunner } from 'typeorm'

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class createTables1562684250168 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    await queryRunner.query(`
      CREATE TABLE "session"
        (
           "uuid"      VARCHAR PRIMARY KEY NOT NULL,
           "useruuid"  VARCHAR,
           "expiresat" DATETIME NOT NULL,
           "cancelled" BOOLEAN NOT NULL,
           CONSTRAINT "UQ_cf7b17d01e4c0d117900ff6d367" UNIQUE ("useruuid"),
           CONSTRAINT "FK_aeb3b3e1044d22f85a5b705adae" FOREIGN KEY ("useruuid")
           REFERENCES "user" ("uuid") ON DELETE no action ON UPDATE no action
        )
    `)

    await queryRunner.query(`
      CREATE TABLE "user"
        (
           "uuid"               VARCHAR PRIMARY KEY NOT NULL,
           "name"               VARCHAR(50) NOT NULL,
           "mainconnectionuuid" VARCHAR NOT NULL
        )
    `)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('session')
    await queryRunner.dropTable('user')
  }
}
