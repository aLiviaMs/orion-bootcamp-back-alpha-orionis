import { Request, Response } from 'express';
import { MongoDBDataSource } from '../config/database';
import { UserRepository } from '../utils/user';
import { UpdateResult } from 'typeorm';
import { User } from '../entity/User';

export class NewsletterController {
  /**
   * @swagger
   * /newsletter:
   *   post:
   *     summary: Newsletter
   *     tags: [Newsletter]
   *     description: Inscreve o usuário na Newsletter
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
   *            required:
   *              - email
   *            properties:
   *              email:
   *                type: string
   *                format: email
   *                description: Email do usuário cadastrado.
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
   *                   description: 'Status da requisição. `true` indica que a requisição foi bem sucedida.'
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: 'Mensagem de sucesso.'
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
   *                   description: 'Status da requisição. `false` indica que a requisição falhou.'
   *                   example: false
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: 'Mensagem de erro.'
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
   *                   description: 'Status da requisição. `false` indica que a requisição falhou.'
   *                   example: false
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: 'Mensagem de erro.'
   *                       example: "Falha no banco de dados ao se inscrever na Newsletter."
   */
  subscribe = async (req: Request, res: Response): Promise<Response> => {
    const user: User = req.body.user;
    const errorMessage: string =
      'Ocorreu um erro ao cadastrar a newsletter! Tente mais tarde.';

    const subscribedUser: User = {
      ...user,
      isSubscribed: true
    };

    const UserRepository = MongoDBDataSource.getRepository(User);
    const savedSubscribedUser: UpdateResult | null =
      await UserRepository.update(user._id, subscribedUser).catch(
        (_err) => null
      );

    if (!savedSubscribedUser) {
      return res.status(500).json({
        status: false,
        data: {
          message: errorMessage
        }
      });
    }

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
   *     summary: Cancelar assinatura da Newsletter
   *     description: Cancela a assinatura do usuário da Newsletter a partir de um token enviado via email
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
   *                   description: Status da requisição. `true` indica que a requisição foi bem sucedida.
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: Mensagem de sucesso.
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
   *                   description: Status da requisição. `false` indica que a requisição falhou.
   *                   example: false
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: Mensagem de erro.
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
   *                   description: Status da requisição. `false` indica que a requisição falhou.
   *                   example: false
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: Mensagem de erro.
   *                       example: "Falha no banco de dados ao cancelar a assinatura."
   */
  unsubscribe = async (req: Request, res: Response): Promise<Response> => {
    const user: User = req.body.user;
    const errorMessage: string = 'Ocorreu um erro ao cancelar a newsletter!';

    const unsubscribedUser: User = {
      ...user,
      isSubscribed: false
    };

    const savedUnsubscribedUser: UpdateResult | null =
      await UserRepository.update(user._id, unsubscribedUser).catch(
        (_err) => null
      );

    if (!savedUnsubscribedUser) {
      return res.status(500).json({
        status: false,
        data: {
          message: errorMessage
        }
      });
    }

    return res.status(200).json({
      status: true,
      data: {
        message: 'Assinatura de newsletter cancelada.'
      }
    });
  };
}
