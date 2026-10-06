import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

const DRAWER_WIDTH = 260;

export const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            marginLeft: isMobile || sidebarCollapsed ? 0 : `${DRAWER_WIDTH}px`,
            transition: 'margin-left 0.2s ease-in-out',
            minHeight: 'calc(100vh - 64px)',
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};


