import { Request, Response } from 'express';
import { User } from '../entity/User';
import { ResetToken } from '../entity/ResetToken';
import { MongoDBDataSource } from '../config/database';
import { Repository } from 'typeorm';
import {
  createResetTokenDBObject,
  generateResetTokenAndHash,
  sendEmail
} from '../utils/recovery';

export class ForgotPasswordController {
  /**
   * @swagger
   * /forgot-password:
   *   post:
   *     summary: E-mail de redefinição de senha
   *     description: Envia o e-mail contendo o link com token de autorização de mudança de senha para o usuário correspondente.
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: forgotPasswordRequest
   *         description: Objeto JSON contendo o endereço de e-mail do usuário.
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *           example:
   *             email: "email@domain.com"
   *     responses:
   *       200:
   *         description: E-mail de redefinição de senha enviado com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   description: Status da requisição
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: Mensagem de sucesso.
   *       400:
   *         description: Requisição inválida ou usuário não encontrado.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   description: Status da requisição
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: Mensagem de erro.
   */
  forgotPassword = async (req: Request, res: Response) => {
    const user: User = req.body.user;
    const { resetToken, resetHash } = generateResetTokenAndHash();

    const resetTokenRepository: Repository<ResetToken> =
      MongoDBDataSource.getRepository(ResetToken);

    const resetTokenDBObject: ResetToken = createResetTokenDBObject(
      resetHash,
      user._id
    );

    const savedResetToken: ResetToken | null = await resetTokenRepository
      .save(resetTokenDBObject)
      .catch((_err) => null);

    if (!savedResetToken) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'Não foi possível gerar o token de recuperação de senha.'
        }
      });
    }

    const email: string = user.email;
    const wasEmailSent: boolean = await sendEmail(email, resetToken, user._id);

    if (!wasEmailSent) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'Não foi possível enviar o email de recuperação de senha.'
        }
      });
    }

    return res.status(200).json({
      status: true,
      data: {
        message: 'Email de recuperação de senha enviado com sucesso.'
      }
    });
  };
}
