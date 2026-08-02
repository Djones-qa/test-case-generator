import express from 'express';
import cors from 'cors';
import { config, logger } from '../config';
import { generateTestSuite } from '../engine';

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'test-case-generator',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/generate', (req, res) => {
    try {
      const { code } = req.body as { code: string };

      if (!code || typeof code !== 'string') {
        res.status(400).json({ error: 'Request body must include a "code" string field' });
        return;
      }

      const suites = generateTestSuite(code);
      res.json({ suites, total: suites.length });
    } catch (error) {
      logger.error('Generation failed', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return { app, start: () => startServer(app) };
}

function startServer(app: express.Application) {
  const server = app.listen(config.port, () => {
    logger.info(`Test Case Generator running on port ${config.port}`);
  });
  return server;
}
