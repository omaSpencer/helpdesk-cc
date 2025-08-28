import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../../lib/api";
import { CreateTicketDTOSchema, TicketSchema, UpdateTicketDTOSchema } from "@helpdesk/shared";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
      className="pt-4 grid gap-3 max-w-md mx-auto"
    >
      <Input name="title" placeholder="Title" defaultValue={initial?.title} required />
      <Textarea
        name="description"
        placeholder="Description"
        defaultValue={initial?.description}
        required
      />
      <Select name="priority" defaultValue={initial?.priority || "MEDIUM"}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LOW">LOW</SelectItem>
          <SelectItem value="MEDIUM">MEDIUM</SelectItem>
          <SelectItem value="HIGH">HIGH</SelectItem>
          <SelectItem value="URGENT">URGENT</SelectItem>
        </SelectContent>
      </Select>
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" size="lg">
          Save
        </Button>
      </div>
    </form>
  );
}
