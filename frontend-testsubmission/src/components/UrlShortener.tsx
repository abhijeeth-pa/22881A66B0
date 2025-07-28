import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Chip,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { urlService } from '../services/api';
import { CreateShortUrlRequest, CreateShortUrlResponse, ApiError } from '../types';

interface UrlFormData {
  url: string;
  validity: number;
  shortcode: string;
}

interface UrlResult {
  originalUrl: string;
  shortLink: string;
  expiry: string;
}

const UrlShortener: React.FC = () => {
  const [urlForms, setUrlForms] = useState<UrlFormData[]>([
    { url: '', validity: 30, shortcode: '' }
  ]);
  const [results, setResults] = useState<UrlResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const addUrlForm = () => {
    if (urlForms.length < 5) {
      setUrlForms([...urlForms, { url: '', validity: 30, shortcode: '' }]);
    }
  };

  const removeUrlForm = (index: number) => {
    if (urlForms.length > 1) {
      const newForms = urlForms.filter((_, i) => i !== index);
      setUrlForms(newForms);
    }
  };

  const updateUrlForm = (index: number, field: keyof UrlFormData, value: string | number) => {
    const newForms = [...urlForms];
    newForms[index] = { ...newForms[index], [field]: value };
    setUrlForms(newForms);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateShortcode = (shortcode: string): boolean => {
    if (!shortcode) return true; // Optional field
    return /^[a-zA-Z0-9]{3,20}$/.test(shortcode);
  };

  const validateForm = (form: UrlFormData): string[] => {
    const errors: string[] = [];
    
    if (!form.url) {
      errors.push('URL is required');
    } else if (!validateUrl(form.url)) {
      errors.push('Invalid URL format');
    }

    if (form.validity < 1 || form.validity > 525600) {
      errors.push('Validity must be between 1 minute and 1 year');
    }

    if (form.shortcode && !validateShortcode(form.shortcode)) {
      errors.push('Shortcode must be 3-20 alphanumeric characters');
    }

    return errors;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const validForms = urlForms.filter(form => form.url.trim());
      const newResults: UrlResult[] = [];

      for (const form of validForms) {
        const errors = validateForm(form);
        if (errors.length > 0) {
          throw new Error(`Form validation failed: ${errors.join(', ')}`);
        }

        const request: CreateShortUrlRequest = {
          url: form.url.trim(),
          validity: form.validity,
          shortcode: form.shortcode.trim() || undefined,
        };

        const response: CreateShortUrlResponse = await urlService.createShortUrl(request);
        
        newResults.push({
          originalUrl: form.url,
          shortLink: response.shortLink,
          expiry: response.expiry,
        });
      }

      setResults(newResults);
      setSuccess(`Successfully created ${newResults.length} shortened URL(s)`);
      
      // Reset forms
      setUrlForms([{ url: '', validity: 30, shortcode: '' }]);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to create shortened URLs');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Copied to clipboard!');
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create Shortened URLs
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Create up to 5 shortened URLs simultaneously. Each URL can have custom validity and shortcode.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">URL Forms</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addUrlForm}
              disabled={urlForms.length >= 5}
            >
              Add URL
            </Button>
          </Box>

          {urlForms.map((form, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">URL #{index + 1}</Typography>
                {urlForms.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => removeUrlForm(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Original URL"
                    value={form.url}
                    onChange={(e) => updateUrlForm(index, 'url', e.target.value)}
                    placeholder="https://example.com/very-long-url"
                    error={Boolean(form.url && !validateUrl(form.url))}
                    helperText={form.url && !validateUrl(form.url) ? 'Invalid URL format' : ''}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={form.validity}
                    onChange={(e) => updateUrlForm(index, 'validity', parseInt(e.target.value) || 30)}
                    inputProps={{ min: 1, max: 525600 }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Custom Shortcode (optional)"
                    value={form.shortcode}
                    onChange={(e) => updateUrlForm(index, 'shortcode', e.target.value)}
                    placeholder="mycode123"
                    error={Boolean(form.shortcode && !validateShortcode(form.shortcode))}
                    helperText={form.shortcode && !validateShortcode(form.shortcode) ? '3-20 alphanumeric characters' : ''}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading || urlForms.every(form => !form.url.trim())}
            sx={{ mt: 2 }}
          >
            {loading ? 'Creating...' : 'Create Shortened URLs'}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>
            {results.map((result, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Original URL:
                  </Typography>
                  <Chip
                    label="Copy"
                    icon={<CopyIcon />}
                    onClick={() => copyToClipboard(result.originalUrl)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" sx={{ mb: 2, wordBreak: 'break-all' }}>
                  {result.originalUrl}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    Shortened URL:
                  </Typography>
                  <Chip
                    label="Copy"
                    icon={<CopyIcon />}
                    onClick={() => copyToClipboard(result.shortLink)}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Typography variant="body1" sx={{ mb: 1, wordBreak: 'break-all' }}>
                  {result.shortLink}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Expires: {new Date(result.expiry).toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UrlShortener; 