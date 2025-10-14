import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { router } from '../../src/app/routes.js';
import healthRouter from '../../src/shared/infrastructure/health.routes.js';
import { errorHandler } from '../../src/shared/infrastructure/middlewares/errorHandler.js';
import { requestIdMiddleware } from '../../src/shared/infrastructure/middlewares/requestIdMiddleware.js';
import { createLogger } from '../../src/shared/infrastructure/logger/logger.js';
import { loggingMiddleware } from '../../src/shared/infrastructure/middlewares/loggingMiddleware.js';

export function createTestApp() {
  const app = express();

  // Middleware básico
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestIdMiddleware);

  // Logger para tests (silencioso en test)
  if (process.env.NODE_ENV !== 'test') {
    const httpLogger = createLogger('HTTP_TEST');
    app.use(loggingMiddleware(httpLogger));
  }

  // Routes
  // The app router is a factory that expects an OrderEventPublisher.
  // In tests we pass a noop publisher to avoid connecting to external brokers.
  const noopPublisher = {
    publishOrderCreated: async (_event: any) => {},
    publish: async (_event: any) => {},
  } as any;

  app.use('/api/v1', router(noopPublisher));
  app.use('/', healthRouter);

  // Error handling
  const errorLogger = createLogger('ERROR_TEST');
  app.use(errorHandler(errorLogger));

  return app;
}
