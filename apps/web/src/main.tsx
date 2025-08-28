import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";

import { AppLayout } from "@/components/AppLayout";
import { TicketsListPage } from "@/pages/tickets/List";
import { TicketDetailPage } from "@/pages/tickets/Detail";
import { TicketEditPage } from "@/pages/tickets/Edit";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <TicketsListPage /> },
      { path: "/tickets", element: <TicketsListPage /> },
      { path: "/tickets/:id", element: <TicketDetailPage /> },
      { path: "/tickets/:id/edit", element: <TicketEditPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
