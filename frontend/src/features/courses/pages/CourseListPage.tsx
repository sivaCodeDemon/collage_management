import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Add as AddIcon, MenuBook as CourseIcon } from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { courseService } from '@/services/courseService';
import { Course } from '@/types';
import toast from 'react-hot-toast';

export const CourseListPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    departmentName: 'Computer Science & Engineering',
    durationYears: 4,
    totalSemesters: 8,
    description: '',
  });

  const fetchCourses = async () => {
    try {
      const res = await courseService.getAll();
      if (res.data) {
        setCourses(res.data.content);
      }
    } catch {
      toast.error('Failed to load courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Course code and title are required');
      return;
    }
    try {
      await courseService.create(formData);
      toast.success('Course program registered');
      setDialogOpen(false);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || 'Error creating course');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Curriculum & Programs"
        subtitle="Degree programs, credit schemas, semesters, and course syllabus tracks."
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
            Add Degree Program
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
                <TableCell sx={{ fontWeight: 600 }}>Program Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Degree Program Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Semesters</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell>
                    <Chip label={course.code} size="small" variant="outlined" sx={{ fontWeight: 700, color: 'var(--primary)' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {course.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                      {course.description || 'Full-time curriculum program'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{course.departmentName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{course.durationYears} Years</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{course.totalSemesters} Semesters</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label="ACTIVE" size="small" color="success" sx={{ height: 22, fontSize: '11px', fontWeight: 600 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Course Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreate}>
          <DialogTitle sx={{ fontWeight: 700 }}>Add Degree Program</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Program Code"
                  placeholder="e.g. BTECH-CSE"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  size="small"
                  label="Course Title"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Department"
                  value={formData.departmentName}
                  onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Duration (Years)"
                  type="number"
                  value={formData.durationYears}
                  onChange={(e) => setFormData({ ...formData, durationYears: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Total Semesters"
                  type="number"
                  value={formData.totalSemesters}
                  onChange={(e) => setFormData({ ...formData, totalSemesters: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  label="Curriculum Overview"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}>
              Save Program
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};


