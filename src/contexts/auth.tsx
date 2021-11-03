import React, { createContext, useCallback } from 'react';

type SignInProperties = {
  email: string;
  password: string;
};

type AuthContextProperties = {
  signIn(credentials: SignInProperties): Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextProperties>(
  {} as AuthContextProperties
);

export const AuthProvider: React.FC = ({ children }) => {
  const isAuthenticated = false

  const signIn = useCallback(async ({ email, password }: SignInProperties) => {
    console.log(email, password, "auth")
  }, [])

  return <AuthContext.Provider value={{ signIn, isAuthenticated }}>{children}</AuthContext.Provider>;
};
