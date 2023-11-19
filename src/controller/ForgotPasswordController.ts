import { Request, Response } from 'express';
import { User } from '../entity/User';
import { ResetToken } from '../entity/ResetToken';
import { MongoDBDataSource } from '../config/database';
import { Repository } from 'typeorm';
import {
  createResetTokenDBObject,
  generateTokenAndHash
} from '../utils/recovery';
import { sendEmail } from '../utils/email';
import { composeResetEmailContent } from '../utils/emailTemplates/resetPasswordEmailContent';

export class ForgotPasswordController {
  /**
   * @swagger
   * /forgot-password:
   *   post:
   *     summary: E-mail de redefinição de senha
   *     tags:
   *       - Forgot Password
   *     description: Envia o e-mail contendo o link com token de autorização de mudança de senha para o usuário correspondente.
   *     consumes:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
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
   *                   example: false
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: Mensagem de erro.
   */
  forgotPassword = async (req: Request, res: Response) => {
    const user: User = req.body.user;
    const { token, hash } = generateTokenAndHash();

    const resetTokenRepository: Repository<ResetToken> =
      MongoDBDataSource.getRepository(ResetToken);

    const resetTokenDBObject: ResetToken = createResetTokenDBObject(
      hash,
      user?._id
    );

    const savedResetToken: ResetToken | null = await resetTokenRepository
      .save(resetTokenDBObject)
      .catch((_err) => {
        return null;
      });

    if (!savedResetToken) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'Não foi possível gerar o token de recuperação de senha.'
        }
      });
    }

    const email: string = user?.email;
    const resetURL: string = `${process.env.FRONTEND_URL}/auth/reset-password/${user?._id}/${token}`;
    const emailContent: string = composeResetEmailContent(resetURL);
    const wasEmailSent: boolean = await sendEmail(email, emailContent);

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
