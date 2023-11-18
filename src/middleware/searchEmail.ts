import { Request, Response, NextFunction } from 'express';
import { searchUserEmail } from '../utils/auth';
import { SearchEmailResponse } from '../types/User';

export const searchEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const email: string = req.body.email;

  const searchEmailResponse: SearchEmailResponse = await searchUserEmail(
    email,
    'Ocorreu um erro durante o processamento da requisição.'
  );

  if (searchEmailResponse.status) {
    req.body.user = searchEmailResponse.user;
  } else {
    return res.status(400).json(searchEmailResponse);
  }

  next();
};
