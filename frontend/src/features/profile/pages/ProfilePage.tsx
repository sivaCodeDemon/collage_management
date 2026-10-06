import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  Divider
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateUser } from '@/store/authSlice';
import { PageHeader } from '@/components/common/PageHeader';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState('+91 90000 00001');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
      })
    );
    toast.success('Profile details updated successfully');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await authService.changePassword(currentPassword, newPassword, confirmPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Failed to change password');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Account & Security Settings"
        subtitle="Manage your personal credentials, contact details, authentication keys, and assigned roles."
      />

      <Grid container spacing={3}>
        {/* Left Column: User Card */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'var(--primary)',
                fontSize: 28,
                fontWeight: 700,
                mx: 'auto',
                mb: 2,
              }}
            >
              {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {user?.fullName || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 2 }}>
              {user?.email}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, display: 'block', mb: 1 }}>
                ASSIGNED ROLES
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {user?.roles?.map((r) => (
                  <Chip key={r} label={r} size="small" color="primary" sx={{ fontWeight: 600 }} />
                ))}
              </Box>

              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, display: 'block', mb: 1 }}>
                SECURITY CLEARANCE
              </Typography>
              <Chip label="Level 4 - Institutional Officer" size="small" variant="outlined" sx={{ fontSize: '11px' }} />
            </Box>
          </Card>
        </Grid>

        {/* Right Column: Edit Details & Password */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 2 }}>
              Personal Information
            </Typography>
            <form onSubmit={handleUpdateProfile}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="College Email"
                    disabled
                    value={user?.email || ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
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
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 2 }}>
              Update Password
            </Typography>
            <form onSubmit={handleChangePassword}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="outlined"
                    sx={{ textTransform: 'none' }}
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};


