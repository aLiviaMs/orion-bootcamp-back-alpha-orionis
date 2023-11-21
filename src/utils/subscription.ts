import { ObjectId, Repository } from 'typeorm';
import { MongoDBDataSource } from '../config/database';
import { UserRepository } from './user';
import { UnsubscriptionToken } from '../entity/UnsubscriptionToken';
import { User } from '../entity/User';

/**
 * Instância do repositório de tokens de cancelamento de assinatura de Newsletter para agilizar operações de banco de dados.
 */
export const UnsubTokenRepo: Repository<UnsubscriptionToken> =
  MongoDBDataSource.getMongoRepository(UnsubscriptionToken);

/**
 * Procura um usuário a partir de um Token de cancelamento de Newsletter
 * @param token O token de cancelamento de assinatura
 * @returns O usuário caso o encontre ou null caso contrário
 */
export const findUserByUnsubToken = async (
  token: string
): Promise<User | null> => {
  const hash: string = token;

  const usubTokenDB: UnsubscriptionToken | null = await UnsubTokenRepo.findOne({
    where: { hash }
  }).catch((_err) => null);

  if (!usubTokenDB?._id) {
    return null;
  }

  const userID: ObjectId = usubTokenDB._id;
  const user: User | null = await UserRepository.findOne({
    where: { _id: userID }
  }).catch((_err) => null);

  return user;
};
