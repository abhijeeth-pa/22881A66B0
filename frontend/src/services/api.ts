import axios, { AxiosResponse } from 'axios';
import { 
  CreateShortUrlRequest, 
  CreateShortUrlResponse, 
  UrlStats, 
  ApiError 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const apiError: ApiError = {
        error: error.response.data.error || 'API Error',
        message: error.response.data.message || 'An error occurred',
        statusCode: error.response.status,
      };
      return Promise.reject(apiError);
    }
    return Promise.reject({
      error: 'Network Error',
      message: 'Unable to connect to the server',
      statusCode: 0,
    });
  }
);

export const urlService = {
  /**
   * Create a shortened URL
   */
  async createShortUrl(request: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
    const response: AxiosResponse<CreateShortUrlResponse> = await api.post('/shorturls', request);
    return response.data;
  },

  /**
   * Get URL statistics
   */
  async getUrlStats(shortcode: string): Promise<UrlStats> {
    const response: AxiosResponse<UrlStats> = await api.get(`/shorturls/${shortcode}`);
    return response.data;
  },

  /**
   * Get all URLs (for demo purposes)
   */
  async getAllUrls(): Promise<UrlStats[]> {
    const response: AxiosResponse<UrlStats[]> = await api.get('/urls');
    return response.data;
  },
};

export default api; 