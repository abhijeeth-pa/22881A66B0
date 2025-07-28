// API Response types
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

// Form types
export interface UrlFormData {
  url: string;
  validity: number;
  shortcode: string;
}

// Error types
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
} 