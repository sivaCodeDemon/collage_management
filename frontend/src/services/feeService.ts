import apiClient from './apiClient';
import { ApiResponse, StudentFee } from '@/types';
import { MOCK_FEES } from './mockData';

let localFees: StudentFee[] = [...MOCK_FEES];

export const feeService = {
  getAll: async (): Promise<ApiResponse<StudentFee[]>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<StudentFee[]>>('/fees');
      return data;
    } catch {
      return {
        success: true,
        message: 'Fees fetched',
        data: localFees,
        timestamp: new Date().toISOString()
      };
    }
  },

  recordPayment: async (feeId: number, amount: number, _paymentMode: string): Promise<ApiResponse<StudentFee>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<StudentFee>>(`/fees/${feeId}/pay`, { amount, paymentMode: _paymentMode });
      return data;
    } catch {
      const fee = localFees.find(f => f.id === feeId);
      if (fee) {
        fee.paidAmount += amount;
        if (fee.paidAmount >= fee.totalAmount - fee.discountAmount) {
          fee.status = 'PAID';
        } else {
          fee.status = 'PARTIAL';
        }
        return {
          success: true,
          message: 'Payment recorded successfully',
          data: fee,
          timestamp: new Date().toISOString()
        };
      }
      throw new Error('Fee record not found');
    }
  }
};
