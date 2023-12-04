import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserRepository } from '../utils/user';
import { User } from '../entity/User';
import { ObjectId } from 'mongodb';

interface JwtPayload {
  id: ObjectId;
  email: string;
  iat?: number;
  exp?: number;
}

export class UserController {
  /**
   * @swagger
   * /user-verification:
   *    post:
   *     summary: Verifica o email do usuário
   *     description: >
   *       Este endpoint verifica o email do usuário através da checagem do token JWT fornecido.
   *       Se o token for válido e corresponder a um usuário existente, o status `isVerified`
   *       do usuário será atualizado para `true`.
   *     tags:
   *       - User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *             properties:
   *               token:
   *                 type: string
   *                 description: Token JWT enviado para o email do usuário para verificação.
   *     responses:
   *       '200':
   *         description: Email verificado com sucesso.
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
   *                       example: Email verificado com sucesso
   *       '400':
   *         description: Token inválido ou expirado, ou usuário não encontrado.
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
   *                       example: Token inválido ou usuário não encontrado
   *       '500':
   *         description: Erro interno do servidor.
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
   *                       example: Erro interno do servidor
   */
  verify = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { token } = req.body;

      const decoded: string | jwt.JwtPayload = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as JwtPayload;

      const userId = new ObjectId(decoded.id);
      const user: User = await UserRepository.findOne({
        where: { _id: userId }
      });

      if (!user) {
        return res.status(400).json({
          status: false,
          data: { message: 'Token inválido ou usuário não encontrado' }
        });
      }

      user.isVerified = true;
      await UserRepository.save(user);

      return res.status(200).json({
        status: true,
        data: { message: 'Email verificado com sucesso' }
      });
    } catch (error) {
      console.error('Verification Error:', error);
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(400).json({
          status: false,
          data: { message: 'Token expirado' }
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({
          status: false,
          data: { message: 'Token inválido' }
        });
      } else {
        return res.status(500).json({
          status: false,
          data: { message: 'Erro interno do servidor' }
        });
      }
    }
  };
}
