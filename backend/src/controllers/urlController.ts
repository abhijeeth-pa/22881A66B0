import { Request, Response } from 'express';
import { UrlService } from '../services/urlService';
import { CreateShortUrlRequest, CreateShortUrlResponse, UrlStats } from '../types';

export class UrlController {
  private urlService: UrlService;

  constructor(urlService: UrlService) {
    this.urlService = urlService;
  }

  /**
   * Create a shortened URL
   */
  async createShortUrl(req: Request, res: Response): Promise<void> {
    try {
      const request: CreateShortUrlRequest = req.body;
      const hostname = req.get('host') || 'localhost:5000';

      const result = await this.urlService.createShortUrl(request, hostname);

      const response: CreateShortUrlResponse = {
        shortLink: `http://${hostname}/${result.shortcode}`,
        expiry: result.expiry.toISOString()
      };

      res.status(201).json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('validation failed')) {
        res.status(400).json({
          error: 'Validation Error',
          message: errorMessage,
          statusCode: 400
        });
      } else if (errorMessage.includes('already exists')) {
        res.status(409).json({
          error: 'Conflict',
          message: errorMessage,
          statusCode: 409
        });
      } else {
        res.status(500).json({
          error: 'Internal Server Error',
          message: errorMessage,
          statusCode: 500
        });
      }
    }
  }

  /**
   * Get URL statistics
   */
  async getUrlStats(req: Request, res: Response): Promise<void> {
    try {
      const { shortcode } = req.params;
      const url = this.urlService.getUrlStats(shortcode);

      if (!url) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Short URL not found or expired',
          statusCode: 404
        });
        return;
      }

      const stats: UrlStats = {
        shortcode: url.shortcode,
        originalUrl: url.originalUrl,
        createdAt: url.createdAt.toISOString(),
        expiry: url.expiry.toISOString(),
        totalClicks: url.clicks.length,
        clicks: url.clicks
      };

      res.status(200).json(stats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        error: 'Internal Server Error',
        message: errorMessage,
        statusCode: 500
      });
    }
  }

  /**
   * Redirect to original URL
   */
  async redirectToOriginal(req: Request, res: Response): Promise<void> {
    try {
      const { shortcode } = req.params;
      const url = this.urlService.getUrlByShortcode(shortcode);

      if (!url) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Short URL not found or expired',
          statusCode: 404
        });
        return;
      }

      // Record click
      this.urlService.recordClick(shortcode, {
        referrer: req.get('referer') || 'direct',
        location: req.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.get('user-agent') || 'unknown',
        ipAddress: req.ip || 'unknown'
      });

      res.redirect(url.originalUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        error: 'Internal Server Error',
        message: errorMessage,
        statusCode: 500
      });
    }
  }

  /**
   * Get all URLs (for demo purposes)
   */
  async getAllUrls(req: Request, res: Response): Promise<void> {
    try {
      const urls = this.urlService.getAllUrls();
      res.status(200).json(urls);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        error: 'Internal Server Error',
        message: errorMessage,
        statusCode: 500
      });
    }
  }
} 