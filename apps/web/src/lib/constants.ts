import { TicketStatus } from "@helpdesk/shared";

import { type StatusSelectOptions } from "@/components/StatusSelector";

export const STATUS_COLORS: Record<
  TicketStatus,
  {
    id: TicketStatus;
    color: string;
    colorRGBA: (opacity: number) => string;
  }
> = {
  [TicketStatus.OPEN]: {
    id: TicketStatus.OPEN,
    color: "#ff4d4f",
    colorRGBA: (opacity: number) => `rgba(255, 77, 79, ${opacity / 100})`,
  },
  [TicketStatus.IN_PROGRESS]: {
    id: TicketStatus.IN_PROGRESS,
    color: "#faad14",
    colorRGBA: (opacity: number) => `rgba(250, 173, 20, ${opacity / 100})`,
  },
  [TicketStatus.RESOLVED]: {
    id: TicketStatus.RESOLVED,
    color: "#52c41a",
    colorRGBA: (opacity: number) => `rgba(82, 196, 26, ${opacity / 100})`,
  },
  [TicketStatus.CLOSED]: {
    id: TicketStatus.CLOSED,
    color: "#8c8c8c",
    colorRGBA: (opacity: number) => `rgba(140, 140, 140, ${opacity / 100})`,
  },
};

export const FILTER_BAR_STATUS_OPTIONS = [
  {
    label: "Open",
    value: TicketStatus.OPEN,
    color: STATUS_COLORS[TicketStatus.OPEN].color,
  },
  {
    label: "In Progress",
    value: TicketStatus.IN_PROGRESS,
    color: STATUS_COLORS[TicketStatus.IN_PROGRESS].color,
  },
  {
    label: "Resolved",
    value: TicketStatus.RESOLVED,
    color: STATUS_COLORS[TicketStatus.RESOLVED].color,
  },
  {
    label: "Closed",
    value: TicketStatus.CLOSED,
    color: STATUS_COLORS[TicketStatus.CLOSED].color,
  },
] satisfies StatusSelectOptions[];
