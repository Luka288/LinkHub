import { UserResponse } from './user.type';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
}
