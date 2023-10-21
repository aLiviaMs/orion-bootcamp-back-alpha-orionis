import { comparePasswords, findOne } from '../utils/auth';
import { Request, Response, NextFunction } from 'express';
import { User, LoginRequestBody } from '../types/User';

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
    const isValidPassword = await comparePasswords(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'A senha digitada está incorreta. Tente novamente.'
        }
      });
    }

    req.body.user = user;
  } catch (_err) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Não foi possível encontrar sua conta.'
      }
    });
  }

  next();
};
