import { Column, ObjectId, ObjectIdColumn, Entity } from 'typeorm';

@Entity()
export class UnsubscriptionToken {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  hash: string;
}
