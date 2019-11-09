import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSchemas1573325133012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    await queryRunner.createSchema('scorekeep-dev', true)
    await queryRunner.createSchema('scorekeep-tests', true)
    await queryRunner.createSchema('scorekeep-prod', true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropSchema('scorekeep-dev', true)
    await queryRunner.dropSchema('scorekeep-tests', true)
    await queryRunner.dropSchema('scorekeep-prod', true)
  }
}
