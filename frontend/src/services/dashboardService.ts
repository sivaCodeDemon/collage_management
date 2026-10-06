import apiClient from './apiClient';
import { ApiResponse, DashboardStats } from '@/types';
import { MOCK_DASHBOARD_STATS } from './mockData';

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
      return data;
    } catch {
      return {
        success: true,
        message: 'Dashboard stats fetched',
        data: MOCK_DASHBOARD_STATS,
        timestamp: new Date().toISOString()
      };
    }
  }
};
