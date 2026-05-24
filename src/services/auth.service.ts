import { api, clearTokens, setTokens } from './api';

import type { AuthTokens, LoginDto, RegisterDto, User } from '#/types';

export const authService = {
  async login(dto: LoginDto): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await api.post<{ user: User; tokens: AuthTokens }>(
      '/auth/login',
      dto,
      { authenticated: false },
    );
    setTokens(result.tokens.accessToken, result.tokens.refreshToken);
    return result;
  },

  async register(dto: RegisterDto): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await api.post<{ user: User; tokens: AuthTokens }>(
      '/auth/register',
      dto,
      { authenticated: false },
    );
    setTokens(result.tokens.accessToken, result.tokens.refreshToken);
    return result;
  },

  async me(): Promise<User> {
    return api.get<User>('/auth/me');
  },

  logout(): void {
    clearTokens();
  },
};
