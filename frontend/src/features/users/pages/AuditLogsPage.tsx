import React, { useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon, Security as SecurityIcon } from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MOCK_AUDIT_LOGS } from '@/services/mockData';

export const AuditLogsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredLogs = MOCK_AUDIT_LOGS.filter(
    (l) =>
      l.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <PageHeader
        title="Security & System Audit Trail"
        subtitle="Immutable audit log recording user authentications, data mutations, and administrative operations."
      />

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
        <TextField
          fullWidth
          size="small"
          placeholder="Filter audit logs by actor email, action type, or modification details..."
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
      </Card>

      <Card
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User / Actor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Target Entity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Event Details</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    {log.timestamp}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {log.userEmail}
                  </TableCell>
                  <TableCell>
                    <Chip label={log.action} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '11px' }} />
                  </TableCell>
                  <TableCell>{log.entityName}</TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>{log.details}</TableCell>
                  <TableCell sx={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {log.ipAddress}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};



