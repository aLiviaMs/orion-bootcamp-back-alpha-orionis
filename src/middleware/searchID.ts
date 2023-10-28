import { Request, Response, NextFunction } from 'express';
import { ObjectId, Repository } from 'typeorm';
import { User } from '../entity/User';
import { MongoDBDataSource } from '../config/database';
import { convertToObjectID } from '../utils/recovery';

/**
 * Middleware responsável por buscar um usuário pelo ID.
 * @param req Requisição contendo o ID do usuário.
 * @param res No formato de JSON contendo a mensagem de erro
 * @param next Executa a próxima função.
 * @returns Mensagem de erro ou executa a próxima função.
 */
export const searchID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: string = req.params.id ?? req.body?.id?.trim();

  if (!id) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'ID de usuário não informado.'
      }
    });
  }

  const userID: ObjectId = convertToObjectID(id);

  const UserRepository: Repository<User> =
    MongoDBDataSource.getRepository(User);

  const user: User = await UserRepository.findOne({ where: { _id: userID } });

  if (!user?._id) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'ID de usuário inválido.'
      }
    });
  }

  req.body.user ??= user;

  next();
};
