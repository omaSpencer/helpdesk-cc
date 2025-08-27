import { Prisma } from '@prisma/client';
import { ListQueryDTOSchema } from '@helpdesk/shared';
import { z } from 'zod';

export type ListQuery = z.infer<typeof ListQueryDTOSchema>;

export function buildListQuery(q: ListQuery) {
  const where: Prisma.TicketWhereInput = {};
  const orderBy: Prisma.TicketOrderByWithRelationInput = {};

  if (q.q) {
    where.OR = [
      { title: { contains: q.q } },
      { description: { contains: q.q } },
      { ticketNumber: { contains: q.q } },
    ];
  }
  if (q.status && q.status.length > 0) {
    where.status = { in: q.status as any };
  }
  if (q.priority) {
    where.priority = q.priority as any;
  }

  const sortBy = q.sortBy || 'createdAt';
  const sortOrder = (q.sortOrder || 'desc') as 'asc' | 'desc';
  (orderBy as any)[sortBy] = sortOrder;

  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 20;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { where, orderBy, skip, take, page, pageSize };
}

export function buildPaginationMeta(total: number, page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { total, page, pageSize, totalPages };
}


