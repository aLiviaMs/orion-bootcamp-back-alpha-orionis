import { Request, Response, NextFunction } from 'express';
import { StatusResponse } from '../types/User';

export const validateEmail = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<StatusResponse> | void => {
  const email: string = req.body.email;
  if (!email) {
    return res
      .status(400)
      .json({ status: false, message: 'Email não informado.' });
  }

  if (email.length > 1000) {
    return res.status(400).json({
      status: false,
      message: 'Email excedeu o limite de 1000 caracteres.'
    });
  }

  const emailRegex: RegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ status: false, message: 'Formato de email inválido' });
  }

  next();
};
