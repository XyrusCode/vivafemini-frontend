import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type JSX,
} from 'react';

import { AuthModal } from '#/components/auth/AuthModal';
import { useAuth } from '#/hooks/useAuth';

import type { LoginDto, RegisterDto, User } from '#/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
  openAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const auth = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const value: AuthContextValue = {
    ...auth,
    openAuthModal: () => { setIsModalOpen(true); },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {isModalOpen && (
        <AuthModal
          onClose={() => { setIsModalOpen(false); }}
          onSuccess={() => { setIsModalOpen(false); }}
          login={auth.login}
          register={auth.register}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
