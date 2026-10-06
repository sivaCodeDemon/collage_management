import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  DashboardOutlined as DashboardIcon,
  PeopleAltOutlined as StudentsIcon,
  BadgeOutlined as ProfessorsIcon,
  AccountBalanceOutlined as DepartmentsIcon,
  MenuBookOutlined as CoursesIcon,
  FactCheckOutlined as AttendanceIcon,
  AssignmentOutlined as ExamsIcon,
  ReceiptLongOutlined as FeesIcon,
  LocalLibraryOutlined as LibraryIcon,
  EventBusyOutlined as LeaveIcon,
  CalendarMonthOutlined as TimetableIcon,
  CampaignOutlined as NoticeIcon,
  BarChartOutlined as ReportsIcon,
  SecurityOutlined as AuditIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setSidebarCollapsed } from '@/store/uiSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 260;

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactElement;
  roles?: string[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { title: 'Students', path: '/students', icon: <StudentsIcon />, roles: ['SUPER_ADMIN', 'PRINCIPAL', 'ADMIN', 'PROFESSOR', 'HOD', 'ACCOUNTANT'] },
  { title: 'Faculty & Professors', path: '/professors', icon: <ProfessorsIcon />, roles: ['SUPER_ADMIN', 'PRINCIPAL', 'ADMIN', 'HOD'] },
  { title: 'Departments', path: '/departments', icon: <DepartmentsIcon /> },
  { title: 'Courses', path: '/courses', icon: <CoursesIcon /> },
  { title: 'Attendance', path: '/attendance', icon: <AttendanceIcon /> },
  { title: 'Examinations & Grades', path: '/examinations', icon: <ExamsIcon /> },
  { title: 'Fees & Accounting', path: '/fees', icon: <FeesIcon />, roles: ['SUPER_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'STUDENT'] },
  { title: 'Digital Library', path: '/library', icon: <LibraryIcon /> },
  { title: 'Leave Management', path: '/leave', icon: <LeaveIcon /> },
  { title: 'Timetable', path: '/timetable', icon: <TimetableIcon /> },
  { title: 'Notices & Circulars', path: '/notices', icon: <NoticeIcon /> },
  { title: 'Reports & Analytics', path: '/reports', icon: <ReportsIcon />, roles: ['SUPER_ADMIN', 'PRINCIPAL', 'ADMIN', 'HOD'] },
  { title: 'Security Audit Logs', path: '/audit-logs', icon: <AuditIcon />, roles: ['SUPER_ADMIN', 'PRINCIPAL'] },
];

export const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const userRoles = user?.roles || [];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      dispatch(setSidebarCollapsed(true));
    }
  };

  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((role) => userRoles.includes(role));
  });

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
      <Box sx={{ px: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="overline" sx={{ color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1.2 }}>
          Navigation Menu
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, mb: 1, borderColor: 'var(--border)' }} />

      <List sx={{ px: 1.5, flex: 1, overflowY: 'auto' }}>
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: '10px',
                  py: 1,
                  px: 2,
                  transition: 'all 0.15s ease-in-out',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  backgroundColor: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(79, 70, 229, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateX(3px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  slotProps={{
                    primary: {
                      style: { fontSize: '13.5px', fontWeight: isActive ? 600 : 500 }
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, my: 1, borderColor: 'var(--border)' }} />

      <Box sx={{ px: 3, pt: 1 }}>
        <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>
          Apex CMS v1.0.0 Enterprise
        </Typography>
        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '10px' }}>
          Accredited Grade A++
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={!sidebarCollapsed}
          onClose={() => dispatch(setSidebarCollapsed(true))}
          ModalProps={{ keepMounted: true }}
          slotProps={{
            paper: {
              sx: {
                width: DRAWER_WIDTH,
                backgroundColor: 'var(--surface)',
                borderRight: '1px solid var(--border)',
              }
            }
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop Drawer */
        <Drawer
          variant="persistent"
          open={!sidebarCollapsed}
          slotProps={{
            paper: {
              sx: {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
                backgroundColor: 'var(--surface)',
                borderRight: '1px solid var(--border)',
                top: '64px',
                height: 'calc(100vh - 64px)',
              }
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};


