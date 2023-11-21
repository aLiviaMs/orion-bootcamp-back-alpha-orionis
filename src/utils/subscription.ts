import { ObjectId, Repository } from 'typeorm';
import { MongoDBDataSource } from '../config/database';
import { UserRepository } from './user';
import { UnsubscriptionToken } from '../entity/UnsubscriptionToken';
import { User } from '../entity/User';
import { generateTokenAndHash, hashToken } from './recovery';
import { ObjectId as MongoID } from 'mongodb';

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
  const hash: string = hashToken(token);

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

/**
 * Insere o token de cancelamento no banco de dados, associando ao usuário correspondente
 * @param userID O ID do usuário que estará atrelado ao token de cancelamento
 * @returns O token de cancelamento em caso de sucesso ou null caso contrário
 */
export const insertUnsubToken = async (
  userID: ObjectId
): Promise<string | null> => {
  const isUserIDValid: boolean = MongoID.isValid(userID);

  if (!isUserIDValid) {
    return null;
  }

  const { token, hash } = generateTokenAndHash();
  const unsubTokenRepo: Repository<UnsubscriptionToken> =
    MongoDBDataSource.getMongoRepository(UnsubscriptionToken);

  const unsubTokenDB = new UnsubscriptionToken();
  unsubTokenDB._id = userID;
  unsubTokenDB.hash = hash;

  const savedUnsubToken: UnsubscriptionToken | null = await unsubTokenRepo
    .save(unsubTokenDB)
    .catch((_err) => null);

  if (!savedUnsubToken?._id) {
    return null;
  }

  return token;
};
