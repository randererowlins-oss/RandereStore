import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rate-limit.middleware.js';
import { NotFoundError } from './utils/errors.js';

export function createApp(): Express {
  const app = express();

  // Ensure public uploads directory exists
  const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Security Middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Permit rich multimedia and Vite dev assets
      frameguard: false, // Allow sandbox live preview iframe
    })
  );


  // CORS Configuration
  app.use(
    cors({
      origin: true, // Allow dev preview domains and local ports
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
    })
  );

  // Body Parsing & Cookies
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser());

  // Static Assets (uploads)
  app.use('/uploads', express.static(uploadsDir));

  // Rate Limiting
  app.use('/api', apiLimiter);

  // Mount API
  app.use('/api', apiRoutes);

  // Catch-all 404 for API
  app.all('/api/*', (req, res, next) => {
    next(new NotFoundError(`Endpoint '${req.method} ${req.originalUrl}' does not exist`));
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
