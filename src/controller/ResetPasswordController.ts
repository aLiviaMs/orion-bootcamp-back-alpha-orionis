import { Request, Response } from 'express';
import { User } from '../entity/User';
import { ResetPasswordRequestBody } from '../types/User';
import { MongoDBDataSource } from '../config/database';
import { ObjectId, Repository, UpdateResult } from 'typeorm';
import { hashPassword } from '../utils/auth';
import { ResetToken } from '../entity/ResetToken';
import { convertToObjectID } from '../utils/recovery';

export class ResetPasswordController {
  /**
   * @swagger
   * /reset-password/{id}/{resetToken}:
   *   get:
   *     summary: Verifica se o token de recuperação de senha é válido
   *     tags:
   *       - Reset Password
   *     description: Verifica se o token de recuperação de senha obtido pelo e-mail é válido
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário
   *       - in: path
   *         name: resetToken
   *         required: true
   *         description: Token de recuperação de senha
   *     responses:
   *       200:
   *         description: Token de recuperação de senha válido
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
   *                     resetToken:
   *                       type: string
   *                       description: Token de recuperação de senha
   *                     id:
   *                       type: string
   *                       description: ID do usuário
   *       401:
   *         description: Token de recuperação de senha inválido
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
   *                       description: Mensagem de erro
   *       400:
   *         description: ID de usuário inválido
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
   *                       description: Mensagem de erro
   */
  getResetToken = async (req: Request, res: Response): Promise<Response> => {
    const userID: ObjectId = convertToObjectID(req.params.id);
    const resetToken: string = req.params.resetToken;

    if (!(userID || resetToken)) {
      return res.status(400).json({
        status: false,
        data: {
          message:
            'ID de usuário ou token de recuperação de senha não informado.'
        }
      });
    }

    return res.status(200).json({
      status: true,
      data: {
        resetToken,
        id: userID
      }
    });
  };

  /**
   * @swagger
   * /reset-password:
   *   post:
   *     summary: Mudança de Senha do Usuário
   *     tags:
   *       - Reset Password
   *     description: Muda a senha do usuário para a nova senha informada mediante autorização.
   *     consumes:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               resetToken:
   *                 type: string
   *               password:
   *                 type: string
   *               confirmPassword:
   *                 type: string
   *               id:
   *                 type: string
   *     responses:
   *       200:
   *         description: Senha alterada com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   description: Booleano que indica se a requisição foi bem-sucedida
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: Mensagem de sucesso.
   *       400:
   *         description: Requisição inválida.
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
  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { password, confirmPassword, id } =
      req.body as ResetPasswordRequestBody;

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'As senhas não conferem.'
        }
      });
    }
    const userID: ObjectId = convertToObjectID(id);

    try {
      const hashedPassword: string = await hashPassword(password);

      const UserRepository: Repository<User> =
        MongoDBDataSource.getRepository(User);

      const updatedUser: UpdateResult | null = await UserRepository.update(
        { _id: userID },
        { password: hashedPassword }
      ).catch((_err) => {
        return null;
      });

      if (!updatedUser) {
        return res.status(400).json({
          status: false,
          data: {
            message: 'Não foi possível atualizar a senha.'
          }
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'Houve um erro durante a atualização da senha.'
        }
      });
    }

    const resetTokenRepository: Repository<ResetToken> =
      MongoDBDataSource.getRepository(ResetToken);

    const deletedResetToken: ResetToken | null = await resetTokenRepository
      .delete({ _id: userID })
      .catch((_err) => {
        return null;
      });

    if (!deletedResetToken) {
      return res.status(400).json({
        status: true,
        data: {
          message:
            'A senha foi alterada, porém não foi possível deletar o token de recuperação de senha.'
        }
      });
    }

    return res.status(200).json({
      status: true,
      data: {
        message: 'Senha atualizada com sucesso.'
      }
    });
  };
}
