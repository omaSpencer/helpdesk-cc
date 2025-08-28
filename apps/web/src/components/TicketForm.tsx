import { TicketSchema } from "@helpdesk/shared";
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

export function TicketForm({
  initial,
  onSubmit,
  submitText = "Save",
  isPending,
}: {
  initial?: z.infer<typeof TicketSchema>;
  onSubmit: (d: any) => void;
  isPending?: boolean;
  submitText?: string;
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
      className="pt-4 grid gap-3 max-w-md"
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
        <Button type="submit" size="lg" isPending={isPending}>
          {submitText}
        </Button>
      </div>
    </form>
  );
}
