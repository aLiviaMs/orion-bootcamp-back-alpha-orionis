import { Request, Response, NextFunction } from 'express';
import { getWeather } from '../utils/getWeather';
import { SolData } from '../types/ApiResponse';

/**
 * Middleware assíncrono para obter dados meteorológicos de Marte.
 * Este middleware tenta buscar os dados do clima marciano usando a função `getWeather`.
 * Em caso de sucesso, passa o controle para o próximo middleware.
 * Se ocorrer um erro durante a busca, o erro é capturado e passado para o próximo
 * middleware de tratamento de erros.
 *
 * @param {Request} req - O objeto da requisição Express.
 * @param {Response} res - O objeto da resposta Express.
 * @param {NextFunction} next - A função callback para passar o controle para o próximo middleware.
 * @returns {Promise<void>} - Uma promessa que resolve quando o middleware termina a execução.
 */
export const getWeatherData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<SolData | void> => {
  const url =
    'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json' as string;

  try {
    await getWeather(url);

    next();
  } catch (error) {
    next(error);
  }
};
