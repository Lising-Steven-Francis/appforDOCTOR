export interface User {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string;
  [key: string]: unknown;
}

export type UserType = User | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
