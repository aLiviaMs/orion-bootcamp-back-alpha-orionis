import { Request, Response, NextFunction } from 'express';
import { validateJWT } from '../utils/auth';

/**
 * Middleware para validação do JWT nas rotas protegidas
 * @param req A requisição contendo authorization no header
 * @param res A resposta da requisição pode ser um erro relacionado ao token ou o próximo middleware
 * @param next Executa o próximo middleware em caso de sucesso
 * @returns O próximo middleware ou a resposta com erro
 */
export const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: false,
      data: {
        message: 'Token não informado.'
      }
    });
  }

  const [, token] = authorization.split(' ');

  const isValidToken = validateJWT(token);

  if (!isValidToken) {
    return res.status(401).json({
      status: false,
      data: {
        message: 'Token inválido'
      }
    });
  }

  next();
};
