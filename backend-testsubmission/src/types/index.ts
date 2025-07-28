// URL Shortener types
export interface CreateShortUrlRequest {
  url: string;
  validity?: number;
  shortcode?: string;
}

export interface CreateShortUrlResponse {
  shortLink: string;
  expiry: string;
}

export interface UrlStats {
  shortcode: string;
  originalUrl: string;
  createdAt: string;
  expiry: string;
  totalClicks: number;
  clicks: ClickData[];
}

export interface ClickData {
  timestamp: string;
  referrer: string;
  location: string;
  userAgent: string;
  ipAddress: string;
}

export interface ShortUrl {
  shortcode: string;
  originalUrl: string;
  createdAt: Date;
  expiry: Date;
  clicks: ClickData[];
}

// Error response types
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
} 