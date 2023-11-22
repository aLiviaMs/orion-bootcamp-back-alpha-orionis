import { Request, Response } from 'express';

export class IndexController {
  /**
   * @swagger
   * /:
   *   get:
   *     summary: Informações da API
   *     tags: [Index]
   *     responses:
   *       200:
   *         description: 'Informações da API em formato JSON seguindo o modelo da OpenAPI.'
   */
  info = (_req: Request, res: Response) => {
    return res.status(301).redirect('/swagger.json');
  };
}
