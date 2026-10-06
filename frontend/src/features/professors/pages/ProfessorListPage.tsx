import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Delete as DeleteIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { professorService } from '@/services/professorService';
import { departmentService } from '@/services/departmentService';
import { Professor, DepartmentSummary } from '@/types';
import toast from 'react-hot-toast';

export const ProfessorListPage: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Add Professor modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Computer Science',
    specialization: 'Artificial Intelligence',
    experienceYears: 5,
  });

  const fetchData = async () => {
    try {
      const res = await professorService.getAll({ search });
      if (res.data) {
        // cast or map
        setProfessors(res.data.content as any);
      }
      const deptRes = await departmentService.getActive();
      if (deptRes.data) {
        setDepartments(deptRes.data);
      }
    } catch {
      toast.error('Failed to load faculty directory');
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please complete mandatory fields');
      return;
    }
    try {
      await professorService.create(formData);
      toast.success('Faculty member added successfully');
      setDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error adding professor');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this faculty record?')) {
      await professorService.delete(id);
      toast.success('Faculty member removed');
      fetchData();
    }
  };

  const filtered = selectedDept === 'ALL'
    ? professors
    : professors.filter(p => p.departmentName?.toLowerCase().includes(selectedDept.toLowerCase()));

  return (
    <Box>
      <PageHeader
        title="Faculty & Professors Directory"
        subtitle="Distinguished professors, associate faculty, department heads, and researchers."
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
            Add Faculty Member
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '16px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          mb: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search faculty by name, specialization, or employee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'var(--text-muted)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Department Filter"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            >
              <MenuItem value="ALL">All Departments</MenuItem>
              {departments.map((d) => (
                <MenuItem key={d.id} value={d.name}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Faculty Cards Grid */}
      <Grid container spacing={3}>
        {filtered.map((prof) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={prof.id}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 'var(--shadow-md)',
                  borderColor: 'var(--primary-light)',
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: 'var(--primary)',
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    {prof.firstName[0]}{prof.lastName[0]}
                  </Avatar>
                  <Tooltip title="Remove Faculty">
                    <IconButton size="small" onClick={() => handleDelete(prof.id)} sx={{ color: 'var(--text-muted)' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 0.3 }}>
                  {prof.firstName} {prof.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--primary)', fontWeight: 600, mb: 0.5 }}>
                  {prof.designation || 'Faculty Member'}
                </Typography>
                <Chip
                  label={prof.departmentName || 'Computer Science'}
                  size="small"
                  sx={{ mb: 2, fontSize: '11px', height: 22, backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)' }}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" noWrap>{prof.qualification || 'Doctorate'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">{prof.specialization || 'Distributed Systems'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" noWrap>{prof.email}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 2.5, pt: 1.5, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                  Exp: {prof.experienceYears || 10}+ Years
                </Typography>
                <Chip label="ACTIVE" size="small" color="success" sx={{ height: 20, fontSize: '10px', fontWeight: 600 }} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Faculty Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreate}>
          <DialogTitle sx={{ fontWeight: 700 }}>Add Faculty Member</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="College Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Department"
                  value={formData.departmentName}
                  onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                >
                  {departments.map((d) => (
                    <MenuItem key={d.id} value={d.name}>{d.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Academic Qualification"
                  placeholder="e.g. Ph.D. in Computer Science (IISc)"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  size="small"
                  label="Research / Specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Experience (Yrs)"
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}>
              Add Faculty
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};



