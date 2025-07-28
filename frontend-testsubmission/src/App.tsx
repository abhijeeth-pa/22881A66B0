import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import UrlShortener from './components/UrlShortener';
import UrlStatistics from './components/UrlStatistics';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2962ff',
      light: '#768fff',
      dark: '#0039cb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff3366',
      light: '#ff6090',
      dark: '#c4001d',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.09)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width: 600px)': {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box 
          sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, rgba(41,98,255,0.03) 0%, rgba(255,51,102,0.03) 100%)',
          }}
        >
          <AppBar position="sticky" elevation={0}>
            <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  background: 'linear-gradient(45deg, #2962ff, #ff3366)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                }}
              >
                URL Shortener
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 3,
                  '& a': {
                    position: 'relative',
                    color: 'text.primary',
                    fontWeight: 500,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: -2,
                      left: 0,
                      backgroundColor: 'primary.main',
                      transition: 'width 0.3s ease-in-out',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                  },
                }}
              >
                <Link
                  component={RouterLink}
                  to="/"
                  sx={{ textDecoration: 'none' }}
                >
                  Create URL
                </Link>
                <Link
                  component={RouterLink}
                  to="/statistics"
                  sx={{ textDecoration: 'none' }}
                >
                  Statistics
                </Link>
              </Box>
            </Toolbar>
          </AppBar>
          
          <Container 
            maxWidth="lg" 
            sx={{ 
              mt: { xs: 3, sm: 5 }, 
              mb: 4,
              px: { xs: 2, sm: 3 },
              '& > *': {
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
                },
              },
            }}
          >
            <Routes>
              <Route path="/" element={<UrlShortener />} />
              <Route path="/statistics" element={<UrlStatistics />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;