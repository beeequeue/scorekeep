import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTestSchema1573325133012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    await queryRunner.createSchema('scorekeep-tests', true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropSchema('scorekeep-tests', true)
  }
}
