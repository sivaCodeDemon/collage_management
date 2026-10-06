import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  MenuItem,
  TextField,
  Button
} from '@mui/material';
import { Print as PrintIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { MOCK_TIMETABLE } from '@/services/mockData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TimetablePage: React.FC = () => {
  const [semester, setSemester] = useState('6');
  const [section, setSection] = useState('A');

  return (
    <Box>
      <PageHeader
        title="Weekly Academic Timetable"
        subtitle="Lecture period matrix, classroom allocations, laboratory slots, and faculty commitments."
        action={
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            sx={{ textTransform: 'none', borderRadius: '10px' }}
          >
            Print Schedule
          </Button>
        }
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Department & Program"
              defaultValue="B.Tech Computer Science"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            >
              <MenuItem value="B.Tech Computer Science">B.Tech Computer Science</MenuItem>
              <MenuItem value="B.Tech Electronics">B.Tech Electronics</MenuItem>
              <MenuItem value="MBA">MBA Management</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <MenuItem key={s} value={String(s)}>Semester {s}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            >
              <MenuItem value="A">Section A</MenuItem>
              <MenuItem value="B">Section B</MenuItem>
              <MenuItem value="C">Section C</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        {DAYS.map((day) => {
          const daySlots = MOCK_TIMETABLE.filter((t) => t.day === day);
          return (
            <Grid item xs={12} md={6} lg={4} key={day}>
              <Card
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '1px solid var(--border)' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    {day}
                  </Typography>
                  <Chip label={`${daySlots.length || 2} Sessions`} size="small" variant="outlined" sx={{ fontSize: '11px' }} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {daySlots.length > 0 ? (
                    daySlots.map((slot, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 1.5,
                          borderRadius: '10px',
                          backgroundColor: 'rgba(79, 70, 229, 0.05)',
                          borderLeft: '4px solid var(--primary)',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                            {slot.time}
                          </Typography>
                          <Chip label={slot.room} size="small" sx={{ height: 18, fontSize: '10px' }} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-main)', mb: 0.3 }}>
                          {slot.subject}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                          Faculty: {slot.faculty}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <>
                      <Box sx={{ p: 1.5, borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.02)', borderLeft: '4px solid #94a3b8' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>09:00 - 11:00 AM</Typography>
                          <Chip label="LH-101" size="small" sx={{ height: 18, fontSize: '10px' }} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Elective Specialization</Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Faculty Panel</Typography>
                      </Box>
                      <Box sx={{ p: 1.5, borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.02)', borderLeft: '4px solid #94a3b8' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>02:00 - 04:00 PM</Typography>
                          <Chip label="Lab-2" size="small" sx={{ height: 18, fontSize: '10px' }} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Practical Project Lab</Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Lab Instructor</Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};


