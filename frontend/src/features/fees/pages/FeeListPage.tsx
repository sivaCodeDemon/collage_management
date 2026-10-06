import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  CheckCircle,
  AccountBalanceWallet
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { feeService } from '@/services/feeService';
import { StudentFee } from '@/types';
import toast from 'react-hot-toast';

export const FeeListPage: React.FC = () => {
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState('UPI');

  // Receipt Modal
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastPayment, setLastPayment] = useState<any>(null);

  const fetchFees = async () => {
    try {
      const res = await feeService.getAll();
      if (res.data) {
        setFees(res.data);
      }
    } catch {
      toast.error('Failed to load fee ledger');
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleOpenPay = (fee: StudentFee) => {
    setSelectedFee(fee);
    const remaining = fee.totalAmount - fee.discountAmount - fee.paidAmount;
    setPayAmount(remaining > 0 ? remaining : 0);
    setPayDialogOpen(true);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee || payAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    try {
      const res = await feeService.recordPayment(selectedFee.id, payAmount, payMode);
      setPayDialogOpen(false);
      setLastPayment({
        receiptNo: `REC-${Date.now().toString().slice(-6)}`,
        studentName: selectedFee.studentName,
        studentCode: selectedFee.studentCode,
        amount: payAmount,
        mode: payMode,
        date: new Date().toLocaleDateString(),
      });
      setReceiptOpen(true);
      toast.success('Payment recorded successfully!');
      fetchFees();
    } catch (err: any) {
      toast.error(err.message || 'Payment processing failed');
    }
  };

  const totalBilled = fees.reduce((acc, f) => acc + f.totalAmount, 0);
  const totalCollected = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalOutstanding = totalBilled - totalCollected;

  return (
    <Box>
      <PageHeader
        title="Fee Management & Finance"
        subtitle="Manage student fee structures, tuition payments, installment collections, and audit receipts."
      />

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Billed"
            value={`$${(totalBilled / 1000).toFixed(0)}k`}
            icon={<AccountBalanceWallet />}
            iconBg="rgba(79, 70, 229, 0.12)"
            iconColor="#4f46e5"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Collected"
            value={`$${(totalCollected / 1000).toFixed(0)}k`}
            icon={<CheckCircle />}
            iconBg="rgba(34, 197, 94, 0.12)"
            iconColor="#16a34a"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Outstanding Balance"
            value={`$${(totalOutstanding / 1000).toFixed(0)}k`}
            icon={<ReceiptIcon />}
            iconBg="rgba(239, 68, 68, 0.12)"
            iconColor="#dc2626"
            isPositive={false}
          />
        </Grid>
      </Grid>

      {/* Fee Table */}
      <Card
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <TableCell sx={{ fontWeight: 600 }}>Roll Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Fee</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Paid Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Balance Due</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.map((fee) => {
                const balance = fee.totalAmount - fee.discountAmount - fee.paidAmount;
                return (
                  <TableRow key={fee.id} hover>
                    <TableCell>
                      <Chip label={fee.studentCode} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {fee.studentName}
                    </TableCell>
                    <TableCell>${fee.totalAmount.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#16a34a', fontWeight: 600 }}>${fee.paidAmount.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: balance > 0 ? '#dc2626' : 'var(--text-muted)', fontWeight: 600 }}>
                      ${balance.toLocaleString()}
                    </TableCell>
                    <TableCell>{fee.dueDate || '2026-10-31'}</TableCell>
                    <TableCell>
                      <StatusBadge status={fee.status} />
                    </TableCell>
                    <TableCell align="right">
                      {fee.status !== 'PAID' ? (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PaymentIcon />}
                          onClick={() => handleOpenPay(fee)}
                          sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                            backgroundColor: 'var(--primary)',
                            fontSize: '12px',
                          }}
                        >
                          Collect Fee
                        </Button>
                      ) : (
                        <Chip label="Fully Paid" color="success" size="small" variant="outlined" sx={{ fontSize: '11px' }} />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Record Payment Dialog */}
      <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)} maxWidth="xs" fullWidth>
        {selectedFee && (
          <form onSubmit={handleRecordPayment}>
            <DialogTitle sx={{ fontWeight: 700 }}>Record Fee Collection</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(79, 70, 229, 0.05)', borderRadius: '10px' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedFee.studentName}</Typography>
                <Typography variant="caption" color="textSecondary">{selectedFee.studentCode}</Typography>
              </Box>
              <TextField
                fullWidth
                size="small"
                label="Payment Amount ($)"
                type="number"
                required
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                fullWidth
                size="small"
                label="Payment Method"
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
              >
                <MenuItem value="UPI">UPI / Instant Pay</MenuItem>
                <MenuItem value="CARD">Credit / Debit Card</MenuItem>
                <MenuItem value="NET_BANKING">Net Banking</MenuItem>
                <MenuItem value="CASH">Cash Deposit</MenuItem>
                <MenuItem value="CHEQUE">Cheque / Demand Draft</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setPayDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
              <Button type="submit" variant="contained" sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}>
                Confirm & Issue Receipt
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>

      {/* Printable Receipt Modal */}
      <Dialog open={receiptOpen} onClose={() => setReceiptOpen(false)} maxWidth="xs" fullWidth>
        {lastPayment && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                color: '#16a34a',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <CheckCircle sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Payment Successful</Typography>
            <Typography variant="caption" color="textSecondary">Official Fee Receipt</Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="textSecondary">Receipt Number</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{lastPayment.receiptNo}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="textSecondary">Student</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{lastPayment.studentName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="textSecondary">Roll No</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{lastPayment.studentCode}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="textSecondary">Payment Mode</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{lastPayment.mode}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, p: 1.5, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total Paid</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#16a34a' }}>${lastPayment.amount.toLocaleString()}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => window.print()} sx={{ textTransform: 'none' }}>
                Print Receipt
              </Button>
              <Button fullWidth variant="contained" onClick={() => setReceiptOpen(false)} sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}>
                Done
              </Button>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};


