import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { UrlService } from './services/urlService';
import { UrlController } from './controllers/urlController';
import { createUrlRoutes } from './routes/urlRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize services
const urlService = new UrlService();
const urlController = new UrlController(urlService);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

// Routes
app.use('/', createUrlRoutes(urlController));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode: 500
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Endpoint not found',
    statusCode: 404
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`URL Shortener service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Documentation:`);
  console.log(`  POST /shorturls - Create shortened URL`);
  console.log(`  GET /shorturls/:shortcode - Get URL statistics`);
  console.log(`  GET /:shortcode - Redirect to original URL`);
});

// Cleanup expired URLs every hour
setInterval(() => {
  urlService.cleanupExpiredUrls();
}, 60 * 60 * 1000);

export default app; 