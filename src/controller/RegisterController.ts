import { Request, Response } from 'express';
import { RegisterRequestBody } from '../types/User';
import { UserRepository, checkIfUserExists, saveNewUser } from '../utils/user';
import { sendEmail } from '../utils/email';
import { composeRegisterEmailContent } from '../utils/emailTemplates/registerEmailContent';
import { createJWT } from '../utils/auth';

export class RegisterController {
  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Cadastro de usuários
   *     description: Registra um novo usuário e envia um email de verificação com um link contendo um token JWT.
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
   *     produces:
   *       - application/json
   *     consumes:
   *       - application/json
   *     responses:
   *       '200':
   *         description: >
   *           Usuário cadastrado com sucesso. Um email de verificação contendo um link com token JWT é enviado.
   *           O usuário deve clicar no link para validar a conta.
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
   *                       example: "Sua conta foi criada com sucesso, para acessar valide a sua conta no seu e-mail"
   *       '400':
   *         description: >
   *           Falha ao cadastrar usuário. Pode ser devido ao usuário já estar cadastrado ou falha ao enviar email de verificação.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   description: Status da requisição. `false` indica que a requisição falhou.
   *                   example: false
   *                 message:
   *                   type: string
   *                   description: Mensagem de erro.
   *                   example: "Não foi possível enviar o email de confirmação de cadastro."
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: boolean
   *                   description: Status da requisição. `false` indica que a requisição falhou.
   *                   example: false
   *                 message:
   *                   type: string
   *                   description: Mensagem de erro.
   *                   example: "Houve um erro ao cadastrar o usuário."
   */
  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password, isSubscribed } = req.body as RegisterRequestBody;
      const isVerified = false;

      if (await checkIfUserExists(email, UserRepository)) {
        return res.status(400).json({
          status: false,
          message:
            'Houve um erro na criação da sua conta. Verifique se o seu e-mail já está correto.'
        });
      }

      const user = await saveNewUser(
        email,
        password,
        isSubscribed,
        isVerified,
        UserRepository
      );

      const token = createJWT(user);

      if (user) {
        const email: string = user.email;
        const subject: string = 'Explorador Orion - Bem-vindo!';
        const confirmURL: string = `${process.env.FRONTEND_URL}/auth/login/${token}`;
        const emailContent: string = composeRegisterEmailContent(confirmURL);
        const wasEmailSent: boolean = await sendEmail(
          email,
          subject,
          emailContent
        );

        if (!wasEmailSent) {
          res.status(400).json({
            status: false,
            data: {
              message:
                'Não foi possível enviar o email de confirmação de cadastro.'
            }
          });
        }
      }

      return res.status(200).json({
        status: true,
        data: {
          message:
            'Sua conta foi criada com sucesso, para acessar valide a sua conta no seu e-mail'
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
