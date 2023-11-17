import { User } from '../entity/User';
import { Repository } from 'typeorm';
import { hashPassword } from './auth';

/**
 * Checa de forma assíncrona se um usuário, através de seu email, já existe no
 * banco de dados.
 * @param {string} email - O email do usuário a ser checado.
 * @param {Repository<User>} userRepository - A instância do repositório do usuário para
 * realizar operações no banco de dados.
 * @returns {Promise<boolean>} Uma promise que retorna true se o usuário existe, caso
 * contrário retorna false.
 */
export const checkIfUserExists = async (
  email: string,
  userRepository: Repository<User>
): Promise<boolean> => {
  const existingUser: User = await userRepository.findOne({ where: { email } });
  return !!existingUser;
};

/**
 * Cria e salva de forma assíncrona um novo usuário no banco de dados.
 * É feito um hash da senha antes de salvar no banco de dados.
 * @param {string} email - O email do usuário a ser salvo.
 * @param {string} password - A senha do usuário a ser salvo.
 * @param {boolean} isSubscribed - Indica se o usuário está inscrito na newsletter ou não.
 * @param {boolean} isVerified - Indica se o usuário está verificado ou não.
 * @param {Repository<User>} userRepository - A instância do repositório do usuário para
 * realizar operações no banco de dados.
 * @returns {Promise<User>} - Uma promise que retorna o usuário salvo no banco de dados.
 */
export const saveNewUser = async (
  email: string,
  password: string,
  isSubscribed: boolean,
  isVerified: boolean,
  userRepository: Repository<User>
): Promise<User> => {
  const hashedPassword = await hashPassword(password);
  const newUser = userRepository.create({
    email,
    password: hashedPassword,
    isSubscribed,
    isVerified
  });
  return userRepository.save(newUser);
};
