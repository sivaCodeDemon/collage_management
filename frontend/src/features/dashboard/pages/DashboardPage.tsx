import React from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  PeopleAltOutlined as StudentsIcon,
  BadgeOutlined as FacultyIcon,
  FactCheckOutlined as AttendanceIcon,
  AccountBalanceWalletOutlined as FeesIcon,
  ArrowForward as ArrowForwardIcon,
  AssignmentTurnedIn as TaskIcon,
  EventNote as EventIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MOCK_NOTICES, MOCK_TIMETABLE, MOCK_STUDENT_RESULTS } from '@/services/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const ENROLLMENT_DATA = [
  { year: '2021', students: 1850, graduated: 420 },
  { year: '2022', students: 2100, graduated: 480 },
  { year: '2023', students: 2350, graduated: 510 },
  { year: '2024', students: 2600, graduated: 560 },
  { year: '2025', students: 2750, graduated: 610 },
  { year: '2026', students: 2840, graduated: 640 },
];

const DEPT_DISTRIBUTION = [
  { name: 'Computer Science', value: 920, color: '#4f46e5' },
  { name: 'Electronics & Comm.', value: 680, color: '#06b6d4' },
  { name: 'Mechanical', value: 450, color: '#f59e0b' },
  { name: 'Civil Engg', value: 390, color: '#10b981' },
  { name: 'School of Mgmt', value: 400, color: '#8b5cf6' },
];

