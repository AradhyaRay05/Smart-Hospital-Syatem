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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getPatients, deletePatient } from "@/actions/patients";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PatientsPage() {
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    const result = await getPatients({
      search: search || undefined,
      gender: genderFilter !== "all" ? genderFilter : undefined,
      page,
      limit: 10,
    });

    if (result.success) {
      setPatients(result.data);
      setPagination(result.pagination);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }, [search, genderFilter, page]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const result = await deletePatient(deleteId);
    if (result.success) {
      toast.success(result.message);
      fetchPatients();
    } else {
      toast.error(result.message);
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const getInitials = (first, last) => `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

  const columns = [
    {
      accessorKey: "name",
      header: "Patient",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials(p.firstName, p.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{p.firstName} {p.lastName}</p>
              <p className="text-xs text-muted-foreground">{p.user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.gender}</Badge>
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      cell: ({ row }) => format(new Date(row.original.dateOfBirth), "MMM dd, yyyy"),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.phone}</span>
      ),
    },
    {
      accessorKey: "bloodGroup",
      header: "Blood Group",
      cell: ({ row }) => row.original.bloodGroup || "—",
    },
    {
      accessorKey: "_count.appointments",
      header: "Visits",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original._count.appointments}</Badge>
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
            <DropdownMenuItem onClick={() => router.push(`/patients/${row.original.id}`)}>
              <Eye className="mr-2 size-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/patients/${row.original.id}/edit`)}>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteId(row.original.id)} className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Patients"
        description="Manage patient records and medical history"
        breadcrumbs={[{ label: "Patients" }]}
      >
        <Link href="/patients/new">
          <Button>
            <Plus className="mr-2 size-4" />
            Register Patient
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={genderFilter} onValueChange={(val) => { setGenderFilter(val); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
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
        <DataTable columns={columns} data={patients} pagination={pagination} onPageChange={setPage} />
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Patient</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this patient? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Archiving..." : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
