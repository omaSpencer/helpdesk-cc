import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

type ErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
};

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    let statusCode = (error.statusCode as number) || 500;
    let code = error.code || "INTERNAL_ERROR";
    let message = error.message || "Unexpected error";
    let details: unknown | undefined;

    // Map Zod validation errors to 400
    if (error instanceof ZodError) {
      statusCode = 400;
      code = "VALIDATION_ERROR";
      message = "Validation failed";
      details = error.issues;
    }

    // Prisma unique constraint
    if ((error as any).code === "P2002") {
      statusCode = 409;
      code = "CONFLICT";
      message = "Resource conflict";
      details = (error as any).meta;
    }

    if (statusCode === 404 && code === "FST_ERR_NOT_FOUND") {
      code = "NOT_FOUND";
    }

    const body: ErrorBody = {
      error: { code, message, ...(details ? { details } : {}) },
      requestId: String(request.id),
    };

    reply.header("x-request-id", String(request.id));
    reply.status(statusCode).send(body);
  });
}
