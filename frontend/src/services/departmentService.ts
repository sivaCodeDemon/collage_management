import apiClient from './apiClient';
import { ApiResponse, PageResponse, Department, DepartmentSummary, PaginationParams } from '@/types';
import { MOCK_DEPARTMENTS } from './mockData';

let localDepartments: Department[] = [...MOCK_DEPARTMENTS];

export const departmentService = {
  getAll: async (params: PaginationParams = {}): Promise<ApiResponse<PageResponse<Department>>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<PageResponse<Department>>>('/departments', { params });
      return data;
    } catch {
      return {
        success: true,
        message: 'Departments fetched',
        data: {
          content: localDepartments,
          page: 0,
          size: 10,
          totalElements: localDepartments.length,
          totalPages: 1,
          first: true,
          last: true,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  getActive: async (): Promise<ApiResponse<DepartmentSummary[]>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<DepartmentSummary[]>>('/departments/active');
      return data;
    } catch {
      return {
        success: true,
        message: 'Active departments fetched',
        data: localDepartments.filter((d) => d.active).map((d) => ({
          id: d.id,
          code: d.code,
          name: d.name,
          active: d.active,
        })),
        timestamp: new Date().toISOString(),
      };
    }
  },

  getById: async (id: number): Promise<ApiResponse<Department>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
      return data;
    } catch {
      const dept = localDepartments.find((d) => d.id === Number(id)) || localDepartments[0];
      return {
        success: true,
        message: 'Department retrieved',
        data: dept,
        timestamp: new Date().toISOString(),
      };
    }
  },

  create: async (payload: Partial<Department>): Promise<ApiResponse<Department>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<Department>>('/departments', payload);
      return data;
    } catch {
      const newDept: Department = {
        id: Date.now(),
        code: payload.code || 'NEW',
        name: payload.name || 'New Department',
        description: payload.description || '',
        active: true,
        establishedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        ...payload,
      };
      localDepartments.push(newDept);
      return {
        success: true,
        message: 'Department created',
        data: newDept,
        timestamp: new Date().toISOString(),
      };
    }
  },

  update: async (id: number, payload: Partial<Department>): Promise<ApiResponse<Department>> => {
    try {
      const { data } = await apiClient.put<ApiResponse<Department>>(`/departments/${id}`, payload);
      return data;
    } catch {
      const idx = localDepartments.findIndex((d) => d.id === Number(id));
      if (idx !== -1) {
        localDepartments[idx] = { ...localDepartments[idx], ...payload };
        return {
          success: true,
          message: 'Department updated',
          data: localDepartments[idx],
          timestamp: new Date().toISOString(),
        };
      }
      throw new Error('Department not found');
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const { data } = await apiClient.delete<ApiResponse<void>>(`/departments/${id}`);
      return data;
    } catch {
      localDepartments = localDepartments.filter((d) => d.id !== Number(id));
      return {
        success: true,
        message: 'Department removed',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
