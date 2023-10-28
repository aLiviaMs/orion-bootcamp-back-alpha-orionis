import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1698184197411 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = queryRunner.manager.create('User', {
      email: 'explorador-orion@proton.me',
      password: '$2a$12$ANoifDVbjR4X2S0cVVPREO9heDFT43AAbv8g4dIXYl945VeWoOUty'
    });
    await queryRunner.manager.save('User', user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('User', {
      email: 'explorador-orion@proton.me'
    });
  }
}
