import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import { TicketStatus } from "@helpdesk/shared";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusSelect, type StatusSelectOptions } from "@/components/StatusSelector";

export function FiltersBar() {
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState<TicketStatus[]>(
    (params.getAll("status") as TicketStatus[]) ?? []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [debouncedSearchQuery] = useDebounceValue(searchQuery, 300);

  function setParam(key: string, value?: string) {
    if (value === "none") {
      params.delete(key);
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setParams(params, { replace: true });
  }

  function onChangeStatus(selectedValues: StatusSelectOptions[]) {
    setStatus(selectedValues.map((val) => val.value as TicketStatus));
  }

  useEffect(() => {
    setParams({ ...params, status }, { replace: true });
  }, [status, params]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setParams({ ...params, q: debouncedSearchQuery }, { replace: true });
    }
  }, [params, debouncedSearchQuery]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-3">
      <Input
        type="text"
        placeholder="Search..."
        defaultValue={params.get("q") || ""}
        onChange={(e) => setSearchQuery(e.target.value || "")}
      />
      <StatusSelect defaultValues={status} onChange={onChangeStatus} />
      <Select
        onValueChange={(val) => setParam("priority", val || undefined)}
        value={params.get("priority") || ""}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">All priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={params.get("sortBy") || ""}
        onValueChange={(val) => setParam("sortBy", val || undefined)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sort by</SelectItem>
          <SelectItem value="createdAt">Created</SelectItem>
          <SelectItem value="updatedAt">Updated</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={params.get("sortOrder") || ""}
        onValueChange={(val) => setParam("sortOrder", val || undefined)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Desc" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Asc</SelectItem>
          <SelectItem value="desc">Desc</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
