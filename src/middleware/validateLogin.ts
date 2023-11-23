import { comparePasswords } from '../utils/auth';
import { Request, Response, NextFunction } from 'express';
import { LoginRequestBody } from '../types/User';
import { User } from 'entity/User';

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { password } = req.body as LoginRequestBody;

  if (!password) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Senha não informada.'
      }
    });
  }

  const user: User = req.body.user;

  const isValidPassword = await comparePasswords(password, user?.password);

  if (!isValidPassword) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'E-mail ou senha incorretos. Tente novamente.'
      }
    });
  }

  next();
};
