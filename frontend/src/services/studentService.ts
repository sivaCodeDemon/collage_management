import apiClient from './apiClient';
import { ApiResponse, PageResponse, Student, StudentSummary, PaginationParams } from '@/types';
import { MOCK_STUDENTS } from './mockData';

let localStudents: Student[] = [...MOCK_STUDENTS];

export const studentService = {
  getAll: async (params: PaginationParams = {}): Promise<ApiResponse<PageResponse<StudentSummary>>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<PageResponse<StudentSummary>>>('/students', { params });
      return data;
    } catch {
      let filtered = [...localStudents];
      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.firstName.toLowerCase().includes(query) ||
            s.lastName.toLowerCase().includes(query) ||
            s.studentId.toLowerCase().includes(query) ||
            s.email.toLowerCase().includes(query)
        );
      }
      const page = params.page || 0;
      const size = params.size || 10;
      const start = page * size;
      const paginated = filtered.slice(start, start + size).map((s) => ({
        id: s.id,
        studentId: s.studentId,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        departmentName: s.departmentName,
        courseName: s.courseName,
        currentSemester: s.currentSemester,
        section: s.section,
        status: s.status,
      }));

      return {
        success: true,
        message: 'Students fetched successfully',
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

  getById: async (id: number): Promise<ApiResponse<Student>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<Student>>(`/students/${id}`);
      return data;
    } catch {
      const student = localStudents.find((s) => s.id === Number(id)) || localStudents[0];
      return {
        success: true,
        message: 'Student retrieved',
        data: student,
        timestamp: new Date().toISOString(),
      };
    }
  },

  create: async (payload: Partial<Student>): Promise<ApiResponse<Student>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<Student>>('/students', payload);
      return data;
    } catch {
      const newStudent: Student = {
        id: Date.now(),
        studentId: `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
        userId: Date.now(),
        firstName: payload.firstName || 'New',
        lastName: payload.lastName || 'Student',
        email: payload.email || 'student@college.edu',
        phone: payload.phone || '+91 99999 88888',
        departmentId: payload.departmentId || 1,
        departmentName: payload.departmentName || 'Computer Science & Engineering',
        courseId: payload.courseId || 1,
        courseName: payload.courseName || 'B.Tech in Computer Science',
        currentSemester: payload.currentSemester || 1,
        section: payload.section || 'A',
        status: 'ACTIVE',
        gender: payload.gender || 'OTHER',
        address: payload.address || 'Campus Hostel',
        city: payload.city || 'Metro City',
        createdAt: new Date().toISOString(),
        ...payload,
      };
      localStudents.unshift(newStudent);
      return {
        success: true,
        message: 'Student registered successfully',
        data: newStudent,
        timestamp: new Date().toISOString(),
      };
    }
  },

  update: async (id: number, payload: Partial<Student>): Promise<ApiResponse<Student>> => {
    try {
      const { data } = await apiClient.put<ApiResponse<Student>>(`/students/${id}`, payload);
      return data;
    } catch {
      const index = localStudents.findIndex((s) => s.id === Number(id));
      if (index !== -1) {
        localStudents[index] = { ...localStudents[index], ...payload };
        return {
          success: true,
          message: 'Student updated successfully',
          data: localStudents[index],
          timestamp: new Date().toISOString(),
        };
      }
      throw new Error('Student not found');
    }
  },

  deactivate: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const { data } = await apiClient.delete<ApiResponse<void>>(`/students/${id}`);
      return data;
    } catch {
      localStudents = localStudents.filter((s) => s.id !== Number(id));
      return {
        success: true,
        message: 'Student deleted successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
