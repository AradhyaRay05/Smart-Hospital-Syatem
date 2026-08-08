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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPrescriptions } from "@/actions/prescriptions";
import { Plus, Search, MoreHorizontal, Eye, Pill } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    const result = await getPrescriptions({ search: search || undefined, page, limit: 10 });
    if (result.success) { setPrescriptions(result.data); setPagination(result.pagination); }
    else { toast.error(result.message); }
    setLoading(false);
  }, [search, page]);

  useEffect(() => { fetchPrescriptions(); }, [fetchPrescriptions]);

  const columns = [
    {
      accessorKey: "patient",
      header: "Patient",
      cell: ({ row }) => {
        const p = row.original.medicalRecord?.patient;
        return p ? <p className="font-medium">{p.firstName} {p.lastName}</p> : "—";
      },
    },
    {
      accessorKey: "doctor",
      header: "Doctor",
      cell: ({ row }) => <p className="font-medium">Dr. {row.original.doctor.user.firstName} {row.original.doctor.user.lastName}</p>,
    },
    {
      accessorKey: "items",
      header: "Medicines",
      cell: ({ row }) => <Badge variant="secondary">{row.original.items.length} item(s)</Badge>,
    },
    {
      accessorKey: "medicines",
      header: "Medicine Names",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.items.map(i => i.medicineName).join(", ")}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.createdAt), "MMM dd, yyyy"),
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
            <DropdownMenuItem onClick={() => router.push(`/prescriptions/${row.original.id}`)}>
              <Eye className="mr-2 size-4" /> View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Prescriptions" description="View and manage patient prescriptions" breadcrumbs={[{ label: "Prescriptions" }]} />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search prescriptions..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : (
        <DataTable columns={columns} data={prescriptions} pagination={pagination} onPageChange={setPage} />
      )}
    </div>
  );
}
