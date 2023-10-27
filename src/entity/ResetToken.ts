import { Column, ObjectId, ObjectIdColumn, Entity } from 'typeorm';

@Entity()
export class ResetToken {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  hash: string;

  @Column()
  createdAt: Date;
}
