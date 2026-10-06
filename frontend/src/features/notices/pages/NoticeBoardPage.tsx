import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Campaign as NoticeIcon,
  CalendarToday as DateIcon,
  People as AudienceIcon
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { noticeService } from '@/services/noticeService';
import { Notice } from '@/types';
import toast from 'react-hot-toast';

export const NoticeBoardPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    noticeType: 'GENERAL',
    targetAudience: 'ALL',
    priority: 'MEDIUM',
  });

  const fetchNotices = async () => {
    try {
      const res = await noticeService.getAll();
      if (res.data) {
        setNotices(res.data);
      }
    } catch {
      toast.error('Failed to load notices');
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Please enter notice title and details');
      return;
    }
    try {
      await noticeService.create(formData);
      toast.success('Notice published to campus notice board');
      setDialogOpen(false);
      setFormData({
        title: '',
        content: '',
        noticeType: 'GENERAL',
        targetAudience: 'ALL',
        priority: 'MEDIUM',
      });
      fetchNotices();
    } catch (err: any) {
      toast.error(err.message || 'Error publishing notice');
    }
  };

  const filteredNotices = activeTab === 'ALL'
    ? notices
    : notices.filter(n => n.noticeType === activeTab);

  return (
    <Box>
      <PageHeader
        title="Campus Notice Board & Circulars"
        subtitle="Official administrative notifications, examination schedules, events, and career opportunities."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              '&:hover': { backgroundColor: 'var(--primary-dark)' }
            }}
          >
            Post Circular / Notice
          </Button>
        }
      />

      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          mb: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          <Tab label="All Circulars" value="ALL" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Examinations" value="EXAMINATION" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Events & Conferences" value="EVENT" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Campus Placements" value="PLACEMENT" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="General" value="GENERAL" sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>
      </Card>

      <Grid container spacing={3}>
        {filteredNotices.map((n) => (
          <Grid item xs={12} md={6} key={n.id}>
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
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 'var(--shadow-md)',
                  borderColor: 'var(--primary-light)',
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Chip
                    label={n.noticeType}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(79, 70, 229, 0.08)',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: '11px',
                    }}
                  />
                  <Chip
                    label={n.priority}
                    size="small"
                    color={n.priority === 'HIGH' ? 'error' : n.priority === 'MEDIUM' ? 'warning' : 'info'}
                    sx={{ fontSize: '10px', height: 20, fontWeight: 700 }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 1.5, lineHeight: 1.3 }}>
                  {n.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-muted)', lineHeight: 1.6, mb: 2.5 }}>
                  {n.content}
                </Typography>
              </Box>

              <Box sx={{ pt: 2, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DateIcon sx={{ fontSize: 15, color: 'var(--text-muted)' }} />
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                    Published: {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : 'Today'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <AudienceIcon sx={{ fontSize: 15, color: 'var(--primary)' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--primary)' }}>
                    Target: {n.targetAudience}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Post Notice Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreate}>
          <DialogTitle sx={{ fontWeight: 700 }}>Publish Official Notice</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Notice Subject / Headline"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Category"
                  value={formData.noticeType}
                  onChange={(e) => setFormData({ ...formData, noticeType: e.target.value })}
                >
                  <MenuItem value="GENERAL">General</MenuItem>
                  <MenuItem value="EXAMINATION">Examination</MenuItem>
                  <MenuItem value="EVENT">Event</MenuItem>
                  <MenuItem value="PLACEMENT">Placement</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Target Audience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                >
                  <MenuItem value="ALL">All Campus</MenuItem>
                  <MenuItem value="STUDENTS">Students Only</MenuItem>
                  <MenuItem value="FACULTY">Faculty & Staff</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Urgency"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="HIGH">High Priority</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  label="Circular Content Details"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}>
              Publish Now
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};


