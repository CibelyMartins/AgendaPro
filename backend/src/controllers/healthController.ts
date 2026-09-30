import type { Request, Response } from 'express';

export function healthCheck(_request: Request, response: Response) {
  return response.status(200).json({
    success: true,
    message: 'AgendaPro API está funcionando.',
    timestamp: new Date().toISOString(),
  });
}
