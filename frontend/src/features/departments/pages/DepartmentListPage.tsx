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
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  AccountBalance as DeptIcon,
  Person as HodIcon,
  CalendarToday as DateIcon
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { departmentService } from '@/services/departmentService';
import { Department } from '@/types';
import toast from 'react-hot-toast';

export const DepartmentListPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    hodName: '',
  });

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getAll();
      if (res.data) {
        setDepartments(res.data.content);
      }
    } catch {
      toast.error('Failed to load departments');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Department code and name are required');
      return;
    }
    try {
      await departmentService.create(formData);
      toast.success('Department created successfully');
      setDialogOpen(false);
      setFormData({ code: '', name: '', description: '', hodName: '' });
      fetchDepartments();
    } catch (err: any) {
      toast.error(err.message || 'Error creating department');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Academic Departments"
        subtitle="Manage academic departments, faculty allocations, HOD leadership, and curriculums."
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
            Add Department
          </Button>
        }
      />

      <Grid container spacing={3}>
        {departments.map((dept) => (
          <Grid item xs={12} md={6} lg={4} key={dept.id}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 'var(--shadow-md)',
                  borderColor: 'var(--primary-light)',
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DeptIcon />
                  </Box>
                  <Chip
                    label={dept.code}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 1 }}>
                  {dept.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 2.5, minHeight: 40 }}>
                  {dept.description || 'Dedicated to advancing rigorous education, pioneering research, and industry collaborations.'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '10px', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HodIcon sx={{ fontSize: 16, color: 'var(--primary)' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      HOD: {dept.hodName || 'Dr. Ananya Sharma'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateIcon sx={{ fontSize: 16, color: 'var(--text-muted)' }} />
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                      Est: {dept.establishedDate || '1998-08-15'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Enrolled Capacity</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>450 / 500 (90%)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={90} sx={{ height: 6, borderRadius: 3, mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label="ACTIVE" size="small" color="success" sx={{ height: 20, fontSize: '10px' }} />
                  <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 600 }}>
                    4 Active Programs
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Department Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreate}>
          <DialogTitle sx={{ fontWeight: 700 }}>Add Academic Department</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Code"
                  placeholder="e.g. CSE"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  size="small"
                  label="Department Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Head of Department (HOD)"
                  value={formData.hodName}
                  onChange={(e) => setFormData({ ...formData, hodName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  label="Department Description & Objectives"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}>
              Create Department
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};


