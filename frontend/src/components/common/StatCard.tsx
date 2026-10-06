import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  iconBg = 'rgba(79, 70, 229, 0.1)',
  iconColor = '#4f46e5',
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:hover': {
          boxShadow: 'var(--shadow-md)',
          transform: 'translateY(-3px)',
          borderColor: 'var(--primary-light)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-main)', mt: 0.5, letterSpacing: -0.5 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            backgroundColor: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>

      {change && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {isPositive ? (
            <TrendingUp sx={{ color: 'var(--success)', fontSize: 16 }} />
          ) : (
            <TrendingDown sx={{ color: 'var(--danger)', fontSize: 16 }} />
          )}
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: isPositive ? 'var(--success)' : 'var(--danger)' }}
          >
            {change}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--text-muted)', ml: 0.5 }}>
            vs last term
          </Typography>
        </Box>
      )}
    </Card>
  );
};


