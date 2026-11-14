
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
  verifyEmail,
  logoutUser,
} from "@/lib/auth.service";

import type {
  User,
  LoginRequest,
  RegisterRequest,
  RegistrationResponse,
  VerifyEmailResponse,
} from "@/types";


type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<RegistrationResponse>;
  verifyRegistrationEmail: (
    email: string,
    otp: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      throw error;
    }
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      active = false;
    };
  }, []);

  const login = async (payload: LoginRequest) => {
    const response = await loginUser(payload);
    setUser(response.user);
  };

  const register = async (
    payload: RegisterRequest,
  ): Promise<RegistrationResponse> => {
    return await registerUser(payload);
  };

  const verifyRegistrationEmail = async (
    email: string,
    otp: string,
  ) => {
    const response: VerifyEmailResponse = await verifyEmail({
      email,
      otp,
    });

    setUser(response.user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        verifyRegistrationEmail,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }

  return context;
}
