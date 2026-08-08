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
import { getMedicalRecords } from "@/actions/medical-records";
import { Plus, Search, MoreHorizontal, Eye, FileText, Pill } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function MedicalRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const result = await getMedicalRecords({ search: search || undefined, page, limit: 10 });
    if (result.success) {
      setRecords(result.data);
      setPagination(result.pagination);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }, [search, page]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const columns = [
    {
      accessorKey: "patient",
      header: "Patient",
      cell: ({ row }) => {
        const p = row.original.patient;
        return <div><p className="font-medium">{p.firstName} {p.lastName}</p></div>;
      },
    },
    {
      accessorKey: "doctor",
      header: "Doctor",
      cell: ({ row }) => {
        const d = row.original.doctor;
        return <div><p className="font-medium">Dr. {d.user.firstName} {d.user.lastName}</p><p className="text-xs text-muted-foreground">{d.department.name}</p></div>;
      },
    },
    {
      accessorKey: "diagnosis",
      header: "Diagnosis",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.diagnosis || "—"}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.createdAt), "MMM dd, yyyy"),
    },
    {
      accessorKey: "prescriptions",
      header: "Prescriptions",
      cell: ({ row }) => <Badge variant="secondary">{row.original.prescriptions.length}</Badge>,
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
            <DropdownMenuItem onClick={() => router.push(`/medical-records/${row.original.id}`)}>
              <Eye className="mr-2 size-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/medical-records/${row.original.id}/edit`)}>
              <FileText className="mr-2 size-4" /> Edit Record
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/prescriptions/new?medicalRecordId=${row.original.id}`)}>
              <Pill className="mr-2 size-4" /> Add Prescription
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Medical Records"
        description="View and manage patient medical records"
        breadcrumbs={[{ label: "Medical Records" }]}
      >
        <Link href="/medical-records/new">
          <Button><Plus className="mr-2 size-4" />Create Record</Button>
        </Link>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search records..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : (
        <DataTable columns={columns} data={records} pagination={pagination} onPageChange={setPage} />
      )}
    </div>
  );
}
