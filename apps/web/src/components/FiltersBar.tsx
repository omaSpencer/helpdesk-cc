import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";

export function FiltersBar() {
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [debouncedSearchQuery] = useDebounceValue(searchQuery, 300);

  function setParam(key: string, value?: string) {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setParams(params, { replace: true });
  }

  useEffect(() => {
    if (!status.length) return;
    setParams({ ...params, status }, { replace: true });
  }, [status, params]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setParams({ ...params, q: debouncedSearchQuery }, { replace: true });
    }
  }, [params, debouncedSearchQuery]);

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <input
        type="text"
        placeholder="Search..."
        defaultValue={params.get("q") || ""}
        onChange={(e) => setSearchQuery(e.target.value || '')}
        style={{ padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
      />
      <select
        value={params.getAll("status") ?? ""}
        onChange={(e) => setStatus((prev) => [...prev, e.target.value])}
        multiple
      >
        <option value="">All status</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
      <select
        value={params.get("priority") || ""}
        onChange={(e) => setParam("priority", e.target.value || undefined)}
      >
        <option value="">All priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        value={params.get("sortBy") || ""}
        onChange={(e) => setParam("sortBy", e.target.value || undefined)}
      >
        <option value="">Sort by</option>
        <option value="createdAt">Created</option>
        <option value="updatedAt">Updated</option>
        <option value="priority">Priority</option>
        <option value="status">Status</option>
      </select>
      <select
        value={params.get("sortOrder") || ""}
        onChange={(e) => setParam("sortOrder", e.target.value || undefined)}
      >
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
    </div>
  );
}
