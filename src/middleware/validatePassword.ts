import { Request, Response, NextFunction } from 'express';
import { LoginRequestBody } from '../types/User';

export const validatePassword = async (
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

  // Senha muito grandes podem ser muito dispendiosas e causar Regular Expression Denial of Service
  if (password.length > 1000) {
    return res.status(400).json({
      status: false,
      data: {
        message: 'A senha deve ter no máximo 1000 caracteres.'
      }
    });
  }

  // Min 8 chars, 1 maiúsculo, 1 especial
  // especial é um destes: !@#$%^&;:{}|<>*\()'"-_+.
  const strongPasswordRegex: RegExp =
    /^(?=.*[A-Z])(?=.*[!@#$%^&;:{}|<>*\\('")\-_+.])(?=.*[0-9]).{8,}$/;
  const isPasswordStrong: boolean = strongPasswordRegex.test(password);

  if (!isPasswordStrong) {
    const weakPasswordErrorMessage: string = `A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, \
1 número, e 1 caractere especial dentre os seguintes: !@#$%^&;:{}|<>*\\()'"-_+.`;

    return res.json({
      status: false,
      data: {
        message: weakPasswordErrorMessage
      }
    });
  }

  next();
};
