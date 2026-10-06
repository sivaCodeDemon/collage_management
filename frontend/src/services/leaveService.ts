import apiClient from './apiClient';
import { ApiResponse, LeaveRequest } from '@/types';
import { MOCK_LEAVES } from './mockData';

let localLeaves: LeaveRequest[] = [...MOCK_LEAVES];

export const leaveService = {
  getAll: async (): Promise<ApiResponse<LeaveRequest[]>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<LeaveRequest[]>>('/leaves');
      return data;
    } catch {
      return {
        success: true,
        message: 'Leave requests fetched',
        data: localLeaves,
        timestamp: new Date().toISOString()
      };
    }
  },

  apply: async (payload: Partial<LeaveRequest>): Promise<ApiResponse<LeaveRequest>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<LeaveRequest>>('/leaves', payload);
      return data;
    } catch {
      const newLeave: LeaveRequest = {
        id: Date.now(),
        applicantUserId: payload.applicantUserId || 5,
        applicantName: payload.applicantName || 'Current User',
        leaveType: payload.leaveType || 'CASUAL_LEAVE',
        startDate: payload.startDate || new Date().toISOString().split('T')[0],
        endDate: payload.endDate || new Date().toISOString().split('T')[0],
        totalDays: payload.totalDays || 1,
        reason: payload.reason || '',
        status: 'PENDING',
        appliedAt: new Date().toISOString()
      };
      localLeaves.unshift(newLeave);
      return {
        success: true,
        message: 'Leave request submitted successfully',
        data: newLeave,
        timestamp: new Date().toISOString()
      };
    }
  },

  updateStatus: async (id: number, status: 'APPROVED' | 'REJECTED'): Promise<ApiResponse<LeaveRequest>> => {
    try {
      const { data } = await apiClient.put<ApiResponse<LeaveRequest>>(`/leaves/${id}/status`, { status });
      return data;
    } catch {
      const leave = localLeaves.find(l => l.id === id);
      if (leave) {
        leave.status = status;
        leave.approvedAt = new Date().toISOString();
        leave.approvedByName = 'Admin Approver';
        return {
          success: true,
          message: `Leave ${status.toLowerCase()} successfully`,
          data: leave,
          timestamp: new Date().toISOString()
        };
      }
      throw new Error('Leave request not found');
    }
  }
};
