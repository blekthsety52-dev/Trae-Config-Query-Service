import { z } from 'zod';

export const ConfigQuerySchema = z.object({
  mid: z.string().min(1, "mid is required"),
  did: z.string().min(1, "did is required"),
  uid: z.string().min(1, "uid is required"),
  userRegion: z.string().min(1, "userRegion is required"),
  packageType: z.string().min(1, "packageType is required"),
  platform: z.string().min(1, "platform is required"),
  arch: z.string().min(1, "arch is required"),
  tenant: z.string().min(1, "tenant is required"),
  appVersion: z.string().min(1, "appVersion is required"),
  buildVersion: z.string().min(1, "buildVersion is required"),
  traeVersionCode: z.string().min(1, "traeVersionCode is required"),
});

export type ConfigQueryRequest = z.infer<typeof ConfigQuerySchema>;

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
