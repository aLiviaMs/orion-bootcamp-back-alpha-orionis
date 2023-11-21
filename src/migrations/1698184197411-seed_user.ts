import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1698184197411 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = queryRunner.manager.create('User', {
      email: 'email@domain.com',
      password: '$2b$12$un44BpeTTyJQKrhf9K3xpuCKtyjvGQx2Aogt2QNkf0LZPgg3M9wdm',
      isSubscribed: false,
      isVerifed: true
    });
    await queryRunner.manager.save('User', user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('User', { email: 'email@domain.com' });
  }
}
