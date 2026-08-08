"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAppointments, cancelAppointment, completeAppointment } from "@/actions/appointments";
import { Plus, Search, MoreHorizontal, Eye, XCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AppointmentsPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const result = await getAppointments({
      search: search || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      page,
      limit: 10,
    });

    if (result.success) {
      setAppointments(result.data);
      setPagination(result.pagination);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    const result = await cancelAppointment(cancelId);
    if (result.success) {
      toast.success(result.message);
      fetchAppointments();
    } else {
      toast.error(result.message);
    }
    setCancelling(false);
    setCancelId(null);
  };

  const handleComplete = async (id) => {
    const result = await completeAppointment(id);
    if (result.success) {
      toast.success(result.message);
      fetchAppointments();
    } else {
      toast.error(result.message);
    }
  };

  const statusVariant = (status) => {
    switch (status) {
      case "SCHEDULED": return "default";
      case "COMPLETED": return "default";
      case "CANCELLED": return "secondary";
      default: return "secondary";
    }
  };

  const columns = [
    {
      accessorKey: "patient",
      header: "Patient",
      cell: ({ row }) => {
        const p = row.original.patient;
        return (
          <div>
            <p className="font-medium">{p.firstName} {p.lastName}</p>
            <p className="text-xs text-muted-foreground">{p.phone}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "doctor",
      header: "Doctor",
      cell: ({ row }) => {
        const d = row.original.doctor;
        return (
          <div>
            <p className="font-medium">Dr. {d.user.firstName} {d.user.lastName}</p>
            <p className="text-xs text-muted-foreground">{d.department.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "appointmentDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.appointmentDate), "MMM dd, yyyy"),
    },
    {
      accessorKey: "appointmentTime",
      header: "Time",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/appointments/${row.original.id}`)}>
              <Eye className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
            {row.original.status === "SCHEDULED" && (
              <>
                <DropdownMenuItem onClick={() => handleComplete(row.original.id)}>
                  <CheckCircle className="mr-2 size-4" />
                  Mark Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCancelId(row.original.id)} className="text-destructive">
                  <XCircle className="mr-2 size-4" />
                  Cancel
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Manage patient appointments and scheduling"
        breadcrumbs={[{ label: "Appointments" }]}
      >
        <Link href="/appointments/new">
          <Button>
            <Plus className="mr-2 size-4" />
            Book Appointment
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={appointments} pagination={pagination} onPageChange={setPage} />
      )}

      <Dialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelId(null)}>Keep Appointment</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? "Cancelling..." : "Cancel Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
