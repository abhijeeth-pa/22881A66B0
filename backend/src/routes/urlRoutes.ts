import { Router, Request, Response } from 'express';
import { UrlController } from '../controllers/urlController';

export function createUrlRoutes(urlController: UrlController): Router {
  const router = Router();

  // Create shortened URL
  router.post('/shorturls', (req: Request, res: Response) => urlController.createShortUrl(req, res));

  // Get URL statistics
  router.get('/shorturls/:shortcode', (req: Request, res: Response) => urlController.getUrlStats(req, res));

  // Get all URLs (for demo purposes)
  router.get('/urls', (req: Request, res: Response) => urlController.getAllUrls(req, res));

  // Redirect to original URL (catch-all route for shortcodes)
  router.get('/:shortcode', (req: Request, res: Response) => urlController.redirectToOriginal(req, res));

  return router;
} 