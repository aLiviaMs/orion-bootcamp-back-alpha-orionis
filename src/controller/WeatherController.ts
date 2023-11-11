import { Request, Response } from 'express';
import { SolData } from '../types/ApiResponse';
import { formatWeatherData } from '../utils/weather';
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
   *              schema:
   *               type: object
   *               properties:
   *                 weatherCards:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/WeatherCard'
   *       400:
   *         description: Erro ao receber os dados da API da NASA.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: 'Erro ao receber os dados da API da NASA'
   *       401:
   *         description: Erro ao autenticar o usuário.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: 'Token inválido.'
   */
  getWeatherData = async (req: Request, res: Response): Promise<Response> => {
    if (!req.weatherData) {
      return res.status(400).json({
        status: false,
        message: 'Erro ao receber os dados da API'
      });
    }
    const data: SolData = req.weatherData;

    const formattedData: WeatherData = await formatWeatherData(data);

    return res
      .status(200)
      .header('Cache-Control', 'public, max-age=86400') // 24 horas
      .json({
        status: true,
        data: formattedData
      });
  };
}
