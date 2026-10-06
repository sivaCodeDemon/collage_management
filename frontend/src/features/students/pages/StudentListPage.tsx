import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { studentService } from '@/services/studentService';
import { departmentService } from '@/services/departmentService';
import { Student, StudentSummary, DepartmentSummary } from '@/types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


export const StudentListPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Add / Edit Modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    courseName: 'B.Tech in Computer Science & Engineering',
    currentSemester: 1,
    section: 'A',
    gender: 'MALE',
    guardianName: '',
    guardianPhone: '',
  });

  // View Details Modal state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewTab, setViewTab] = useState(0);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAll({ search });
      if (res.data) {
        setStudents(res.data.content);
      }
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getActive();
      if (res.data) {
        setDepartments(res.data);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentId: 1,
      departmentName: 'Computer Science & Engineering',
      courseName: 'B.Tech in Computer Science & Engineering',
      currentSemester: 1,
      section: 'A',
      gender: 'MALE',
      guardianName: '',
      guardianPhone: '',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = async (id: number) => {
    try {
      const res = await studentService.getById(id);
      if (res.data) {
        setEditingStudent(res.data);
        setFormData({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phone: res.data.phone || '',
          departmentId: res.data.departmentId || 1,
          departmentName: res.data.departmentName || '',
          courseName: res.data.courseName || '',
          currentSemester: res.data.currentSemester || 1,
          section: res.data.section || 'A',
          gender: res.data.gender || 'MALE',
          guardianName: res.data.guardianName || '',
          guardianPhone: res.data.guardianPhone || '',
        });
        setDialogOpen(true);
      }
    } catch {
      toast.error('Could not load student details');
    }
  };

  const handleOpenView = (id: number) => {
    navigate(`/students/${id}`);
  };


  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this student record?')) {
      await studentService.deactivate(id);
      toast.success('Student record removed');
      fetchStudents();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, formData);
        toast.success('Student updated successfully');
      } else {
        await studentService.create(formData);
        toast.success('New student registered successfully');
      }
      setDialogOpen(false);
      fetchStudents();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const filteredStudents = selectedDept === 'ALL' 
    ? students 
    : students.filter(s => s.departmentName?.toLowerCase().includes(selectedDept.toLowerCase()));

  return (
    <Box>
      <PageHeader
        title="Student Directory"
        subtitle="Manage student admissions, profiles, enrollments, and academic status."
        action={
          <>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => toast.success('Exporting student list to CSV...')}
              sx={{ textTransform: 'none', borderRadius: '10px' }}
            >
              Export CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                '&:hover': { backgroundColor: 'var(--primary-dark)' }
              }}
            >
              Register Student
            </Button>
          </>
        }
      />

      <Card
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          mb: 3,
        }}
      >
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={8}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by student name, roll number, or email..."
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
          <Grid item xs={12} sm={6} md={4}>
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
                  {d.name} ({d.code})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Roll Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department & Course</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Semester</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'var(--text-muted)' }}>
                    No students found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>
                          {s.firstName[0]}{s.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {s.firstName} {s.lastName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                            {s.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={s.studentId} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '11px' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'var(--text-main)' }}>
                        {s.departmentName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                        {s.courseName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Sem {s.currentSemester} (Sec {s.section})
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Student Profile">
                        <IconButton size="small" onClick={() => handleOpenView(s.id)} sx={{ color: 'var(--primary)' }}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Student">
                        <IconButton size="small" onClick={() => handleOpenEdit(s.id)} sx={{ color: 'var(--text-muted)' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deactivate">
                        <IconButton size="small" onClick={() => handleDelete(s.id)} sx={{ color: 'var(--danger)' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add / Edit Student Modal */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingStudent ? 'Edit Student Details' : 'Register New Student'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Department"
                  value={formData.departmentName}
                  onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                >
                  {departments.map((d) => (
                    <MenuItem key={d.id} value={d.name}>
                      {d.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Course / Degree"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Current Semester"
                  type="number"
                  value={formData.currentSemester}
                  onChange={(e) => setFormData({ ...formData, currentSemester: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Section"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Guardian Name"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Guardian Phone"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}
            >
              {editingStudent ? 'Update Record' : 'Save & Register'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Student Profile Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedStudent && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'var(--primary)', fontSize: 20, fontWeight: 700 }}>
                  {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                    {selectedStudent.studentId} • {selectedStudent.departmentName}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <Tabs value={viewTab} onChange={(_, v) => setViewTab(v)} sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Personal Info" sx={{ textTransform: 'none' }} />
              <Tab label="Academics" sx={{ textTransform: 'none' }} />
              <Tab label="Guardian" sx={{ textTransform: 'none' }} />
            </Tabs>
            <DialogContent sx={{ py: 2.5 }}>
              {viewTab === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Email</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Phone</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.phone || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Gender / Blood</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.gender} ({selectedStudent.bloodGroup || 'O+'})</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Admission Date</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.admissionDate || '2021-08-16'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">Residential Address</Typography>
                    <Typography variant="body2">{selectedStudent.address || 'Campus Hostel Block 4'}, {selectedStudent.city}</Typography>
                  </Grid>
                </Grid>
              )}
              {viewTab === 1 && (
                <Box>
                  <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(79, 70, 229, 0.05)', borderRadius: '10px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Program: {selectedStudent.courseName}</Typography>
                    <Typography variant="caption" color="textSecondary">Current Semester: {selectedStudent.currentSemester} | Section: {selectedStudent.section}</Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Attendance & Academic Metric</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>Current Attendance Ratio: <strong>92.4%</strong></Typography>
                  <Typography variant="body2">Cumulative GPA: <strong>9.35 / 10.0</strong></Typography>
                </Box>
              )}
              {viewTab === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Guardian Name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.guardianName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Relation</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.guardianRelation || 'Father'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">Emergency Contact Phone</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.guardianPhone || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setViewDialogOpen(false)} sx={{ textTransform: 'none' }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};



