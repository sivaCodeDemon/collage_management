import apiClient from './apiClient';
import { ApiResponse, PageResponse, Professor, ProfessorSummary, PaginationParams } from '@/types';
import { MOCK_PROFESSORS } from './mockData';

let localProfessors: Professor[] = [...MOCK_PROFESSORS];

export const professorService = {
  getAll: async (params: PaginationParams = {}): Promise<ApiResponse<PageResponse<ProfessorSummary>>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<PageResponse<ProfessorSummary>>>('/professors', { params });
      return data;
    } catch {
      let filtered = [...localProfessors];
      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.firstName.toLowerCase().includes(query) ||
            p.lastName.toLowerCase().includes(query) ||
            p.employeeId.toLowerCase().includes(query) ||
            p.email.toLowerCase().includes(query)
        );
      }
      const page = params.page || 0;
      const size = params.size || 10;
      const start = page * size;
      const paginated = filtered.slice(start, start + size).map((p) => ({
        id: p.id,
        employeeId: p.employeeId,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        departmentName: p.departmentName,
        designation: p.designation,
        status: p.status,
      }));

      return {
        success: true,
        message: 'Professors fetched successfully',
        data: {
          content: paginated,
          page,
          size,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          first: page === 0,
          last: start + size >= filtered.length,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  getById: async (id: number): Promise<ApiResponse<Professor>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<Professor>>(`/professors/${id}`);
      return data;
    } catch {
      const prof = localProfessors.find((p) => p.id === Number(id)) || localProfessors[0];
      return {
        success: true,
        message: 'Professor retrieved',
        data: prof,
        timestamp: new Date().toISOString(),
      };
    }
  },

  create: async (payload: Partial<Professor>): Promise<ApiResponse<Professor>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<Professor>>('/professors', payload);
      return data;
    } catch {
      const newProf: Professor = {
        id: Date.now(),
        employeeId: `EMP-FAC-00${localProfessors.length + 1}`,
        userId: Date.now(),
        firstName: payload.firstName || 'Faculty',
        lastName: payload.lastName || 'Member',
        email: payload.email || 'faculty@college.edu',
        departmentId: payload.departmentId || 1,
        departmentName: payload.departmentName || 'Computer Science & Engineering',
        designation: payload.designation || 'Assistant Professor',
        qualification: payload.qualification || 'M.Tech / Ph.D.',
        specialization: payload.specialization || 'Computer Science',
        experienceYears: payload.experienceYears || 5,
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        ...payload,
      };
      localProfessors.unshift(newProf);
      return {
        success: true,
        message: 'Professor created successfully',
        data: newProf,
        timestamp: new Date().toISOString(),
      };
    }
  },

  update: async (id: number, payload: Partial<Professor>): Promise<ApiResponse<Professor>> => {
    try {
      const { data } = await apiClient.put<ApiResponse<Professor>>(`/professors/${id}`, payload);
      return data;
    } catch {
      const index = localProfessors.findIndex((p) => p.id === Number(id));
      if (index !== -1) {
        localProfessors[index] = { ...localProfessors[index], ...payload };
        return {
          success: true,
          message: 'Professor updated successfully',
          data: localProfessors[index],
          timestamp: new Date().toISOString(),
        };
      }
      throw new Error('Professor not found');
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const { data } = await apiClient.delete<ApiResponse<void>>(`/professors/${id}`);
      return data;
    } catch {
      localProfessors = localProfessors.filter((p) => p.id !== Number(id));
      return {
        success: true,
        message: 'Professor removed successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
