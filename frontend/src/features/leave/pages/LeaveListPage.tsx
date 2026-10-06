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
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  EventBusy
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { leaveService } from '@/services/leaveService';
import { LeaveRequest } from '@/types';
import toast from 'react-hot-toast';

export const LeaveListPage: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'CASUAL_LEAVE',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    totalDays: 1,
    reason: '',
  });

  const fetchLeaves = async () => {
    try {
      const res = await leaveService.getAll();
      if (res.data) {
        setLeaves(res.data);
      }
    } catch {
      toast.error('Failed to load leave requests');
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason) {
      toast.error('Please specify reason for leave');
      return;
    }
    try {
      await leaveService.apply({
        ...formData,
        applicantName: 'Current User',
      });
      toast.success('Leave application submitted for approval');
      setDialogOpen(false);
      setFormData({
        leaveType: 'CASUAL_LEAVE',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        totalDays: 1,
        reason: '',
      });
      fetchLeaves();
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    }
  };

  const handleStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await leaveService.updateStatus(id, status);
      toast.success(`Leave request ${status.toLowerCase()}`);
      fetchLeaves();
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Leave Management Workflow"
        subtitle="Submit, review, and approve staff and student absence applications."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              '&:hover': { backgroundColor: 'var(--primary-dark)' }
            }}
          >
            Apply for Leave
          </Button>
        }
      />

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
                <TableCell sx={{ fontWeight: 600 }}>Applicant</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Leave Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration / Dates</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Approvals</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.map((l) => (
                <TableRow key={l.id} hover>
                  <TableCell sx={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {l.applicantName}
                  </TableCell>
                  <TableCell>
                    <Chip label={l.leaveType.replace('_', ' ')} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '11px' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{l.startDate} to {l.endDate}</Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{l.totalDays} Day(s)</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 280 }}>{l.reason}</Typography>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={l.status} />
                  </TableCell>
                  <TableCell align="right">
                    {l.status === 'PENDING' ? (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          startIcon={<ApproveIcon />}
                          onClick={() => handleStatus(l.id, 'APPROVED')}
                          sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '12px' }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<RejectIcon />}
                          onClick={() => handleStatus(l.id, 'REJECTED')}
                          sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '12px' }}
                        >
                          Reject
                        </Button>
                      </Box>
                    ) : (
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                        {l.approvedByName || 'Processed'}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Apply Leave Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleApply}>
          <DialogTitle sx={{ fontWeight: 700 }}>Submit Leave Application</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Leave Type"
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                >
                  <MenuItem value="CASUAL_LEAVE">Casual Leave</MenuItem>
                  <MenuItem value="MEDICAL_LEAVE">Medical Leave</MenuItem>
                  <MenuItem value="CONFERENCE_LEAVE">Conference / Duty Leave</MenuItem>
                  <MenuItem value="ACADEMIC_LEAVE">Academic Research Leave</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Total Number of Days"
                  type="number"
                  value={formData.totalDays}
                  onChange={(e) => setFormData({ ...formData, totalDays: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  label="Detailed Reason & Academic Arrangements"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}>
              Submit Application
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};


