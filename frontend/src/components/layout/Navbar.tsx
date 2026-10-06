import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar, 
  Chip, 
  Tooltip, 
  Badge, 
  Divider,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsOutlined as NotificationsIcon,
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
  SwapHoriz as SwapRoleIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleSidebar, toggleTheme } from '@/store/uiSlice';
import { logout, setCredentials } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '@/services/mockData';
import toast from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.ui);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElRole, setAnchorElRole] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenRoleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElRole(event.currentTarget);
  };

  const handleCloseRoleMenu = () => {
    setAnchorElRole(null);
  };

  const handleRoleSwitch = (email: string) => {
    const targetUser = MOCK_USERS[email];
    if (targetUser) {
      dispatch(
        setCredentials({
          user: targetUser,
          accessToken: targetUser.token,
          refreshToken: `refresh-${targetUser.token}`,
        })
      );
      toast.success(`Switched role to: ${targetUser.roles[0]}`);
    }
    handleCloseRoleMenu();
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const roleColor = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'error';
      case 'PRINCIPAL': return 'secondary';
      case 'HOD':
      case 'PROFESSOR': return 'primary';
      case 'STUDENT': return 'success';
      default: return 'warning';
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'var(--surface)', 
        borderBottom: '1px solid var(--border)',
        color: 'var(--text-main)',
        backdropFilter: 'blur(8px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px', px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleSidebar())}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
              }}
            >
              <SchoolIcon fontSize="small" />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.2 }}>
                Apex Institute
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                College Management System
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Quick Role Switcher Button for instant demo testing */}
          <Tooltip title="Quickly switch role to test different permissions">
            <Button
              size="small"
              variant="outlined"
              onClick={handleOpenRoleMenu}
              startIcon={<SwapRoleIcon />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                borderColor: 'var(--border)',
                color: 'var(--text-main)',
                fontSize: '12px',
                display: { xs: 'none', sm: 'inline-flex' },
                '&:hover': {
                  borderColor: 'var(--primary)',
                  backgroundColor: 'rgba(79, 70, 229, 0.04)',
                }
              }}
            >
              Role: <Box component="span" sx={{ fontWeight: 600, ml: 0.5, color: 'var(--primary)' }}>{user?.roles[0] || 'User'}</Box>
            </Button>
          </Tooltip>

          <Menu
            anchorEl={anchorElRole}
            open={Boolean(anchorElRole)}
            onClose={handleCloseRoleMenu}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 240,
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                }
              }
            }}
          >
            <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'var(--text-muted)', fontWeight: 600 }}>
              SWITCH ROLE (TEST MODE)
            </Typography>
            <Divider />
            {Object.entries(MOCK_USERS).map(([email, u]) => (
              <MenuItem 
                key={email} 
                onClick={() => handleRoleSwitch(email)}
                selected={user?.email === email}
                sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{u.fullName}</Typography>
                  <Typography variant="caption" color="text.secondary">{email}</Typography>
                </Box>
                <Chip label={u.roles[0]} size="small" color={roleColor(u.roles[0]) as any} sx={{ height: 20, fontSize: '10px' }} />
              </MenuItem>
            ))}
          </Menu>

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton onClick={() => dispatch(toggleTheme())} color="inherit" size="small">
              {theme === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" size="small" onClick={() => navigate('/notices')}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ my: 1.5, mx: 0.5 }} />

          {/* User Profile Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'var(--primary)',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
              </Avatar>
            </IconButton>
            <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {user?.fullName || 'User'}
              </Typography>
              <Chip 
                label={user?.roles[0] || 'GUEST'} 
                size="small" 
                color={roleColor(user?.roles[0]) as any}
                sx={{ height: 18, fontSize: '10px', fontWeight: 600, mt: 0.3 }}
              />
            </Box>
          </Box>

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                }
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{user?.fullName}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
              <PersonIcon fontSize="small" sx={{ mr: 1.5, color: 'var(--text-muted)' }} />
              Profile Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'var(--danger)' }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};


