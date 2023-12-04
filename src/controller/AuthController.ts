import { createJWT } from '../utils/auth';
import { Request, Response } from 'express';
import { ValidatedLoginRequestBody } from '../types/User';

export class AuthController {
  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Login de usuários
   *     description: Realiza o acesso de usuários cadastrados e verificados ao sistema. Responde com um token JWT, podendo valer por 48 horas caso `isRememberEnabled` seja `true`, ou por 2 horas caso contrário.
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email do usuário cadastrado e verificado
   *               password:
   *                 type: string
   *                 format: password
   *                 description: Senha do usuário
   *               isRememberEnabled:
   *                 type: boolean
   *                 description: Se o usuário deseja permanecer logado.
   *     responses:
   *       '200':
   *         description: Requisição realizada com sucesso
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
   *                     token:
   *                       type: string
   *                       description: Token de autenticação
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
   *                       example: "Email ou senha incorretos."
   */

  login = async (req: Request, res: Response): Promise<Response> => {
    const { user, isRememberEnabled } = req.body as ValidatedLoginRequestBody;
    const token: string = createJWT(user, isRememberEnabled);

    return res.status(200).json({
      status: true,
      data: {
        token
      }
    });
  };
}
