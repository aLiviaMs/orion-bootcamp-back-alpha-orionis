import { comparePasswords, findOne } from '../utils/auth';
import { Request, Response, NextFunction } from 'express';
import { LoginRequestBody } from '../types/User';
import { User } from 'entity/User';

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email, password } = req.body as LoginRequestBody;

  if (!email || !password) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Email ou senha não informados.'
      }
    });
  }

  try {
    const user: User = await findOne({ where: { email } });
    const isValidPassword = await comparePasswords(password, user?.password);

    if (!isValidPassword) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'E-mail ou senha incorretos. Tente novamente.'
        }
      });
    }

    req.body.user = user;
  } catch (_err) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Ocorreu um erro durante o processamento da requisição.'
      }
    });
  }

  next();
};
