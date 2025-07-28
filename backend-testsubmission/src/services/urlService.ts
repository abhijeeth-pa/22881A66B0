import { nanoid } from 'nanoid';
import { ShortUrl, ClickData, CreateShortUrlRequest } from '../types';
import { ValidationService } from '../utils/validation';

export class UrlService {
  private urls: Map<string, ShortUrl> = new Map();

  /**
   * Create a shortened URL
   */
  async createShortUrl(request: CreateShortUrlRequest, hostname: string): Promise<{ shortcode: string; expiry: Date }> {
    const { url, validity = 30, shortcode } = request;

    // Validate URL
    const urlValidation = await ValidationService.validateUrl(url);
    if (!urlValidation.isValid) {
      throw new Error(`URL validation failed: ${urlValidation.errors.join(', ')}`);
    }

    // Validate validity
    const validityValidation = await ValidationService.validateValidity(validity);
    if (!validityValidation.isValid) {
      throw new Error(`Validity validation failed: ${validityValidation.errors.join(', ')}`);
    }

    let finalShortcode: string;

    if (shortcode) {
      // Validate custom shortcode
      const shortcodeValidation = await ValidationService.validateShortcode(shortcode);
      if (!shortcodeValidation.isValid) {
        throw new Error(`Shortcode validation failed: ${shortcodeValidation.errors.join(', ')}`);
      }

      // Check if shortcode already exists
      if (this.urls.has(shortcode)) {
        throw new Error('Shortcode already exists');
      }

      finalShortcode = shortcode;
    } else {
      // Generate unique shortcode
      do {
        finalShortcode = nanoid(8);
      } while (this.urls.has(finalShortcode));
    }

    // Calculate expiry time
    const now = new Date();
    const expiry = new Date(now.getTime() + validity * 60 * 1000);

    // Create short URL
    const shortUrl: ShortUrl = {
      shortcode: finalShortcode,
      originalUrl: url,
      createdAt: now,
      expiry,
      clicks: []
    };

    this.urls.set(finalShortcode, shortUrl);

    return {
      shortcode: finalShortcode,
      expiry
    };
  }

  /**
   * Get URL by shortcode
   */
  getUrlByShortcode(shortcode: string): ShortUrl | null {
    const url = this.urls.get(shortcode);
    
    if (!url) {
      return null;
    }

    // Check if URL has expired
    if (new Date() > url.expiry) {
      this.urls.delete(shortcode);
      return null;
    }

    return url;
  }

  /**
   * Record a click on a short URL
   */
  recordClick(shortcode: string, clickData: Omit<ClickData, 'timestamp'>): void {
    const url = this.urls.get(shortcode);
    if (!url) {
      return;
    }

    const click: ClickData = {
      ...clickData,
      timestamp: new Date().toISOString()
    };

    url.clicks.push(click);
  }

  /**
   * Get URL statistics
   */
  getUrlStats(shortcode: string): ShortUrl | null {
    return this.getUrlByShortcode(shortcode);
  }

  /**
   * Get all URLs (for demo purposes)
   */
  getAllUrls(): ShortUrl[] {
    const now = new Date();
    return Array.from(this.urls.values()).filter(url => url.expiry > now);
  }

  /**
   * Clean up expired URLs
   */
  cleanupExpiredUrls(): void {
    const now = new Date();
    for (const [shortcode, url] of this.urls.entries()) {
      if (url.expiry <= now) {
        this.urls.delete(shortcode);
      }
    }
  }
} 