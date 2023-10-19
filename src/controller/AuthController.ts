import { createJTW, comparePasswords } from '../utils/auth';
import { Request, Response } from 'express';
import { User, LoginRequestBody } from '../types/User';

//@TODO: Remova - Classe de teste
class UserDB {
  static findOne({
    where: { email }
  }: {
    where: { email: string };
  }): Promise<User> {
    return new Promise((resolve, reject) => {
      if (email === 'email@domain.com') {
        resolve({
          id: 'bec36603-5f6b-4430-ba83-e5fe6a4d0989',
          email: 'email@domain.com',
          password:
            '$2b$12$un44BpeTTyJQKrhf9K3xpuCKtyjvGQx2Aogt2QNkf0LZPgg3M9wdm' // 123456
        });
      }

      reject({ erro: 'Usuário não encontrado.' });
    });
  }
}

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
   *                 example: "123456"
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
    const { email, password, isRememberEnabled } = req.body as LoginRequestBody;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'Email ou senha não informados.'
        }
      });
    }

    try {
      const user: User = await UserDB.findOne({ where: { email } });
      const isValidPassword = await comparePasswords(password, user.password);

      if (!isValidPassword) {
        return res.status(400).json({
          status: false,
          data: {
            message: 'A senha digitada está incorreta. Tente novamente.'
          }
        });
      }

      const token: string = createJTW(user, isRememberEnabled);

      return res.status(200).json({
        status: true,
        data: {
          token
        }
      });
    } catch (_err) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'Não foi possível encontrar sua conta.'
        }
      });
    }
  };
}
