import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../../lib/api";
import { CreateTicketDTOSchema, TicketSchema, UpdateTicketDTOSchema } from "@helpdesk/shared";
import { z } from "zod";

export function TicketEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => fetchJson(`/tickets/${id}`),
  });
  const ticket = data?.ticket as z.infer<typeof TicketSchema> | undefined;

  const mutate = useMutation({
    mutationFn: (input: z.infer<typeof UpdateTicketDTOSchema>) =>
      fetchJson(`/tickets/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticket", id] });
      navigate(`/tickets/${id}`);
    },
  });

  if (!ticket) return <div>Loading...</div>;
  return <TicketForm initial={ticket} onSubmit={(d) => mutate.mutate(d)} />;
}

export function TicketNewPage() {
  const navigate = useNavigate();
  const mutate = useMutation({
    mutationFn: (input: z.infer<typeof CreateTicketDTOSchema>) =>
      fetchJson("/tickets", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: (t: any) => navigate(`/tickets/${t.id}`),
  });
  return <TicketForm onSubmit={(d) => mutate.mutate(d)} />;
}

function TicketForm({
  initial,
  onSubmit,
}: {
  initial?: z.infer<typeof TicketSchema>;
  onSubmit: (d: any) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        onSubmit({
          title: String(fd.get("title") || ""),
          description: String(fd.get("description") || ""),
          priority: String(fd.get("priority") || "MEDIUM"),
        });
      }}
    >
      <div style={{ display: "grid", gap: 12, maxWidth: 640 }}>
        <input
          name="title"
          placeholder="Title"
          defaultValue={initial?.title}
          required
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
        />
        <textarea
          name="description"
          placeholder="Description"
          defaultValue={initial?.description}
          required
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
        />
        <select
          name="priority"
          defaultValue={initial?.priority || "MEDIUM"}
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6 }}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
