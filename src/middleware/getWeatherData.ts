import { Request, Response, NextFunction } from 'express';
import { getWeather } from '../utils/getWeather';
import { SolData } from '../types/ApiResponse';

/**
 * Asynchronous middleware to fetch Martian weather data.
 * This middleware attempts to fetch Martian weather data using the `getWeather` function.
 * If successful, it passes control to the next middleware.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The callback function to pass control to the next middleware.
 * @returns {Promise<void>} - A promise that resolves when the middleware finishes execution.
 */

export const getWeatherData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<SolData | void> => {
  const url =
    'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json' as string;

  await getWeather(url);

  next();
};
