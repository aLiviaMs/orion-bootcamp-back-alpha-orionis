import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'typeorm';
import { ObjectId as convertToObjectID } from 'mongodb';
import { ResetToken } from '../entity/ResetToken';
import {
  findResetTokenByID,
  hashToken,
  isTokenExpired
} from '../utils/recovery';

export const verifyResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: string = req.params.id ?? (req.body.id as string);
  const resetToken: string =
    req.params.resetToken ?? (req.body.resetToken as string);

  if (!resetToken) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Token de recuperação de senha não informado.'
      }
    });
  }

  const userID: ObjectId = new convertToObjectID(id);
  const resetTokenDB: ResetToken | null = await findResetTokenByID(
    userID
  ).catch((_err) => null);

  if (!resetTokenDB?._id) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'Não foi possível encontrar o token de recuperação de senha.'
      }
    });
  }

  const TokenExpired: boolean = isTokenExpired(resetTokenDB);
  if (TokenExpired) {
    return res.status(401).json({
      status: false,
      data: {
        message: 'O token de recuperação de senha expirou.'
      }
    });
  }

  const tokenHash: string = hashToken(resetToken);

  if (tokenHash !== resetTokenDB.hash) {
    return res.status(401).json({
      status: false,
      data: {
        message: 'Token de recuperação de senha inválido.'
      }
    });
  }

  next();
};
