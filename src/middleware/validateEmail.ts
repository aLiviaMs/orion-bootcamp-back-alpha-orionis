import { Request, Response, NextFunction } from 'express';
import { StatusResponse } from '../types/User';

export const validateEmail = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<StatusResponse> | void => {
  const email: string = req.body.email;
  const emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ status: false, message: 'Formato de email inválido' });
  }

  next();
};
