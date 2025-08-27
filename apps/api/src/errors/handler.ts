import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type ErrorResponse = {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
};

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const statusCode = (error.statusCode as number) || 500;
    const response: ErrorResponse = {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'Unexpected error',
      requestId: request.id as string,
    };
    if ((error as any).validation) {
      response.code = 'VALIDATION_ERROR';
      response.details = (error as any).validation;
    }
    reply.status(statusCode).send(response);
  });
}


