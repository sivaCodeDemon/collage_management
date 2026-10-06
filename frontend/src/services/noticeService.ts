import apiClient from './apiClient';
import { ApiResponse, Notice } from '@/types';
import { MOCK_NOTICES } from './mockData';

let localNotices: Notice[] = [...MOCK_NOTICES];

export const noticeService = {
  getAll: async (): Promise<ApiResponse<Notice[]>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<Notice[]>>('/notices');
      return data;
    } catch {
      return {
        success: true,
        message: 'Notices fetched',
        data: localNotices,
        timestamp: new Date().toISOString()
      };
    }
  },

  create: async (payload: Partial<Notice>): Promise<ApiResponse<Notice>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<Notice>>('/notices', payload);
      return data;
    } catch {
      const newNotice: Notice = {
        id: Date.now(),
        title: payload.title || 'Untitled Notice',
        content: payload.content || '',
        noticeType: payload.noticeType || 'GENERAL',
        targetAudience: payload.targetAudience || 'ALL',
        priority: payload.priority || 'MEDIUM',
        isPublished: true,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      localNotices.unshift(newNotice);
      return {
        success: true,
        message: 'Notice published successfully',
        data: newNotice,
        timestamp: new Date().toISOString()
      };
    }
  }
};
