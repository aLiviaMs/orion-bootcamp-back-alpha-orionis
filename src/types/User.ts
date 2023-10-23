import { User } from '../entity/User';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface ValidatedLoginRequestBody {
  isRememberEnabled: boolean;
  user: User;
}