const WEEKLY_ATTENDANCE = [
  { day: 'Mon', rate: 94 },
  { day: 'Tue', rate: 91 },
  { day: 'Wed', rate: 89 },
  { day: 'Thu', rate: 87 },
  { day: 'Fri', rate: 84 },
  { day: 'Sat', rate: 80 },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const primaryRole = user?.roles[0] || 'STUDENT';
  const isStudent = primaryRole === 'STUDENT';
  const isProfessor = primaryRole === 'PROFESSOR';

  return (
    <Box>
      {/* Welcome Banner */}
      <Card
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mb: 3.5,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(49, 46, 129, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              Welcome back, {user?.fullName || 'User'}!
            </Typography>
            <Chip
              label={primaryRole}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '11px',
                backdropFilter: 'blur(4px)',
              }}
            />
          </Box>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: 650, mb: 2.5 }}>
            {isStudent
              ? 'You are enrolled in B.Tech Computer Science (Sem 6). Your academic standing is Outstanding.'
              : isProfessor
              ? 'You have 3 lecture sessions scheduled today. Mid-term exam question papers are due for submission.'
              : 'Apex Institute campus operations are functioning normally. All departments and academic schedules are on track.'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(isStudent ? '/timetable' : isProfessor ? '/attendance' : '/students')}
              sx={{
                backgroundColor: '#ffffff',
                color: '#1e1b4b',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '10px',
                px: 2.5,
                '&:hover': { backgroundColor: '#f1f5f9' },
              }}
            >
              {isStudent ? 'View Today Schedule' : isProfessor ? 'Take Attendance' : 'Manage Students'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/notices')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '10px',
                px: 2.5,
                '&:hover': { borderColor: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.08)' },
              }}
            >
              Notice Board
            </Button>
          </Box>
        </Box>
      </Card>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value="2,840"
            change="+12.4%"
            isPositive={true}
            icon={<StudentsIcon />}
            iconBg="rgba(79, 70, 229, 0.12)"
            iconColor="#4f46e5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Teaching Faculty"
            value="164"
            change="+4.2%"
            isPositive={true}
            icon={<FacultyIcon />}
            iconBg="rgba(6, 182, 212, 0.12)"
            iconColor="#0891b2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Attendance"
            value="89.2%"
            change="+2.1%"
            isPositive={true}
            icon={<AttendanceIcon />}
            iconBg="rgba(34, 197, 94, 0.12)"
            iconColor="#16a34a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Fee Collection"
            value="$1.84M"
            change="+8.5%"
            isPositive={true}
            icon={<FeesIcon />}
            iconBg="rgba(245, 158, 11, 0.12)"
            iconColor="#d97706"
          />
        </Grid>
      </Grid>

      {/* Student View Specific Section */}
      {isStudent && (
        <Grid container spacing={3} sx={{ mb: 3.5 }}>
          <Grid item xs={12} md={7}>
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
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  Current Semester Academic Grades (SGPA: 9.35)
                </Typography>
                <Chip label="Outstanding" color="success" size="small" />
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Credits</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Grade</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MOCK_STUDENT_RESULTS.map((row) => (
                      <TableRow key={row.code}>
                        <TableCell sx={{ fontWeight: 600, color: 'var(--primary)' }}>{row.code}</TableCell>
                        <TableCell>{row.subject}</TableCell>
                        <TableCell>{row.credits}</TableCell>
                        <TableCell>
                          <Chip label={row.grade} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={row.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 2 }}>
                Attendance Requirement
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>Aggregate Attendance</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#16a34a' }}>92.4% (Eligible)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={92.4} sx={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(34, 197, 94, 0.2)', '& .MuiLinearProgress-bar': { backgroundColor: '#22c55e' } }} />
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', mt: 0.5, display: 'block' }}>
                  Minimum 75% required to sit for final semester examinations.
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 1.5 }}>
                Today's Class Schedule
              </Typography>
              <List disablePadding>
                {MOCK_TIMETABLE.slice(0, 3).map((item, idx) => (
                  <ListItem key={idx} disableGutters sx={{ py: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)', mr: 2 }} />
                    <ListItemText
                      primary={item.subject}
                      secondary={`${item.time} • ${item.room} (${item.faculty})`}
                      primaryTypographyProps={{ fontSize: '13px', fontWeight: 600 }}
                      secondaryTypographyProps={{ fontSize: '11px' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Enrollment Trend */}
        <Grid item xs={12} lg={8}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  Student Enrollment & Graduation Velocity
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                  6-Year longitudinal student strength trajectory
                </Typography>
              </Box>
              <Chip label="Academic Year 2025-26" size="small" variant="outlined" />
            </Box>

            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ENROLLMENT_DATA}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="students"
                    name="Enrolled Students"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                  />
                  <Area
                    type="monotone"
                    dataKey="graduated"
                    name="Degrees Awarded"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Department Distribution */}
        <Grid item xs={12} lg={4}>
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
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 0.5 }}>
                Department Distribution
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                Active students by faculty division
              </Typography>
            </Box>

            <Box sx={{ width: '100%', height: 240, my: 'auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEPT_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {DEPT_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {DEPT_DISTRIBUTION.map((d) => (
                <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px', color: 'var(--text-muted)' }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: d.color }} />
                  {d.name}
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Grid: Notices and Weekly Attendance */}
      <Grid container spacing={3}>
        {/* Recent Notices */}
        <Grid item xs={12} md={7}>
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
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)' }}>
                Campus Notices & Announcements
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/notices')}
                sx={{ textTransform: 'none', color: 'var(--primary)' }}
              >
                View All
              </Button>
            </Box>

            <List disablePadding>
              {MOCK_NOTICES.slice(0, 3).map((notice, index) => (
                <React.Fragment key={notice.id}>
                  {index > 0 && <Divider sx={{ my: 1.5, borderColor: 'var(--border)' }} />}
                  <ListItem disableGutters alignItems="flex-start">
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      <Chip
                        label={notice.priority}
                        size="small"
                        color={notice.priority === 'HIGH' ? 'error' : 'info'}
                        sx={{ fontSize: '10px', height: '20px', fontWeight: 600 }}
                      />
                    </Box>
                    <ListItemText
                      primary={notice.title}
                      secondary={notice.content}
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        mb: 0.5,
                      }}
                      secondaryTypographyProps={{
                        fontSize: '12.5px',
                        color: 'var(--text-muted)',
                        noWrap: true,
                      }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Weekly Attendance Heatmap / Bar */}
        <Grid item xs={12} md={5}>
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
                  Weekly Attendance Ratio
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                  Monday through Saturday averages
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: '100%', height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_ATTENDANCE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis domain={[60, 100]} stroke="var(--text-muted)" fontSize={12} />
                  <RechartsTooltip />
                  <Bar dataKey="rate" name="Attendance %" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};


