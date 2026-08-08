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
import { getBills, markBillPaid } from "@/actions/billing";
import { FormSelect } from "@/components/shared/form-select";
import { Plus, Search, MoreHorizontal, Eye, CheckCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function BillingPage() {
  const router = useRouter();
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    const result = await getBills({ search: search || undefined, paymentStatus: statusFilter !== "all" ? statusFilter : undefined, page, limit: 10 });
    if (result.success) { setBills(result.data); setPagination(result.pagination); }
    else { toast.error(result.message); }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => { fetchBills(); }, [fetchBills]);

  const handleMarkPaid = async (id) => {
    const result = await markBillPaid(id, "CASH");
    if (result.success) { toast.success(result.message); fetchBills(); }
    else { toast.error(result.message); }
  };

  const columns = [
    {
      accessorKey: "patient",
      header: "Patient",
      cell: ({ row }) => <p className="font-medium">{row.original.patient.firstName} {row.original.patient.lastName}</p>,
    },
    {
      accessorKey: "doctor",
      header: "Doctor",
      cell: ({ row }) => {
        const d = row.original.appointment?.doctor;
        return d ? <p className="text-muted-foreground">Dr. {d.user.firstName} {d.user.lastName}</p> : "—";
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => <p className="font-medium">${row.original.totalAmount.toFixed(2)}</p>,
    },
    {
      accessorKey: "paymentStatus",
      header: "Status",
      cell: ({ row }) => <Badge variant={row.original.paymentStatus === "PAID" ? "default" : "secondary"}>{row.original.paymentStatus}</Badge>,
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => row.original.paymentMethod || "—",
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
            <DropdownMenuItem onClick={() => router.push(`/billing/${row.original.id}`)}>
              <Eye className="mr-2 size-4" /> View Invoice
            </DropdownMenuItem>
            {row.original.paymentStatus === "PENDING" && (
              <DropdownMenuItem onClick={() => handleMarkPaid(row.original.id)}>
                <CheckCircle className="mr-2 size-4" /> Mark as Paid
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Billing" description="Manage invoices and payments" breadcrumbs={[{ label: "Billing" }]}>
        <Link href="/billing/new"><Button><Plus className="mr-2 size-4" />Generate Bill</Button></Link>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bills..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <FormSelect
          options={[{ value: "all", label: "All Status" }, { value: "PENDING", label: "Pending" }, { value: "PAID", label: "Paid" }]}
          onValueChange={(val) => { setStatusFilter(val); setPage(1); }}
          placeholder="Filter by status"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : (
        <DataTable columns={columns} data={bills} pagination={pagination} onPageChange={setPage} />
      )}
    </div>
  );
}
