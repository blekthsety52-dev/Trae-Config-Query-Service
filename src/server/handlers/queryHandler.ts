import { Request, Response } from 'express';
import { ConfigQuerySchema, APIResponse } from '../models/schemas';
import { logger } from '../middleware/logger';

export const configQueryHandler = async (req: Request, res: Response) => {
  // Gin's ShouldBindQuery equivalent in Express is parsing req.query
  const result = ConfigQuerySchema.safeParse(req.query);

  if (!result.success) {
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    logger.warn({ errors }, 'Validation failed');
    return res.status(400).json({
      success: false,
      error: `Missing or invalid required parameters: ${errors}`
    } as APIResponse);
  }

  const queryParams = result.data;

  // Mock service layer logic
  // In a real app, this would call a service to resolve config based on params
  const configData = {
    feature_toggle: "enabled",
    theme: "dark",
    api_endpoint: "https://api.trae.internal/v2",
    cache_ttl: 3600,
    resolved_for: {
      uid: queryParams.uid,
      platform: queryParams.platform,
      tenant: queryParams.tenant
    }
  };

  logger.info({ 
    uid: queryParams.uid, 
    platform: queryParams.platform,
    tenant: queryParams.tenant 
  }, 'Config queried successfully');

  return res.status(200).json({
    success: true,
    data: configData
  } as APIResponse);
};
