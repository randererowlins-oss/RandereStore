import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { seedDatabase } from './seed.js';

async function startServer() {
  try {
    // Seed database if empty
    await seedDatabase();

    const app = createApp();

    const server = app.listen(config.port, '0.0.0.0', () => {
      logger.info(`RANDERE Studio API running on http://0.0.0.0:${config.port}`);
      logger.info(`Environment: ${config.env}`);
    });

    const shutdown = async () => {
      logger.info('Gracefully shutting down RANDERE API server...');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
