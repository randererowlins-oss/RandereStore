import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'randere-dev-secret-key-streetwear-2026-supersecure',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databasePath: process.env.DATABASE_PATH || path.resolve(process.cwd(), 'data/randere.db'),
  shippingBaseFee: parseInt(process.env.SHIPPING_BASE_FEE || '350', 10), // KES
  freeShippingThreshold: parseInt(process.env.FREE_SHIPPING_THRESHOLD || '10000', 10), // KES
};
