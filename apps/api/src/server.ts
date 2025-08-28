import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { registerTicketRoutes } from "./routes/tickets";
import { registerErrorHandler } from "./errors/handler";

const buildServer = async () => {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
  // Register swagger BEFORE routes so it can hook into route registration
  app.register(swagger, {
    openapi: {
      openapi: "3.0.3",
      info: { title: "Helpdesk API", version: "0.1.0" },
    },
  });
  app.get("/health", async () => ({ status: "ok" }));

  registerErrorHandler(app);
  await registerTicketRoutes(app);
  app.register(swaggerUI, { routePrefix: "/docs" });

  return app;
};

const start = async () => {
  const app = await buildServer();
  try {
    await app.ready();
    await app.listen({ port: Number(process.env.PORT) || 3000, host: "0.0.0.0" });
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
