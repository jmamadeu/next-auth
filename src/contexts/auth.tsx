import Router from 'next/router';
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
  const isAuthenticated = false;
  const [user, setUser] = useState<UserProperties>({} as UserProperties);

  const signIn = useCallback(async ({ email, password }: SignInProperties) => {
    try {
      const { data: response } = await api.post('/sessions', {
        email,
        password,
      });

      setUser({
        email,
        permissions: response.permissions,
        roles: response.roles
      });

      Router.push('/dashboard')
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
