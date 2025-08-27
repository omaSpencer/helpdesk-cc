import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { registerTicketRoutes } from './routes/tickets';
import { registerErrorHandler } from './errors/handler';

const buildServer = () => {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });
  app.register(swagger, {
    openapi: {
      info: { title: 'Helpdesk API', version: '0.1.0' },
    },
  });
  app.register(swaggerUI, { routePrefix: '/docs' });

  app.get('/health', async () => ({ status: 'ok' }));

  registerErrorHandler(app);
  registerTicketRoutes(app).then(() => {
    app.log.info('Routes registered');
  });

  return app;
};

const start = async () => {
  const app = buildServer();
  try {
    await app.ready();
    await app.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Start server when run directly (not when imported in tests)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export default buildServer;
