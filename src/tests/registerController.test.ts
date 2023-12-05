import { Request, Response } from 'express';
import { RegisterController } from '../controller/RegisterController';
import { checkIfUserExists, saveNewUser } from '../utils/user';
import { sendEmail } from '../utils/email';
import { createJWT, hashPassword } from '../utils/auth';
import { RegisterRequestBody } from '../types/User';
import { User } from '../entity/User';
import { ObjectId } from 'mongodb';

jest.mock('../utils/user');
jest.mock('../utils/email');
jest.mock('../utils/auth');

interface MockResponse {
  status: jest.Mock;
  json: jest.Mock;
}

describe('RegisterController', () => {
  let controller: RegisterController;
  let req: Partial<Request>;
  let res: MockResponse;
  let hashedPassword: string;
  let mockUser: User;

  beforeEach(async () => {
    controller = new RegisterController();

    req = {
      body: {
        email: 'test@example.com',
        password: 'Test@1234',
        isSubscribed: true
      } as RegisterRequestBody
    } as Partial<Request>;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    hashedPassword = await hashPassword(req.body.password);

    mockUser = {
      email: req.body.email,
      password: hashedPassword,
      isSubscribed: req.body.isSubscribed,
      isVerified: false,
      _id: new ObjectId()
    };
  });

  it('deve retornar um erro se o usuário já existe', async () => {
    (checkIfUserExists as jest.Mock).mockResolvedValue(true);

    await controller.register(req as Request, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message:
        'Houve um erro na criação da sua conta. Verifique se o seu e-mail já está correto.'
    });
  });

  it('deve registrar um novo usuário', async () => {
    (checkIfUserExists as jest.Mock).mockResolvedValue(false);
    (saveNewUser as jest.Mock).mockResolvedValue(mockUser);
    (createJWT as jest.Mock).mockReturnValue('token');
    (sendEmail as jest.Mock).mockResolvedValue(true);

    await controller.register(req as Request, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      data: {
        message:
          'Sua conta foi criada com sucesso, para acessar valide a sua conta no seu e-mail'
      }
    });
  });

  it('deve retornar um erro se o envio de email falhar', async () => {
    (checkIfUserExists as jest.Mock).mockResolvedValue(false);
    (saveNewUser as jest.Mock).mockResolvedValue(mockUser);
    (createJWT as jest.Mock).mockReturnValue('token');
    (sendEmail as jest.Mock).mockResolvedValue(false);

    await controller.register(req as Request, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      data: {
        message: 'Não foi possível enviar o email de confirmação de cadastro.'
      }
    });
  });

  it('deve retornar erros inesperados', async () => {
    (checkIfUserExists as jest.Mock).mockRejectedValue(
      new Error('Erro interno do servidor')
    );

    await controller.register(req as Request, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: 'Houve um erro ao cadastrar o usuário.'
    });
  });
});
