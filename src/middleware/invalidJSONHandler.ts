import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para tratamento de JSON inválido
 * @param error O erro gerado pelo express em caso de JSON inválido gerando erro de sintaxe
 * @param _req A requisição
 * @param res A resposta da requisição
 * @param next O próximo middleware a ser executado
 * @returns Uma resposta com erro ou executa o próximo middleware
 */
export const invalidJSONHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (error instanceof SyntaxError) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Um JSON inválido foi enviado na requisição.'
      }
    });
  }

  next();
};
