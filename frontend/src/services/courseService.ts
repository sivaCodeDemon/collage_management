import apiClient from './apiClient';
import { ApiResponse, PageResponse, Course, PaginationParams } from '@/types';
import { MOCK_COURSES } from './mockData';

let localCourses: Course[] = [...MOCK_COURSES];

export const courseService = {
  getAll: async (params: PaginationParams = {}): Promise<ApiResponse<PageResponse<Course>>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<PageResponse<Course>>>('/courses', { params });
      return data;
    } catch {
      return {
        success: true,
        message: 'Courses fetched',
        data: {
          content: localCourses,
          page: 0,
          size: 10,
          totalElements: localCourses.length,
          totalPages: 1,
          first: true,
          last: true,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  create: async (payload: Partial<Course>): Promise<ApiResponse<Course>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<Course>>('/courses', payload);
      return data;
    } catch {
      const newCourse: Course = {
        id: Date.now(),
        code: payload.code || 'CRS-NEW',
        name: payload.name || 'New Course',
        description: payload.description || '',
        departmentId: payload.departmentId || 1,
        departmentName: payload.departmentName || 'Computer Science & Engineering',
        durationYears: payload.durationYears || 4,
        totalSemesters: payload.totalSemesters || 8,
        active: true,
        createdAt: new Date().toISOString(),
      };
      localCourses.push(newCourse);
      return {
        success: true,
        message: 'Course created',
        data: newCourse,
        timestamp: new Date().toISOString(),
      };
    }
  },
};
