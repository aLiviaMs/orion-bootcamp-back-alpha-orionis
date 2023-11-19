import { Request, Response, NextFunction } from 'express';
import { findUserByUnsubToken } from '../utils/subscription';
import { User } from '../entity/User';

/**
 * Verifica se o token de cancelamento de assinatura da Newsletter é válido
 * @param req A requisição precisa ter um parâmetro do tipo path correspondente ao token
 * @param res A Response traz mensagens de erro específicas de grau informativo
 * @param next É chamado o próximo middleware em caso de sucesso
 * @returns O usuário obtido a partir do token via req ou uma mensagem de erro
 */
export const verifyUnsubToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const unsubToken: string = req.params?.token ?? (req.body?.token as string);

  if (!unsubToken) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Token não informado.'
      }
    });
  }

  const user: User | null = await findUserByUnsubToken(unsubToken);

  if (!user?._id) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Token inválido.'
      }
    });
  }

  req.body.user = user;

  next();
};
