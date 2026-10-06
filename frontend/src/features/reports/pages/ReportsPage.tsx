import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Divider
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import toast from 'react-hot-toast';

const PASS_RATE_DATA = [
  { dept: 'CSE', rate2024: 92, rate2025: 96 },
  { dept: 'ECE', rate2024: 88, rate2025: 91 },
  { dept: 'MECH', rate2024: 82, rate2025: 86 },
  { dept: 'CIVIL', rate2024: 85, rate2025: 89 },
  { dept: 'MGMT', rate2024: 94, rate2025: 97 },
];

const FEE_RECOVERY_TREND = [
  { month: 'Apr', target: 200, collected: 210 },
  { month: 'May', target: 250, collected: 245 },
  { month: 'Jun', target: 300, collected: 320 },
  { month: 'Jul', target: 450, collected: 440 },
  { month: 'Aug', target: 350, collected: 365 },
  { month: 'Sep', target: 280, collected: 290 },
];

export const ReportsPage: React.FC = () => {
  const handleExport = (reportName: string) => {
    toast.success(`Exporting ${reportName} to CSV / PDF`);
  };

  return (
    <Box>
      <PageHeader
        title="Institutional Analytics & Reports"
        subtitle="Performance analytics, accreditation metrics, financial auditing, and NAAC/NIRF reporting."
        action={
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={() => handleExport('Comprehensive Institutional Report')}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
            }}
          >
            Export Annual Report (PDF)
          </Button>
        }
      />

      {/* Reports Available for Instant Download */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Semester Academic Results Summary', desc: 'Department-wise pass percentage, top rankers, and credit stats.' },
          { title: 'Faculty Workload & Research Ledger', desc: 'Weekly teaching hours, journal publications, and funded grants.' },
          { title: 'Student Attendance & Defaulters Roster', desc: 'Lists students below mandatory 75% attendance threshold.' },
          { title: 'Tuition Fee Recovery & Defaulters List', desc: 'Comprehensive financial audit breakdown by degree program.' },
        ].map((rep, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 0.8 }}>
                  {rep.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {rep.desc}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport(rep.title)}
                sx={{ mt: 2, textTransform: 'none', borderRadius: '8px', fontSize: '12px' }}
              >
                Download CSV
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart 1: Pass Rate Comparison */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 0.5 }}>
              Pass Rate Improvement by Department (%)
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', mb: 2, display: 'block' }}>
              Academic Year 2024 vs 2025 performance
            </Typography>

            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PASS_RATE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="dept" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis domain={[70, 100]} stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rate2024" name="AY 2024 (%)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rate2025" name="AY 2025 (%)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Chart 2: Fee Target vs Actual */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 0.5 }}>
              Financial Fee Collection vs Budget Target ($k)
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', mb: 2, display: 'block' }}>
              Current FY Monthly Collection Trajectory
            </Typography>

            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FEE_RECOVERY_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="target" name="Target ($k)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="collected" name="Realized ($k)" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};


