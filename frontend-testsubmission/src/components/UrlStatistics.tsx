import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Link as LinkIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { urlService } from '../services/api';
import { UrlStats, ApiError } from '../types';

const UrlStatistics: React.FC = () => {
  const [urls, setUrls] = useState<UrlStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);

  useEffect(() => {
    loadUrls();
  }, []);

  // const loadUrls = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await urlService.getAllUrls();
  //     setUrls(data);
  //   } catch (err) {
  //     const apiError = err as ApiError;
  //     setError(apiError.message || 'Failed to load URL statistics');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const loadUrls = async () => {
    try {
      setLoading(true);
      const data = await urlService.getAllUrls();
  
      // Add computed totalClicks
      const enhanced = data.map((url) => ({
        ...url,
        totalClicks: url.clicks?.length || 0,
      }));
  
      setUrls(enhanced);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load URL statistics');
    } finally {
      setLoading(false);
    }
  };
  

  const handleExpandClick = (shortcode: string) => {
    setExpandedUrl(expandedUrl === shortcode ? null : shortcode);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (expiry: string) => {
    const now = new Date();
    const expiryDate = new Date(expiry);
    return expiryDate > now ? 'success' : 'error';
  };

  const getStatusText = (expiry: string) => {
    const now = new Date();
    const expiryDate = new Date(expiry);
    return expiryDate > now ? 'Active' : 'Expired';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        View analytics and click data for all your shortened URLs.
      </Typography>

      {urls.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" textAlign="center" color="text.secondary">
              No shortened URLs found
            </Typography>
            <Typography variant="body2" textAlign="center" color="text.secondary">
              Create some shortened URLs to see their statistics here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {urls.map((url) => (
            <Grid item xs={12} key={url.shortcode}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {url.shortcode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', mb: 1 }}>
                        {url.originalUrl}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={getStatusText(url.expiry)}
                          color={getStatusColor(url.expiry) as any}
                          size="small"
                        />
                        <Chip
                          label={`${url.totalClicks} clicks`}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => handleExpandClick(url.shortcode)}
                      sx={{ transform: expandedUrl === url.shortcode ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Created
                          </Typography>
                          <Typography variant="body2">
                            {formatDate(url.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Expires
                          </Typography>
                          <Typography variant="body2">
                            {formatDate(url.expiry)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VisibilityIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Total Clicks
                          </Typography>
                          <Typography variant="body2">
                            {url.totalClicks}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinkIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Short URL
                          </Typography>
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {`http://localhost:5000/${url.shortcode}`}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Collapse in={expandedUrl === url.shortcode}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Click Details
                      </Typography>
                      {url.clicks.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No clicks recorded yet.
                        </Typography>
                      ) : (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Referrer</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>IP Address</TableCell>
                                <TableCell>User Agent</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {url.clicks.map((click, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {formatDate(click.timestamp)}
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <LanguageIcon fontSize="small" color="action" />
                                      {click.referrer || 'Direct'}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <LocationIcon fontSize="small" color="action" />
                                      {click.location}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    {click.ipAddress}
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ maxWidth: 200, wordBreak: 'break-all' }}>
                                      {click.userAgent}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UrlStatistics; 