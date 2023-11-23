import { Request, Response, NextFunction } from 'express';
import { findOne } from '../utils/auth';
import { User } from '../entity/User';

export const searchEmailNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const email: string = req.body.email;

  if (!email) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Email não informado.'
      }
    });
  }

  try {
    const user: User = await findOne({ where: { email } });

    if (!user?._id) {
      return res.status(400).json({
        status: false,
        data: {
          message:
            'Ocorreu um erro ao cadastrar a newsletter! Tente mais tarde.'
        }
      });
    }

    req.body.user = user;
  } catch (_err) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Ocorreu um erro ao cadastrar a newsletter! Tente mais tarde.'
      }
    });
  }

  next();
};
