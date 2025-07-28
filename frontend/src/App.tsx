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
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                URL Shortener
              </Typography>
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{ textDecoration: 'none', mr: 2 }}
              >
                Create URL
              </Link>
              <Link
                component={RouterLink}
                to="/statistics"
                color="inherit"
                sx={{ textDecoration: 'none' }}
              >
                Statistics
              </Link>
            </Toolbar>
          </AppBar>
        </Box>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<UrlShortener />} />
            <Route path="/statistics" element={<UrlStatistics />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App; 