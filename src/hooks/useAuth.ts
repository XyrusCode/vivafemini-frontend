import { useCallback, useEffect, useState } from 'react';

import { authService } from '#/services/auth.service';
import type { LoginDto, RegisterDto, User } from '#/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setState({ isAuthenticated: false, isLoading: false, user: null });
      return;
    }
    authService
      .me()
      .then((user) => {
        setState({ isAuthenticated: true, isLoading: false, user });
      })
      .catch(() => {
        setState({ isAuthenticated: false, isLoading: false, user: null });
      });
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    const { user } = await authService.login(dto);
    setState({ isAuthenticated: true, isLoading: false, user });
  }, []);

  const register = useCallback(async (dto: RegisterDto) => {
    const { user } = await authService.register(dto);
    setState({ isAuthenticated: true, isLoading: false, user });
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setState({ isAuthenticated: false, isLoading: false, user: null });
  }, []);

  return { ...state, login, logout, register };
}
