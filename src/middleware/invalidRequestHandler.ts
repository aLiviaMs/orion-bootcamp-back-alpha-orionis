import { Request, Response, NextFunction } from 'express';
import { ExpressError } from '../types/Error';

/**
 * Middleware para tratamento de requisição inválida
 * @param error O erro gerado pelo express em caso de requisição inválida
 * @param _req A requisição
 * @param res A resposta da requisição
 * @param next O próximo middleware a ser executado
 * @returns Uma resposta com erro ou executa o próximo middleware
 */
export const invalidRequestHandler = (
  error: ExpressError,
  _req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (error instanceof SyntaxError) {
    const isJSONParseError: boolean =
      error.status === 400 &&
      'body' in error &&
      error.type === 'entity.parse.failed';

    if (isJSONParseError) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'Um JSON inválido foi enviado na requisição.'
        }
      });
    }

    return res.status(400).json({
      status: false,
      data: {
        message:
          'Um erro de sintaxe inválida ocorreu durante o processamento da requisição.'
      }
    });
  }

  if (error) {
    return res.status(error.status).json({
      status: false,
      data: {
        message: `Um erro desconhecido ocorreu durante o processamento da requisição: ${error.message}`
      }
    });
  }

  next();
};
