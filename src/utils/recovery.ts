import crypto from 'crypto';
import { ObjectId, Repository } from 'typeorm';
import { ResetToken } from '../entity/ResetToken';
import { MongoDBDataSource } from '../config/database';
import { ObjectId as MongoID } from 'mongodb';

/**
 * Gera um token de 128 bits e o hash do token.
 * @returns O token e o hash do token.
 */
export const generateTokenAndHash = (): {
  token: string;
  hash: string;
} => {
  const token: string = crypto.randomBytes(16).toString('hex');
  const hash: string = hashToken(token);

  return { token, hash };
};

/**
 * Gera o hash de um token de recuperação de senha.
 * @param token O token de recuperação de senha.
 * @returns O hash do token de recuperação de senha.
 */
export const hashToken = (token: string): string => {
  const hash: string = crypto.createHash('sha256').update(token).digest('hex');

  return hash;
};

/**
 * Cria o objeto de token de recuperação de senha.
 * @param resetHash O hash do token de recuperação de senha.
 * @param userID O ID do usuário.
 * @returns O objeto de token de recuperação de senha.
 */
export const createResetTokenDBObject = (
  resetHash: string,
  userID: ObjectId
): ResetToken => {
  const resetTokenDBObject: ResetToken = new ResetToken();
  resetTokenDBObject.hash = resetHash;
  resetTokenDBObject._id = userID;
  resetTokenDBObject.createdAt = new Date();

  return resetTokenDBObject;
};

/**
 * Procura o token de recuperação de senha no banco de dados.
 * @param userID O ID do usuário.
 * @returns O token de recuperação de senha obtido do banco de dados.
 */
export const findResetTokenByID = async (
  userID: ObjectId
): Promise<ResetToken | null> => {
  const resetTokenRepository: Repository<ResetToken> =
    MongoDBDataSource.getRepository(ResetToken);
  const resetTokenDB: ResetToken = await resetTokenRepository.findOne({
    where: { _id: userID }
  });

  return resetTokenDB;
};

/**
 * Converte uma string para um ID do MongoDB.
 * @param id A string a ser convertida.
 * @returns O ID do MongoDB ou null se a string não for válida.
 */
export const convertToObjectID = (id: string): ObjectId => {
  try {
    const userID: ObjectId = new MongoID(id);
    return userID;
  } catch (_err) {
    return null;
  }
};

/**
 * Retorna a data e hora de expiração do token de recuperação de senha.
 * @param numberOfHours É o número de horas após as quais o token de recuperação de senha expira.
 * @param createdAt É a data e hora de criação do token de recuperação de senha.
 * @returns A data e hora de expiração do token de recuperação de senha.
 */
export const getExpirationDate = (
  numberOfHours: number,
  createdAt: Date
): Date => {
  const expirationDate: Date = new Date(createdAt);
  const HoursToMilliseconds: number = numberOfHours * 60 * 60 * 1000;
  expirationDate.setTime(expirationDate.getTime() + HoursToMilliseconds);

  return expirationDate;
};

/**
 * Verifica se o token de recuperação de senha expirou.
 * @param resetTokenDB O token de recuperação de senha obtido do banco de dados.
 * @returns Se o token de recuperação de senha expirou ou não.
 */
export const isTokenExpired = (resetTokenDB: ResetToken): boolean => {
  const expirationDate: Date = getExpirationDate(1, resetTokenDB.createdAt);
  const utcNow: Date = new Date();
  const isTokenExpired: boolean = utcNow.getTime() > expirationDate.getTime();

  return isTokenExpired;
};
