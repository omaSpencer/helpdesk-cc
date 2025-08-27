import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  CreateCommentDTOSchema,
  CreateTicketDTOSchema,
  ListQueryDTOSchema,
  TicketSchema,
  UpdateTicketDTOSchema,
} from "@helpdesk/shared";
import { getPrisma } from "../db";
import { buildListQuery, buildPaginationMeta } from "../utils/query";

const ParamsId = z.object({ id: z.uuid() });

export async function registerTicketRoutes(app: FastifyInstance) {
  const prisma = getPrisma();

  // List tickets
  app.get(
    "/tickets",
    {
      schema: {
        summary: "List tickets",
        querystring: ListQueryDTOSchema as any,
        response: {
          200: z.object({
            items: z.array(TicketSchema),
            page: z.number(),
            pageSize: z.number(),
            total: z.number(),
            totalPages: z.number(),
          }) as any,
        },
      },
    },
    async (request, reply) => {
      const query = ListQueryDTOSchema.parse(request.query);
      const { where, orderBy, skip, take, page, pageSize } = buildListQuery(query);
      const [total, items] = await prisma.$transaction([
        prisma.ticket.count({ where }),
        prisma.ticket.findMany({ where, orderBy, skip, take }),
      ]);
      const meta = buildPaginationMeta(total, page, pageSize);
      return { items, ...meta };
    }
  );

  // Get by id with comments
  app.get(
    "/tickets/:id",
    {
      schema: {
        summary: "Get ticket by id",
        params: ParamsId as any,
        response: {
          200: z.object({ ticket: TicketSchema, comments: z.array(z.any()) }) as any,
          404: z.object({ code: z.string(), message: z.string() }) as any,
        },
      },
    },
    async (request, reply) => {
      const { id } = ParamsId.parse(request.params);
      const ticket = await prisma.ticket.findUnique({ where: { id } });
      if (!ticket)
        return reply.status(404 as any).send({ code: "NOT_FOUND", message: "Ticket not found" });
      const comments = await prisma.comment.findMany({
        where: { ticketId: id },
        orderBy: { createdAt: "asc" },
      });
      return { ticket, comments };
    }
  );

  // Create ticket
  app.post(
    "/tickets",
    {
      schema: {
        summary: "Create ticket",
        body: CreateTicketDTOSchema as any,
        response: { 201: TicketSchema as any },
      },
    },
    async (request, reply) => {
      const data = CreateTicketDTOSchema.parse(request.body);
      // Generate next ticket number: T-000001
      const last = await prisma.ticket.findFirst({ orderBy: { createdAt: "desc" } });
      let nextNum = 1;
      if (last?.ticketNumber?.startsWith("T-")) {
        const n = Number(last.ticketNumber.split("-")[1]);
        if (!Number.isNaN(n)) nextNum = n + 1;
      }
      const ticketNumber = `T-${String(nextNum).padStart(6, "0")}`;
      const created = await prisma.ticket.create({ data: { ...data, ticketNumber } });
      reply.code(201);
      return created;
    }
  );

  // Update ticket
  app.patch(
    "/tickets/:id",
    {
      schema: {
        summary: "Update ticket",
        params: ParamsId as any,
        body: UpdateTicketDTOSchema as any,
        response: {
          200: TicketSchema as any,
          404: z.object({ code: z.string(), message: z.string() }) as any,
        },
      },
    },
    async (request, reply) => {
      const { id } = ParamsId.parse(request.params);
      const data = UpdateTicketDTOSchema.parse(request.body);
      try {
        const updated = await prisma.ticket.update({ where: { id }, data });
        return updated;
      } catch (e) {
        return reply.status(404 as any).send({ code: "NOT_FOUND", message: "Ticket not found" });
      }
    }
  );

  // Delete ticket
  app.delete(
    "/tickets/:id",
    {
      schema: {
        summary: "Delete ticket",
        params: ParamsId as any,
        response: {
          204: z.null() as any,
          404: z.object({ code: z.string(), message: z.string() }) as any,
        },
      },
    },
    async (request, reply) => {
      const { id } = ParamsId.parse(request.params);
      try {
        await prisma.ticket.delete({ where: { id } });
      } catch (e) {
        return reply.status(404 as any).send({ code: "NOT_FOUND", message: "Ticket not found" });
      }
      reply.code(204);
      return null;
    }
  );

  // Add comment
  app.post(
    "/tickets/:id/comments",
    {
      schema: {
        summary: "Add comment to ticket",
        params: ParamsId as any,
        body: CreateCommentDTOSchema as any,
        response: {
          201: z.any() as any,
          404: z.object({ code: z.string(), message: z.string() }) as any,
        },
      },
    },
    async (request, reply) => {
      const { id } = ParamsId.parse(request.params);
      const data = CreateCommentDTOSchema.parse(request.body);
      const ticket = await prisma.ticket.findUnique({ where: { id } });
      if (!ticket)
        return reply.status(404 as any).send({ code: "NOT_FOUND", message: "Ticket not found" });
      const comment = await prisma.comment.create({ data: { ticketId: id, ...data } });
      reply.code(201);
      return comment;
    }
  );
}
