export interface User {
  id: string;
  name?: string;
  email: string;
  password: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface ValidatedLoginRequestBody {
  isRememberEnabled: boolean;
  user: User;
}
