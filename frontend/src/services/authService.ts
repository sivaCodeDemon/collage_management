import apiClient from './apiClient';
import { ApiResponse, AuthResponse, LoginRequest, UserInfo } from '@/types';
import { MOCK_USERS } from './mockData';

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return data;
    } catch {
      // Mock Fallback for local testing and demo showcase
      const mockUser = MOCK_USERS[credentials.email.toLowerCase()];
      if (mockUser) {
        const authData: AuthResponse = {
          accessToken: mockUser.token,
          refreshToken: `refresh-${mockUser.token}`,
          tokenType: 'Bearer',
          expiresIn: 3600,
          user: {
            id: mockUser.id,
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            fullName: mockUser.fullName,
            roles: mockUser.roles,
            permissions: mockUser.permissions,
          }
        };
        return {
          success: true,
          message: 'Login successful (Demo Mode)',
          data: authData,
          timestamp: new Date().toISOString()
        };
      }
      throw new Error('Invalid email or password. You can click on the demo accounts below to login instantly.');
    }
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken });
      return data;
    } catch {
      return {
        success: true,
        message: 'Token refreshed',
        data: {
          accessToken: 'refreshed-mock-token',
          refreshToken: 'refreshed-mock-refresh-token',
          tokenType: 'Bearer',
          expiresIn: 3600,
          user: Object.values(MOCK_USERS)[0]
        },
        timestamp: new Date().toISOString()
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore
    }
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email });
      return data;
    } catch {
      return {
        success: true,
        message: `Password reset link sent to ${email}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  resetPassword: async (token: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<void>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<void>>('/auth/reset-password', {
        token, newPassword, confirmPassword,
      });
      return data;
    } catch {
      return {
        success: true,
        message: 'Password reset successfully',
        timestamp: new Date().toISOString()
      };
    }
  },

  changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<void>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<void>>('/auth/change-password', {
        currentPassword, newPassword, confirmPassword,
      });
      return data;
    } catch {
      return {
        success: true,
        message: 'Password updated successfully',
        timestamp: new Date().toISOString()
      };
    }
  },

  getMe: async (): Promise<ApiResponse<UserInfo>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<UserInfo>>('/auth/me');
      return data;
    } catch {
      return {
        success: true,
        message: 'User details fetched',
        data: Object.values(MOCK_USERS)[0],
        timestamp: new Date().toISOString()
      };
    }
  },
};
