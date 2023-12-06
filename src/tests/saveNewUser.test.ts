import { hashPassword } from './../utils/auth';
import { saveNewUser, UserRepository } from '../utils/user';
import { User } from '../entity/User';

afterEach(() => {
  jest.clearAllMocks();
});

describe('saveNewUser', () => {
  it('deve salvar um novo usuário', async () => {
    jest
      .spyOn(UserRepository, 'create')
      .mockImplementation((userData: Partial<User>) => {
        return Object.assign(new User(), userData);
      });

    jest
      .spyOn(UserRepository, 'save')
      .mockImplementation(async (user: User) => user);

    const hashedPassword: string = await hashPassword('password');

    const result: User = await saveNewUser(
      'test@example.com',
      hashedPassword,
      true,
      false,
      UserRepository
    );

    expect(result).toBeInstanceOf(User);
    expect(result.email).toEqual('test@example.com');
    expect(result.isSubscribed).toBeTruthy();
    expect(result.isVerified).toBe(false);
  });
});
