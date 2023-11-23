import { User } from '../entity/User';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUserAddIsverified1700750461895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager.findOne(User, {
      where: { email: 'email@domain.com' }
    });

    if (user) {
      user.isSubscribed = false;
      user.isVerified = true;

      await queryRunner.manager.save(User, user);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager.findOne(User, {
      where: { email: 'email@domain.com' }
    });
    if (user) {
      user.isSubscribed = undefined;
      user.isVerified = undefined;
      await queryRunner.manager.save(User, user);
    }
  }
}
