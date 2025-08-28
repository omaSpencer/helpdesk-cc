import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { TicketStatus } from "@helpdesk/shared";

import { cn } from "@/lib/utils";
import { FILTER_BAR_STATUS_OPTIONS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type StatusSelectOptions = { label: string; value: string; color: string };

const parseAsStatusSelectOption = (values?: TicketStatus[]): StatusSelectOptions[] => {
  if (!values?.length) return [];

  const findLabel = (val: TicketStatus) =>
    FILTER_BAR_STATUS_OPTIONS.find((option) => option.value === val)?.label ?? "Unknown status";
  const findColor = (val: TicketStatus) =>
    FILTER_BAR_STATUS_OPTIONS.find((option) => option.value === val)?.color ?? "#fff";

  return values.map((val) => ({
    value: val,
    label: findLabel(val),
    color: findColor(val),
  }));
};

export function StatusSelect({
  onChange,
  defaultValues,
}: {
  onChange?: (selectedValues: StatusSelectOptions[]) => void;
  defaultValues?: TicketStatus[];
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedValues, setSelectedValues] = React.useState<StatusSelectOptions[]>(
    parseAsStatusSelectOption(defaultValues)
  );

  const toggleStatus = (status: StatusSelectOptions) => {
    setSelectedValues((currentStatuses) =>
      !currentStatuses.find((s) => s.value === status.value)
        ? [...currentStatuses, status]
        : currentStatuses.filter((l) => l.value !== status.value)
    );
    inputRef?.current?.focus();
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur(); // HACK: otherwise, would scroll automatically to the bottom of page
    setOpenCombobox(value);
  };

  React.useEffect(() => {
    onChange?.(selectedValues);
  }, [selectedValues]);

  return (
    <div className="max-w-[200px]">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-[200px] justify-between text-foreground"
          >
            <span className="truncate">
              {selectedValues.length === 0 && "Select status"}
              {selectedValues.length === 1 && selectedValues[0].label}
              {selectedValues.length === 2 && selectedValues.map(({ label }) => label).join(", ")}
              {selectedValues.length > 2 && `${selectedValues.length} status selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search status..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandGroup className="max-h-[145px] overflow-auto">
                {FILTER_BAR_STATUS_OPTIONS.map((statusOption) => {
                  const isActive = !!selectedValues.find(
                    (status) => status.value === statusOption.value
                  )?.value;
                  return (
                    <CommandItem
                      key={statusOption.value}
                      value={statusOption.value}
                      onSelect={() => toggleStatus(statusOption)}
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", isActive ? "opacity-100" : "opacity-0")}
                      />
                      <div className="flex-1">{statusOption.label}</div>
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: statusOption.color }}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
