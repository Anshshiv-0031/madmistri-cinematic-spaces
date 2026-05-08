import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/admin/DashboardLayout";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});
