import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { MongoDBDataSource } from '../config/database';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';

interface LoginRequestBody {
  email: string;
}

export class LoginController {
  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Authenticate a user
   *     tags:
   *       - Login
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     requestBody:
   *       description: User's email for authentication
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 description: User's email address
   *     responses:
   *       '200':
   *         description: 'Usuário autenticado com sucesso'
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     email:
   *                       type: string
   *                 token:
   *                   type: string
   *                   description: JWT token for user authentication, valid for 2 hours
   *       '401':
   *         description: 'Autenticação falhou'
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message indicating authentication failure
   */
  async login(req: Request, res: Response): Promise<Response> {
    const { email } = req.body as LoginRequestBody;
    const userRepository: Repository<User> =
      MongoDBDataSource.getRepository(User);
    const user: User | undefined = await userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password']
    });

    if (!user) {
      return res.status(401).json({ message: 'Autenticação falhou' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '2h'
    });

    return res.status(200).json({ user: user, token: token });
  }
}
