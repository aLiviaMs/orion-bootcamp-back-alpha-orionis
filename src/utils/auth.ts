import { User } from './../entity/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { MongoDBDataSource } from '../config/database';
import { SearchEmailResponse } from '../types/User';

/**
 * Cria o hash de autenticação do usuário
 * @param user Usuário obtido do banco de dados
 * @param isRememberEnabled Opção de lembrar sessão do usuário
 * @returns O hash de autenticação
 */
export const createJWT = (
  user: User,
  isRememberEnabled: boolean = false
): string => {
  const expiry: string = isRememberEnabled ? '48h' : '2h';
  const token: string = jwt.sign(
    {
      id: user?._id,
      email: user?.email
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
 * Cria o hash da senha informada
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
): Promise<boolean> =>
  await bcrypt.compare(password, hash).catch((_err) => false);

/**
 * Busca um usuário no banco de dados a partir do email
 * @param where Objeto com o email do usuário
 * @returns O usuário encontrado
 * @throws Se ocorrer algum erro ao buscar o usuário
 */
export const findOne = async ({
  where: { email }
}: {
  where: { email: string };
}): Promise<User> => {
  try {
    const UserRepository = MongoDBDataSource.getRepository(User);
    const searchedUser: User = await UserRepository.findOne({
      where: { email },
      select: ['_id', 'email', 'password']
    });
    return searchedUser;
  } catch (error) {
    return null;
  }
};

/**
 * Procura por um usuário a partir de um E-mail
 * @param email O E-mail informado
 * @param message Uma mensagem personalizada a ser retornada
 * @returns O usuário encontrado ou uma mensagem informando o ocorrido
 */
export const searchUserEmail = async (
  email: string,
  message: string
): Promise<SearchEmailResponse> => {
  if (!email) {
    return {
      status: false,
      message: 'Email não informado.'
    };
  }

  const user: User | null = await findOne({ where: { email } });

  if (!user?._id) {
    return {
      status: false,
      message
    };
  }

  return {
    status: true,
    user
  };
};
