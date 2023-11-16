import { Request, Response, NextFunction } from 'express';
import { findOne } from '../utils/auth';
import { User } from '../entity/User';

export const searchEmail = async (
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

  const emailErrorMessage: string =
    'Ocorreu um erro durante o processamento da requisição.';
  const emailErrorResponse: Response = res.status(400).json({
    status: false,
    data: {
      message: emailErrorMessage
    }
  });

  try {
    const user: User = await findOne({ where: { email } });

    if (!user?._id) {
      return emailErrorResponse;
    }

    req.body.user = user;
  } catch (_err) {
    return emailErrorResponse;
  }

  next();
};
