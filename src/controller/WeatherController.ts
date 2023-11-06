import { Request, Response } from 'express';
import { WeatherData } from '../types/Weather';

export class WeatherController {
  /**
   * @swagger
   * /weather:
   *   get:
   *     summary: Obtém dados meteorológicos.
   *     description: Retorna informações meteorológicas marcianas atuais.
   *     tags: [Weather]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Dados meteorológicos obtidos e tratados com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/WeatherResponse'
   */
  getWeatherData = (req: Request, res: Response) => {
    const data: WeatherData = req.body.weatherData;

    return res.status(200).json({
      status: true,
      data
    });
  };
}
