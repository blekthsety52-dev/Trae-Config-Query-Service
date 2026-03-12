import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

const rawKey = process.env.VITE_TRAE_API_KEY || process.env.TRAE_API_KEY || 'trae-secret-api-key-2026';
const API_KEY = rawKey.trim().replace(/^["']|["']$/g, '');

logger.info({ 
  keyPrefix: API_KEY.substring(0, 3), 
  keyLength: API_KEY.length,
  source: process.env.TRAE_API_KEY ? 'env' : 'fallback'
}, 'API Key initialized');

export const apiKeyAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization') || '';
  const providedKey = authHeader.replace(/^Bearer\s+/i, '').trim().replace(/^["']|["']$/g, '');

  if (!providedKey || providedKey !== API_KEY) {
    logger.warn({ 
      ip: req.ip, 
      method: req.method, 
      url: req.url,
      providedKeyPresent: !!providedKey,
      providedKeyLength: providedKey.length,
      expectedKeyLength: API_KEY.length,
      match: providedKey === API_KEY
    }, 'Unauthorized access attempt: Invalid or missing API Key');
    
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing API Key'
    });
  }

  next();
};
