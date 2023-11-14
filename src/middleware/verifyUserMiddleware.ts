import { Request, Response, NextFunction } from 'express';
import { UserRepository, checkIfUserIsVerified } from '../utils/user';
import { User } from '../entity/User';

/**
 * Middleware para verificar o status do usuário no banco de dados.
 * @param req A requisição contendo authorization no header.
 * @param res A resposta da requisição pode ser um erro relacionado ao token ou o próximo middleware.
 * @param next Executa o próximo middleware em caso de sucesso.
 * @returns O próximo middleware ou a resposta com erro.
 */
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const user: User = req.body;

  const isVerified: boolean = await checkIfUserIsVerified(
    user.email,
    UserRepository
  );

  if (isVerified) {
    next();
  } else {
    return res
      .status(403)
      .json({ status: false, message: 'Usuário não verificado' });
  }
};
