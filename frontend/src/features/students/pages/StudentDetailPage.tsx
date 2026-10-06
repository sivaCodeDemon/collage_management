import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  FamilyRestroom as FamilyIcon,
  ReceiptLong as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { studentService } from '@/services/studentService';
import { Student } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import toast from 'react-hot-toast';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Student>>({});

  useEffect(() => {
    if (!id) return;
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const response = await studentService.getById(Number(id));
        if (response?.data) {
          setStudent(response.data);
          setEditForm(response.data);
        } else {
          toast.error('Student not found');
        }
      } catch (err) {
        toast.error('Failed to load student details');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleEditSubmit = async () => {
    if (!student) return;
    try {
      const response = await studentService.update(student.id, editForm);
      if (response?.data) {
        setStudent(response.data);
        toast.success('Student details updated successfully');
        setEditDialogOpen(false);
      }
    } catch {
      toast.error('Failed to update student');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <LinearProgress sx={{ maxWidth: 400, mx: 'auto', mt: 4, borderRadius: 2 }} />
        <Typography sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>
          Loading student profile...
        </Typography>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Student Not Found
        </Typography>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/students')}>
          Back to Students
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top action bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/students')}
          sx={{ borderRadius: 2 }}
        >
          Back to Directory
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Tooltip title="Print Profile">
            <IconButton
              onClick={() => window.print()}
              sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
            >
              <PrintIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setEditForm(student);
              setEditDialogOpen(true);
            }}
            sx={{ borderRadius: 2 }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {/* Main Header Card */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 3
            }}
          >
            <Avatar
              src={student.profileImageUrl}
              sx={{
                width: 96,
                height: 96,
                fontSize: 36,
                fontWeight: 700,
                bgcolor: 'primary.main',
                boxShadow: '0 4px 14px rgba(37,99,235,0.25)'
              }}
            >
              {student.firstName[0]}
              {student.lastName[0]}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                  {student.firstName} {student.lastName}
                </Typography>
                <Chip
                  label={student.studentId}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700, borderRadius: 1.5 }}
                />
                <StatusBadge status={student.status} />
              </Box>

              <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500, mb: 2 }}>
                {student.courseName || 'B.Tech in Computer Science'} • Semester {student.currentSemester || 1} • Section {student.section || 'A'}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <EmailIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {student.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <PhoneIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {student.phone || '+91 98765 43210'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <SchoolIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {student.departmentName || 'Computer Science & Engineering'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal & Academic" sx={{ fontWeight: 600 }} />
            <Tab label="Attendance Record" sx={{ fontWeight: 600 }} />
            <Tab label="Academic Grades" sx={{ fontWeight: 600 }} />
            <Tab label="Fees & Invoices" sx={{ fontWeight: 600 }} />
          </Tabs>
        </Box>

        <CardContent sx={{ p: { xs: 2, md: 3.5 } }}>
          {/* TAB 0: Personal & Academic Info */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {/* Personal Details */}
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Personal Details
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.dateOfBirth || '15 Aug 2003'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.gender || 'MALE'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Blood Group</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.bloodGroup || 'O+'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Admission Date</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.admissionDate || '01 Aug 2023'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
                      {student.address || 'Hostel Block B, Room 204'}, {student.city || 'Metro City'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Guardian Details */}
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <FamilyIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Guardian & Contact
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Guardian Name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.guardianName || 'Dr. Robert Smith'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Relationship</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.guardianRelation || 'Father'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Guardian Phone</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.guardianPhone || '+91 98765 11223'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Department</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.departmentName || 'Computer Science'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Enrollment Status</Typography>
                    <Chip label="Regular Full-Time" color="success" size="small" sx={{ fontWeight: 600 }} />
                  </Box>
                </Box>
              </Paper>
            </Box>
          </TabPanel>

          {/* TAB 1: Attendance Record */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                  87.4%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Overall Attendance
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', mb: 0.5 }}>
                  146 / 167
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Classes Attended
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main', mb: 0.5 }}>
                  21
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Absences
                </Typography>
              </Paper>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Course / Subject</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Lectures</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Attended</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Percentage</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { subject: 'CS301 - Data Structures & Algorithms', total: 42, attended: 39, pct: '92.8%' },
                    { subject: 'CS302 - Database Management Systems', total: 38, attended: 34, pct: '89.4%' },
                    { subject: 'CS303 - Operating Systems', total: 40, attended: 32, pct: '80.0%' },
                    { subject: 'CS304 - Computer Networks', total: 47, attended: 41, pct: '87.2%' }
                  ].map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.subject}</TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell>{row.attended}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{row.pct}</TableCell>
                      <TableCell>
                        <Chip label="Eligible" size="small" color="success" sx={{ fontWeight: 600 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* TAB 2: Academic Grades */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', mb: 0.5 }}>
                  8.65
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Cumulative GPA (CGPA)
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                  8.90
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Current Semester GPA
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main', mb: 0.5 }}>
                  64 / 160
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Earned Credits
                </Typography>
              </Paper>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Subject Code & Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Credits</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Internal (40)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Final (60)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Grade</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { code: 'CS301', name: 'Data Structures & Algorithms', credits: 4, internal: 37, final: 54, grade: 'A+' },
                    { code: 'CS302', name: 'Database Management Systems', credits: 4, internal: 35, final: 50, grade: 'A' },
                    { code: 'CS303', name: 'Operating Systems', credits: 3, internal: 32, final: 46, grade: 'B+' },
                    { code: 'CS304', name: 'Computer Networks', credits: 4, internal: 36, final: 52, grade: 'A' },
                    { code: 'CS305', name: 'Full-Stack Web Lab', credits: 2, internal: 39, final: 58, grade: 'O' }
                  ].map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.code} - {row.name}</TableCell>
                      <TableCell>{row.credits}</TableCell>
                      <TableCell>{row.internal}</TableCell>
                      <TableCell>{row.final}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>{row.grade}</TableCell>
                      <TableCell>
                        <Chip label="PASS" size="small" color="success" sx={{ fontWeight: 600 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* TAB 3: Fees & Invoices */}
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                  $12,500
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Annual Tuition Fee
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', mb: 0.5 }}>
                  $12,500
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Total Paid
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', mb: 0.5 }}>
                  $0.00
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Outstanding Balance
                </Typography>
              </Paper>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Receipt #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Payment Method</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { rec: 'RCP-2026-091', desc: 'Semester 4 Tuition Fee', date: '10 Jan 2026', method: 'Online / Card', amt: '$6,250' },
                    { rec: 'RCP-2025-442', desc: 'Semester 3 Tuition Fee', date: '15 Jul 2025', method: 'Net Banking', amt: '$6,250' },
                    { rec: 'RCP-2025-118', desc: 'Hostel & Mess Dues', date: '01 Aug 2025', method: 'UPI / Direct', amt: '$1,800' }
                  ].map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{row.rec}</TableCell>
                      <TableCell>{row.desc}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.method}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{row.amt}</TableCell>
                      <TableCell>
                        <Chip icon={<CheckCircleIcon />} label="Paid" color="success" size="small" sx={{ fontWeight: 600 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Student Profile</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="First Name"
              value={editForm.firstName || ''}
              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={editForm.lastName || ''}
              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              fullWidth
            />
          </Box>
          <TextField
            label="Email Address"
            type="email"
            value={editForm.email || ''}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Phone Number"
            value={editForm.phone || ''}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            fullWidth
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              select
              label="Gender"
              value={editForm.gender || 'MALE'}
              onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
              fullWidth
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              value={editForm.status || 'ACTIVE'}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              fullWidth
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="SUSPENDED">Suspended</MenuItem>
              <MenuItem value="GRADUATED">Graduated</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Current Semester"
              type="number"
              value={editForm.currentSemester || 1}
              onChange={(e) => setEditForm({ ...editForm, currentSemester: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Section"
              value={editForm.section || 'A'}
              onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
              fullWidth
            />
          </Box>
          <TextField
            label="Address"
            value={editForm.address || ''}
            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            fullWidth
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Guardian Name"
              value={editForm.guardianName || ''}
              onChange={(e) => setEditForm({ ...editForm, guardianName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Guardian Phone"
              value={editForm.guardianPhone || ''}
              onChange={(e) => setEditForm({ ...editForm, guardianPhone: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
