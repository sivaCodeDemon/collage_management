import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  AssignmentTurnedIn as ExamIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MOCK_EXAMS, MOCK_STUDENT_RESULTS } from '@/services/mockData';
import toast from 'react-hot-toast';

export const ExaminationPage: React.FC = () => {
  const [exams, setExams] = useState(MOCK_EXAMS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '10:00 AM - 12:00 PM',
    hall: 'Block A, Hall 1',
    totalMarks: 50,
    passMarks: 20,
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      toast.error('Please fill exam details');
      return;
    }
    const newExam = {
      id: Date.now(),
      ...formData,
    };
    setExams([...exams, newExam]);
    toast.success('Exam schedule published');
    setDialogOpen(false);
  };

  return (
    <Box>
      <PageHeader
        title="Examinations & Grading"
        subtitle="Manage semester examination schedules, hall allocations, marks evaluation, and student transcripts."
        action={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{ textTransform: 'none', borderRadius: '10px' }}
            >
              Print Transcript
            </Button>
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
              Schedule Examination
            </Button>
          </Box>
        }
      />

      {/* Exam Schedules Grid */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 2 }}>
        Upcoming Examination Schedule (Spring Term 2026)
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {exams.map((exam) => (
          <Grid item xs={12} sm={6} md={3} key={exam.id}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Chip label="OFFICIAL" size="small" color="primary" sx={{ fontSize: '10px', height: 20 }} />
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                    Max: {exam.totalMarks} Marks
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 1 }}>
                  {exam.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--primary)', fontWeight: 600, mb: 0.5 }}>
                  Date: {exam.date}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>
                  Time: {exam.time}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>
                  Venue: {exam.hall}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Min Passing: {exam.passMarks}</Typography>
                <Chip label="SCHEDULED" size="small" sx={{ fontSize: '10px', height: 18 }} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Grade Card & Transcript Evaluation Table */}
      <Card
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)' }}>
              Semester Grade Transcript Sample (Student: Arjun Kapoor - STU-2023-001)
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
              Cumulative Grade Point Average (CGPA): 9.35 / 10.0 • Total Credits: 15 Earned
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => toast.success('Grade sheet downloaded as PDF')}
            sx={{ textTransform: 'none', color: 'var(--primary)' }}
          >
            Download PDF
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <TableCell sx={{ fontWeight: 600 }}>Subject Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Course Module</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Credits</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Marks Scored</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Grade Letter</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Grade Point</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MOCK_STUDENT_RESULTS.map((row) => (
                <TableRow key={row.code} hover>
                  <TableCell sx={{ fontWeight: 600, color: 'var(--primary)' }}>{row.code}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.subject}</TableCell>
                  <TableCell>{row.credits}</TableCell>
                  <TableCell>{row.marks} / 100</TableCell>
                  <TableCell>
                    <Chip label={row.grade} size="small" color="primary" sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell>{row.gradePoint}.0</TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Schedule Exam Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateExam}>
          <DialogTitle sx={{ fontWeight: 700 }}>Schedule New Examination</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Examination Title"
                  required
                  placeholder="e.g. End-Term Exam - Distributed Systems"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Exam Date"
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Session Timing"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Hall / Room"
                  value={formData.hall}
                  onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Max Marks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Pass Marks"
                  type="number"
                  value={formData.passMarks}
                  onChange={(e) => setFormData({ ...formData, passMarks: Number(e.target.value) })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}>
              Publish Schedule
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};


