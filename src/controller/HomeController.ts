import { Request, Response } from 'express';

export class HomeController {
  /**
   * @swagger
   * /:
   *   get:
   *     summary: Informações da API
   *     tags: [Home]
   *     responses:
   *       '200':
   *         description: 'requisição executada com sucesso'
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   description: 'objeto json de retorno'
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Acesse a documentação da API em /swagger.json"
   */
  info = (_req: Request, res: Response) => {
    return res.status(200).json({
      status: true,
      data: {
        message: 'Acesse a documentação da API em /swagger.json'
      }
    });
  };
}
