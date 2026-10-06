import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  ButtonGroup
} from '@mui/material';
import {
  CheckCircleOutline,
  HighlightOff,
  AccessTime,
  DoneAll as DoneAllIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { attendanceService } from '@/services/attendanceService';
import { AttendanceRecord } from '@/types';
import toast from 'react-hot-toast';

export const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subject, setSubject] = useState('Distributed Systems (CS601)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchAttendance = async () => {
    try {
      const res = await attendanceService.getAttendance();
      if (res.data) {
        setRecords(res.data);
      }
    } catch {
      toast.error('Failed to load attendance roster');
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleStatusChange = (id: number, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleMarkAllPresent = () => {
    setRecords((prev) => prev.map((r) => ({ ...r, status: 'PRESENT' })));
    toast.success('Marked all students as PRESENT');
  };

  const handleSave = async () => {
    try {
      await attendanceService.markAttendance(records);
      toast.success('Attendance submitted and synced with academic database');
    } catch {
      toast.error('Failed to record attendance');
    }
  };

  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;
  const lateCount = records.filter((r) => r.status === 'LATE').length;
  const totalCount = records.length || 1;
  const attendanceRate = Math.round(((presentCount + lateCount) / totalCount) * 100);

  return (
    <Box>
      <PageHeader
        title="Attendance Management"
        subtitle="Record, audit, and analyze daily classroom lecture attendance rosters."
        action={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllPresent}
              sx={{ textTransform: 'none', borderRadius: '10px' }}
            >
              Mark All Present
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                '&:hover': { backgroundColor: 'var(--primary-dark)' }
              }}
            >
              Submit Attendance
            </Button>
          </Box>
        }
      />

      {/* Roster Controls & Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Subject / Module"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                >
                  <MenuItem value="Distributed Systems (CS601)">Distributed Systems (CS601)</MenuItem>
                  <MenuItem value="Machine Learning (CS602)">Machine Learning (CS602)</MenuItem>
                  <MenuItem value="Compiler Design (CS604)">Compiler Design (CS604)</MenuItem>
                  <MenuItem value="Cloud Computing Lab (CS603L)">Cloud Computing Lab (CS603L)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Lecture Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Live Attendance Counter */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>PRESENT</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#16a34a' }}>{presentCount}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>ABSENT</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#dc2626' }}>{absentCount}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>LATE</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#d97706' }}>{lateCount}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>RATE</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--primary)' }}>{attendanceRate}%</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Roster Table */}
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
                <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status Marking</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Chip label={r.studentCode} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'var(--primary)', fontSize: 12, fontWeight: 600 }}>
                        {r.studentName[0]}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {r.studentName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{r.subjectName}</Typography>
                  </TableCell>
                  <TableCell>
                    <ButtonGroup size="small" variant="outlined">
                      <Button
                        onClick={() => handleStatusChange(r.id, 'PRESENT')}
                        sx={{
                          textTransform: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: r.status === 'PRESENT' ? '#22c55e' : 'transparent',
                          color: r.status === 'PRESENT' ? '#ffffff' : '#16a34a',
                          borderColor: '#22c55e',
                          '&:hover': { backgroundColor: '#16a34a', color: '#fff' }
                        }}
                      >
                        Present
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(r.id, 'ABSENT')}
                        sx={{
                          textTransform: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: r.status === 'ABSENT' ? '#ef4444' : 'transparent',
                          color: r.status === 'ABSENT' ? '#ffffff' : '#dc2626',
                          borderColor: '#ef4444',
                          '&:hover': { backgroundColor: '#dc2626', color: '#fff' }
                        }}
                      >
                        Absent
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(r.id, 'LATE')}
                        sx={{
                          textTransform: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: r.status === 'LATE' ? '#f59e0b' : 'transparent',
                          color: r.status === 'LATE' ? '#ffffff' : '#d97706',
                          borderColor: '#f59e0b',
                          '&:hover': { backgroundColor: '#d97706', color: '#fff' }
                        }}
                      >
                        Late
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                      {r.remarks || '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};


