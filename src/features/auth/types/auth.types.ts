export type LoginResponse = {
  token: string;
  user: User;
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export interface LoginPayload {
  email: string;
  password: string;
}
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}
