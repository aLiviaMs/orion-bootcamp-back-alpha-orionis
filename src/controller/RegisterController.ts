import { Request, Response } from 'express';
import { RegisterRequestBody } from '../types/User';
import { UserRepository, checkIfUserExists, saveNewUser } from '../utils/user';

export class RegisterController {
  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Cadastro de usuários
   *     tags:
   *       - Register
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
   *                 description: O email do usuário
   *               password:
   *                 type: string
   *                 format: password
   *                 description: A senha do usuário
   *               isSubscribed:
   *                 type: boolean
   *                 description: Indica se o usuário está inscrito na newsletter ou não
   *               isVerified:
   *                 type: boolean
   *                 description: Indica se o usuário está verificado ou não
   *     produces:
   *       - application/json
   *     consumes:
   *       - application/json
   *     responses:
   *       '200':
   *         description: Usuário cadastrado com sucesso
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
   *                       example: "Usuário cadastrado com sucesso."
   *       '400':
   *         description: Usuário já cadastrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Usuário já cadastrado."
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Houve um erro ao cadastrar o usuário."
   */
  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password, isSubscribed, isVerified } =
        req.body as RegisterRequestBody;

      if (await checkIfUserExists(email, UserRepository)) {
        return res.status(400).json({
          status: false,
          message: 'Usuário já cadastrado.'
        });
      }

      await saveNewUser(
        email,
        password,
        isSubscribed,
        isVerified,
        UserRepository
      );

      return res.status(200).json({
        status: true,
        data: {
          message: 'Usuário cadastrado com sucesso.'
        }
      });
    } catch (error) {
      console.error('Erro de registro:', error);
      res.status(500).json({
        status: false,
        message: 'Houve um erro ao cadastrar o usuário.'
      });
    }
  };
}
