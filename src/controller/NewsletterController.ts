import { Request, Response } from 'express';

export class NewsletterController {
  /**
   * @swagger
   * /newsletter:
   *   post:
   *     summary: Newsletter
   *     tags: [Newsletter]
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              email:
   *                type: string
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
   *                       example: "E-mail inscrito na Newsletter!"
   *       '400':
   *         description: 'Requisição inválida'
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Formato de email inválido."
   *       '500':
   *         description: Falha no banco de dados
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Falha no banco de dados ao se inscrever na Newsletter."
   */
  subscribe = (req: Request, res: Response): Response => {
    const email: string = req.body.email;
    const errorMessage: string = 'Ocorreu um erro ao cadastrar a newsletter!';

    return res.status(200).json({
      status: true,
      data: {
        message: 'E-mail inscrito na Newsletter!'
      }
    });
  };

  /**
   * @swagger
   * /newsletter/unsubscribe/{token}:
   *   get:
   *     tags: [Newsletter]
   *     summary: Cancelar assinatura da newsletter
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         description: Token de autenticação para cancelar a assinatura
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Requisição executada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Assinatura de newsletter cancelada."
   *       '400':
   *         description: Requisição inválida
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Erro ao cancelar a assinatura da newsletter."
   *       '500':
   *         description: Falha no banco de dados
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Falha no banco de dados ao cancelar a assinatura."
   */
  unsubscribe = (req: Request, res: Response): Response => {
    const token: string = req.params.token;
    const errorMessage: string = 'Ocorreu um erro ao cancelar a newsletter!';

    return res.status(200).json({
      status: true,
      data: {
        message: 'Assinatura de newsletter cancelada.'
      }
    });
  };
}
