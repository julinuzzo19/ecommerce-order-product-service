import { Request, Response } from 'express';

export class HealthController {
  public healthCheck = async (_req: Request, res: Response) => {
    return res.status(200).json({
      status: 'ok',
      service: 'order-product-service',
      timestamp: new Date().toISOString(),
    });
  };
}
