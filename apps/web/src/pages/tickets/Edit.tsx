import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { TicketSchema, UpdateTicketDTOSchema } from "@helpdesk/shared";
import { z } from "zod";

import { fetchJson } from "@/lib/api";

import { TicketForm } from "@/components/TicketForm";

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
  return (
    <div className="px-3">
      <TicketForm
        initial={ticket}
        onSubmit={(d) => mutate.mutate(d)}
        isPending={mutate.isPending}
      />
    </div>
  );
}
