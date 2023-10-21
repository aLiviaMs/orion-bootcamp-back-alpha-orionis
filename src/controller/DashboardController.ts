import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../types/User';

export class DashboardController {
  /**
   * @swagger
   * /dashboard:
   *   get:
   *     summary: Dashboard
   *     tags: [Dashboard]
   *     security:
   *       - BearerAuth: []
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     responses:
   *       '200':
   *         description: 'Requisição executada com sucesso'
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Olá, Mundo!"
   *       '400':
   *         description: 'Requisição inválida'
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Erro ao obter dados do usuário a partir do token."
   */
  public greet(req: Request, res: Response): Response {
    try {
      const [, token] = req.headers.authorization?.split(' ');
      const user = jwt.verify(token, process.env.JWT_SECRET) as User;
      const { email } = user;

      return res.status(200).json({
        status: true,
        data: {
          message: `Olá, ${email}!`
        }
      });
    } catch (_err) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'Erro ao obter dados do usuário a partir do token.'
        }
      });
    }
  }
}
