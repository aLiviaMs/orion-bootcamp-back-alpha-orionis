import { User } from '../entity/User';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface ValidatedLoginRequestBody {
  isRememberEnabled: boolean;
  user: User;
}

export interface ResetPasswordRequestBody {
  id: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
}

export interface TransportOptions {
  host?: string;
  port?: number;
  service?: string;
  auth: Auth;
}

interface Auth {
  user: string;
  pass: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}

export interface StatusResponse {
  status: boolean;
  data: {
    message: string;
  };
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  isSubscribed: boolean;
  isVerified: boolean;
}
