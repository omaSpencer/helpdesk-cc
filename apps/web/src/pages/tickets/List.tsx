import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { fetchJson } from "../../lib/api";
import { ListQueryDTOSchema, TicketSchema } from "@helpdesk/shared";
import { z } from "zod";

export function TicketsListPage() {
  const [params] = useSearchParams();
  const parsed = ListQueryDTOSchema.safeParse({
    q: params.get("q") || undefined,
    status: params.getAll("status"),
    priority: (params.get("priority") || undefined) as any,
    sortBy: (params.get("sortBy") || undefined) as any,
    sortOrder: (params.get("sortOrder") || undefined) as any,
    page: params.get("page") ? Number(params.get("page")) : undefined,
    pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : undefined,
  });
  const key = ["tickets", parsed.success ? parsed.data : {}];
  const { data, isLoading, error } = useQuery({
    queryKey: key,
    queryFn: () => fetchJson("/tickets"),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tickets</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Tickets</h1>
        <Link to="/new" style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6 }}>
          New
        </Link>
      </div>
      <ul style={{ display: "grid", gap: 8 }}>
        {(data as any).items?.map((t: z.infer<typeof TicketSchema>) => (
          <li key={t.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <Link to={`/tickets/${t.id}`} style={{ fontWeight: 600 }}>
              {t.ticketNumber} — {t.title}
            </Link>
            <div style={{ fontSize: 12, color: "#666" }}>
              {t.status} • {t.priority}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
