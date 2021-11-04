import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { api } from '../services/api-client';

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

export function signOutAndRemoveCookies() {
  destroyCookie(undefined, 'nextauth.token');
  destroyCookie(undefined, 'nextauth.refreshToken');

  Router.push('/');
}

export const AuthContext = createContext<AuthContextProperties>(
  {} as AuthContextProperties
);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserProperties>({} as UserProperties);
  const isAuthenticated = !!user;

  async function getUserFromCookies() {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      try {
        const { data } = await api.get('/me');

        const { roles, email, permissions } = data;

        setUser({
          roles,
          email,
          permissions,
        });
      } catch (err: any) {
        signOutAndRemoveCookies();
      }
    }
  }

  useEffect(() => {
    getUserFromCookies();
  }, []);

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

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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
