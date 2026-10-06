import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  const { theme: mode } = useSelector((state: RootState) => state.ui);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#4f46e5',
            light: '#818cf8',
            dark: '#4338ca',
          },
          secondary: {
            main: '#06b6d4',
            light: '#22d3ee',
            dark: '#0891b2',
          },
          background: {
            default: mode === 'dark' ? '#0b0f19' : '#f8fafc',
            paper: mode === 'dark' ? '#111827' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#f3f4f6' : '#0f172a',
            secondary: mode === 'dark' ? '#9ca3af' : '#64748b',
          },
        },
        typography: {
          fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'].join(','),
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '10px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;


