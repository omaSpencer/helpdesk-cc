import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { fetchJson } from "../../lib/api";
import { ListQueryDTOSchema, TicketSchema } from "@helpdesk/shared";
import { z } from "zod";
import { FiltersBar } from "../../components/FiltersBar";
import { Pagination } from "../../components/Pagination";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function TicketsListPage() {
  const [params] = useSearchParams();

  const raw = {
    q: params.get("q") || undefined,
    status: params.getAll("status")?.filter(Boolean) ?? [],
    priority: params.get("priority") || undefined,
    sortBy: params.get("sortBy") || undefined,
    sortOrder: params.get("sortOrder") || undefined,
    page: params.get("page") ? Number(params.get("page")) : undefined,
    pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : undefined,
  };

  const parsed = ListQueryDTOSchema.safeParse(raw);

  const queryKey = ["tickets", parsed.success ? parsed.data : {}];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      fetchJson(
        "/tickets?" +
          new URLSearchParams(
            Object.entries(raw).reduce((acc, [key, value]) => {
              if (value === undefined) return acc;

              if (Array.isArray(value)) {
                value.forEach((v) => acc.append(key, v));
              } else {
                acc.set(key, String(value));
              }
              return acc;
            }, new URLSearchParams())
          ).toString()
      ),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tickets</div>;

  return (
    <div className="grid gap-4 pt-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Link to="/new" className={cn(buttonVariants())}>
          New
        </Link>
      </div>

      <FiltersBar />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {(data as any)?.items?.map((t: z.infer<typeof TicketSchema>) => (
          <Card key={t.id}>
            <CardContent>
              <Link to={`/tickets/${t.id}`} className="font-semibold">
                {t.ticketNumber} — {t.title}
              </Link>
              <div className="text-xs text-muted-foreground">
                {t.status} • {t.priority}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination page={(data as any)?.page} totalPages={(data as any)?.totalPages} />
    </div>
  );
}
