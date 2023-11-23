import { User } from '../entity/User';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCreateValidEmailUserAddIsverified1700752611734
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager.findOne(User, {
      where: { email: 'explorador-orion@proton.me' }
    });

    if (user) {
      user.isSubscribed = false;
      user.isVerified = true;

      await queryRunner.manager.save(User, user);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager.findOne(User, {
      where: { email: 'explorador-orion@proton.me' }
    });
    if (user) {
      user.isSubscribed = undefined;
      user.isVerified = undefined;
      await queryRunner.manager.save(User, user);
    }
  }
}
