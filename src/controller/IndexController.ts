import { Request, Response } from 'express';

export class IndexController {
  /**
   * @swagger
   * /:
   *   get:
   *     summary: Informações da API
   *     tags: [Index]
   *     responses:
   *       301:
   *         description: 'Redirecionamento para a documentação da API'
   */
  info = (_req: Request, res: Response) => {
    return res.status(301).redirect('/swagger.json');
  };
}
