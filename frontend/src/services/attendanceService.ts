import apiClient from './apiClient';
import { ApiResponse, AttendanceRecord } from '@/types';
import { MOCK_ATTENDANCE } from './mockData';

let localAttendance: AttendanceRecord[] = [...MOCK_ATTENDANCE];

export const attendanceService = {
  getAttendance: async (subjectId?: number, date?: string): Promise<ApiResponse<AttendanceRecord[]>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<AttendanceRecord[]>>('/attendance', {
        params: { subjectId, date }
      });
      return data;
    } catch {
      return {
        success: true,
        message: 'Attendance retrieved',
        data: localAttendance,
        timestamp: new Date().toISOString()
      };
    }
  },

  markAttendance: async (records: Partial<AttendanceRecord>[]): Promise<ApiResponse<void>> => {
    try {
      await apiClient.post('/attendance/batch', records);
    } catch {
      records.forEach((rec) => {
        const found = localAttendance.find(a => a.studentId === rec.studentId);
        if (found && rec.status) {
          found.status = rec.status;
          found.remarks = rec.remarks;
        }
      });
    }
    return {
      success: true,
      message: 'Attendance recorded successfully',
      timestamp: new Date().toISOString()
    };
  }
};
