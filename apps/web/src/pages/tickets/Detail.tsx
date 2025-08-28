import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CommentSchema, CreateCommentDTOSchema, TicketSchema } from "@helpdesk/shared";
import { z } from "zod";

import { fetchJson } from "@/lib/api";
import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => fetchJson(`/tickets/${id}`),
  });

  const addComment = useMutation({
    mutationFn: (input: z.infer<typeof CreateCommentDTOSchema>) =>
      fetchJson(`/tickets/${id}/comments`, { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ticket", id] }),
  });

  const deleteTicket = useMutation({
    mutationFn: () => fetchJson(`/tickets/${id}`, { method: "DELETE" }),
    onSuccess: () => navigate("/"),
  });

  const onDeleteTicket = () => deleteTicket.mutate();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;
  const { ticket, comments } = data as {
    ticket: z.infer<typeof TicketSchema>;
    comments: z.infer<typeof CommentSchema>[];
  };

  return (
    <div className="grid gap-4 pt-4 px-3">
      <div className="flex justify-between items-center">
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">
            {ticket.ticketNumber} — {ticket.title}
          </h1>
          <div>
            {ticket.status} - {ticket.priority}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/tickets/${id}/edit`} className={cn(buttonVariants())}>
            Edit
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={deleteTicket.isPending}>
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete {ticket.title}</DialogTitle>
                <DialogDescription>
                  Are you sure delete <span className="font-semibold">{ticket.title}</span> ticket?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button onClick={onDeleteTicket} isPending={deleteTicket.isPending}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <p>{ticket.description}</p>
      <div className="grid gap-4">
        <h2 className="font-semibold">Comments</h2>
        <ul className="grid gap-2">
          {comments.map((c) => (
            <li key={c.id} className="p-2 border border-border rounded-sm">
              <div className="text-sm text-muted-foreground">
                {c.author} · {new Date(c.createdAt).toLocaleString()}
              </div>
              <div>{c.body}</div>
            </li>
          ))}
        </ul>

        <Separator />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget as HTMLFormElement);
            addComment.mutate({
              author: String(fd.get("author") || ""),
              body: String(fd.get("body") || ""),
            });
            (e.currentTarget as HTMLFormElement).reset();
          }}
        >
          <div className="grid gap-2 max-w-sm">
            <Input name="author" placeholder="Your name" required />
            <Textarea name="body" placeholder="Add a comment..." required />
            <Button type="submit" size="lg" isPending={addComment.isPending}>
              Add comment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
