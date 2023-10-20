import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { User } from '../types/User';

/**
 * Cria o hash de autenticação do usuário
 * @param user Usuário obtido do banco de dados
 * @param isRememberEnabled Opção de lembrar sessão do usuário
 * @returns O hash de autenticação
 */
export const createJTW = (user: User, isRememberEnabled: boolean): string => {
  const expiry: string = isRememberEnabled ? '48h' : '2h';
  const token: string = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: expiry
    }
  );

  return token;
};

/**
 * Valida o hash de autenticação do usuário
 * @param token Hash de autenticação
 * @returns Se o hash é válido ou não
 */
export const validateJWT = (token: string): boolean => {
  try {
    const payload: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return !!payload;
  } catch (_err) {
    return false;
  }
};

/**
 * Compara a senha informada com o hash da senha do usuário
 * @param password Senha informada
 * @returns O hash da senha informada
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);

  return bcrypt.hash(password, salt);
};

/**
 * Compara a senha informada com o hash de senha do usuário
 * @param password Senha informada
 * @param hash O hash da senha do usuário
 * @returns Se a senha é válida ou não
 */
export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash);

//@TODO: Remova - função de teste
export const findOne = ({
  where: { email }
}: {
  where: { email: string };
}): Promise<User> => {
  return new Promise((resolve, reject) => {
    if (email === 'email@domain.com') {
      resolve({
        id: 'bec36603-5f6b-4430-ba83-e5fe6a4d0989',
        email: 'email@domain.com',
        password: '$2b$12$un44BpeTTyJQKrhf9K3xpuCKtyjvGQx2Aogt2QNkf0LZPgg3M9wdm' // 123456
      });
    }

    reject({ erro: 'Usuário não encontrado.' });
  });
};
