import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'ACTIVE':
      case 'PAID':
      case 'APPROVED':
      case 'PRESENT':
      case 'PASS':
        return { label: s, color: 'success' as const, bg: 'rgba(34, 197, 94, 0.12)', text: '#15803d' };
      case 'PENDING':
      case 'PARTIAL':
      case 'LATE':
        return { label: s, color: 'warning' as const, bg: 'rgba(234, 179, 8, 0.12)', text: '#a16207' };
      case 'INACTIVE':
      case 'OVERDUE':
      case 'REJECTED':
      case 'ABSENT':
      case 'FAIL':
        return { label: s, color: 'error' as const, bg: 'rgba(239, 68, 68, 0.12)', text: '#b91c1c' };
      default:
        return { label: s, color: 'default' as const, bg: 'rgba(100, 116, 139, 0.12)', text: '#475569' };
    }
  };

  const style = getStyle(status);

  return (
    <Chip
      label={style.label}
      size="small"
      sx={{
        backgroundColor: style.bg,
        color: style.text,
        fontWeight: 600,
        fontSize: '11px',
        borderRadius: '6px',
        border: 'none',
        height: '22px',
      }}
    />
  );
};


