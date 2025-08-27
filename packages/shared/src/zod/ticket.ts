import { z } from "zod";
import { TicketPriority, TicketStatus } from "../types";

export const TicketSchema = z.object({
  id: z.uuid(),
  ticketNumber: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  status: z.enum(TicketStatus),
  priority: z.enum(TicketPriority),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const CreateTicketDTOSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  priority: z.enum(TicketPriority).default(TicketPriority.MEDIUM),
});

export const UpdateTicketDTOSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  status: z.enum(TicketStatus).optional(),
  priority: z.enum(TicketPriority).optional(),
});

export const ListQueryDTOSchema = z.object({
  q: z.string().trim().min(1).optional(),
  status: z.preprocess(
    (val) =>
      Array.isArray(val)
        ? val.map((v: string) => v.toUpperCase())
        : val
          ? [(val as string).toUpperCase()]
          : [],
    z.array(z.enum(TicketStatus)).optional()
  ),
  priority: z.enum(TicketPriority).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "priority", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type Ticket = z.infer<typeof TicketSchema>;
export type CreateTicketDTO = z.infer<typeof CreateTicketDTOSchema>;
export type UpdateTicketDTO = z.infer<typeof UpdateTicketDTOSchema>;
export type ListQueryDTO = z.infer<typeof ListQueryDTOSchema>;
