import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
  Security as SecurityIcon,
  AdminPanelSettings,
  Person,
  School,
  AccountBalanceWallet
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '@/store/authSlice';
import { authService } from '@/services/authService';
import { MOCK_USERS } from '@/services/mockData';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('superadmin@college.edu');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password dialog
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      if (response.data) {
        dispatch(
          setCredentials({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );
        toast.success(`Welcome back, ${response.data.user.fullName}!`);
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    const demoUser = MOCK_USERS[demoEmail];
    if (!demoUser) return;
    setEmail(demoEmail);
    setPassword('Admin@123');
    try {
      setLoading(true);
      const res = await authService.login({ email: demoEmail, password: 'Admin@123' });
      if (res.data) {
        dispatch(
          setCredentials({
            user: res.data.user,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          })
        );
        toast.success(`Logged in as ${res.data.user.roles[0]}: ${res.data.user.fullName}`);
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReset = async () => {
    if (!forgotEmail) {
      toast.error('Please provide an email address');
      return;
    }
    setForgotLoading(true);
    await authService.forgotPassword(forgotEmail);
    setForgotLoading(false);
    setForgotOpen(false);
    toast.success(`Password reset link sent to ${forgotEmail}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background glow circles */}
      <Box
        sx={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          top: -100,
          right: -100,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          bottom: -50,
          left: -50,
          pointerEvents: 'none',
        }}
      />

      <Card
        elevation={0}
        sx={{
          maxWidth: 480,
          width: '100%',
          p: { xs: 3, sm: 4.5 },
          borderRadius: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 1,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.4)',
              mb: 2,
            }}
          >
            <SchoolIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
            Apex Institute of Technology
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Enterprise College Management Portal
          </Typography>
        </Box>

        {/* 1-Click Demo Accounts Selector */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            1-Click Demo Showcase (Select a Role):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              icon={<SecurityIcon style={{ fontSize: 16 }} />}
              label="Super Admin"
              size="small"
              onClick={() => handleQuickDemoLogin('superadmin@college.edu')}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
            <Chip
              icon={<AdminPanelSettings style={{ fontSize: 16 }} />}
              label="Principal"
              size="small"
              onClick={() => handleQuickDemoLogin('principal@college.edu')}
              color="secondary"
              variant="outlined"
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
            <Chip
              icon={<Person style={{ fontSize: 16 }} />}
              label="Professor"
              size="small"
              onClick={() => handleQuickDemoLogin('prof.vikram@college.edu')}
              color="info"
              variant="outlined"
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
            <Chip
              icon={<School style={{ fontSize: 16 }} />}
              label="Student"
              size="small"
              onClick={() => handleQuickDemoLogin('student.arjun@college.edu')}
              color="success"
              variant="outlined"
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
            <Chip
              icon={<AccountBalanceWallet style={{ fontSize: 16 }} />}
              label="Accountant"
              size="small"
              onClick={() => handleQuickDemoLogin('accountant@college.edu')}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>OR SIGN IN WITH CREDENTIALS</Typography>
        </Divider>

        <form onSubmit={handleLogin}>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600, mb: 0.8 }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. name@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
              <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                Password
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => setForgotOpen(true)}
                sx={{ textTransform: 'none', fontSize: '12px', color: '#4f46e5', p: 0 }}
              >
                Forgot password?
              </Button>
            </Box>
            <TextField
              fullWidth
              size="small"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.3,
              borderRadius: '10px',
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In to Portal'}
          </Button>
        </form>

        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', textAlign: 'center', mt: 3 }}>
          Default password for all demo accounts: <strong>Admin@123</strong>
        </Typography>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
            Enter your college email address to receive password reset instructions.
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="Email Address"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setForgotOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendReset}
            disabled={forgotLoading}
            sx={{ textTransform: 'none', backgroundColor: '#4f46e5' }}
          >
            {forgotLoading ? <CircularProgress size={20} /> : 'Send Reset Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};



