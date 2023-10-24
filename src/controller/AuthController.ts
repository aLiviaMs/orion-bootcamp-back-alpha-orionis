import { createJTW } from '../utils/auth';
import { Request, Response } from 'express';
import { ValidatedLoginRequestBody } from '../types/User';

export class AuthController {
  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Login de usuários
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: "email@domain.com"
   *               password:
   *                 type: string
   *                 example: "Senh@Fort3"
   *               isRememberEnabled:
   *                 required: false
   *                 type: boolean
   *                 example: true
   *                 description: Se o usuário deseja permanecer logado
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
   *                 data:
   *                   type: object
   *                   description: Resposta JSON contendo o token de autenticação
   *                   example: { status: true, data: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" } }
   *       '400':
   *         description: Requisição inválida
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   description: Resposta JSON contendo a mensagem de erro
   *                   example: { status: false, data: { message: "Não foi possível encontrar sua conta." } }
   */

  login = async (req: Request, res: Response): Promise<Response> => {
    const { user, isRememberEnabled } = req.body as ValidatedLoginRequestBody;
    const token: string = createJTW(user, isRememberEnabled);

    return res.status(200).json({
      status: true,
      data: {
        token
      }
    });
  };
}
