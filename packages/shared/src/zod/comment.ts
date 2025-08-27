import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.uuid(),
  ticketId: z.uuid(),
  author: z.string().min(1).max(120),
  body: z.string().min(1).max(5000),
  createdAt: z.iso.datetime(),
});

export const CreateCommentDTOSchema = z.object({
  author: z.string().min(1).max(120),
  body: z.string().min(1).max(5000),
});

export type Comment = z.infer<typeof CommentSchema>;
export type CreateCommentDTO = z.infer<typeof CreateCommentDTOSchema>;
