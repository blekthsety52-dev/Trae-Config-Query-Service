import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { createServer as createViteServer } from 'vite';
import { logger, loggerMiddleware } from './src/server/middleware/logger';
import { authMiddleware } from './src/server/middleware/auth';
import { apiKeyAuthMiddleware } from './src/server/middleware/apiKeyAuth';
import { configQueryHandler } from './src/server/handlers/queryHandler';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Authorization', 'Content-Type', 'X-API-Key']
  }));
  app.use(express.json());
  app.use(loggerMiddleware);

  // API Routes
  const v1 = express.Router();
  
  // Health check
  v1.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // The requested endpoint
  v1.get('/config/query', apiKeyAuthMiddleware, configQueryHandler);

  app.use('/icube/api/v1/native', v1);

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
