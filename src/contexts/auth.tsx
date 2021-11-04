import Router from 'next/router';
import { setCookie } from 'nookies';
import React, { createContext, useCallback, useState } from 'react';
import { api } from '../services/api';

type UserProperties = {
  email: string;
  permissions: Array<string>;
  roles: Array<string>;
};

type SignInProperties = {
  email: string;
  password: string;
};

type AuthContextProperties = {
  signIn(credentials: SignInProperties): Promise<void>;
  isAuthenticated: boolean;
  user: UserProperties;
};

export const AuthContext = createContext<AuthContextProperties>(
  {} as AuthContextProperties
);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserProperties>({} as UserProperties);
  const isAuthenticated = !!user;

  const signIn = useCallback(async ({ email, password }: SignInProperties) => {
    try {
      const { data: response } = await api.post('/sessions', {
        email,
        password,
      });

      const { roles, permissions, token, refreshToken } = response;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      setCookie(undefined, 'nextauth.refreshToken', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      setUser({
        email,
        permissions,
        roles,
      });

      Router.push('/dashboard');
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};
