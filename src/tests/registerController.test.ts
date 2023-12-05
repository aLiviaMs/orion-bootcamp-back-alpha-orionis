import { Request, Response } from 'express';
import { RegisterController } from '../controller/RegisterController';
import { UserRepository, checkIfUserExists, saveNewUser } from '../utils/user';
import { sendEmail } from '../utils/email';
import { createJWT } from '../utils/auth';

jest.mock('../utils/user');
jest.mock('../utils/email');
jest.mock('../utils/auth');

describe('RegisterController', () => {
  let controller: RegisterController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    controller = new RegisterController();

    req = {
      body: {
        email: 'test@example.com',
        password: 'Test@1234',
        isSubscribed: true,
        isVerified: true
      }
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  }) as Response;

  it.todo('deve registrar um novo usuário');
  it.todo('deve retornar um erro se o usuário já existe');
  it.todo('deve retornar um erro se o envio de email falhar');
  it.todo('deve retornar erros inesperados');
});
