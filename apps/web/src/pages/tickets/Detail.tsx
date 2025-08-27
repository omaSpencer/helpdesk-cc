import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "../../lib/api";
import { CommentSchema, CreateCommentDTOSchema, TicketSchema } from "@helpdesk/shared";
import { z } from "zod";

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
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

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;
  const { ticket, comments } = data as {
    ticket: z.infer<typeof TicketSchema>;
    comments: z.infer<typeof CommentSchema>[];
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>
          {ticket.ticketNumber} — {ticket.title}
        </h1>
        <Link
          to={`/tickets/${id}/edit`}
          style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6 }}
        >
          Edit
        </Link>
      </div>
      <p>{ticket.description}</p>
      <div style={{ display: "grid", gap: 8 }}>
        <h2 style={{ fontWeight: 600 }}>Comments</h2>
        <ul style={{ display: "grid", gap: 8 }}>
          {comments.map((c) => (
            <li key={c.id} style={{ padding: 8, border: "1px solid #eee", borderRadius: 6 }}>
              <div style={{ fontSize: 12, color: "#666" }}>
                {c.author} · {new Date(c.createdAt).toLocaleString()}
              </div>
              <div>{c.body}</div>
            </li>
          ))}
        </ul>
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
          <div style={{ display: "grid", gap: 8, maxWidth: 560 }}>
            <input
              name="author"
              placeholder="Your name"
              required
              style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
            />
            <textarea
              name="body"
              placeholder="Add a comment..."
              required
              style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
            />
            <button
              type="submit"
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6 }}
            >
              Add comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
