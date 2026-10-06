import React from 'react';
import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action, badge }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 3.5 
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-main)', letterSpacing: -0.3 }}>
            {title}
          </Typography>
          {badge}
        </Box>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>{action}</Box>}
    </Box>
  );
};


