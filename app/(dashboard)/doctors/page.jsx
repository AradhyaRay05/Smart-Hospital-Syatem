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
import { getDoctors, deleteDoctor } from "@/actions/doctors";
import { getAllDepartments } from "@/actions/departments";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, UserCog } from "lucide-react";
import { toast } from "sonner";

export default function DoctorsPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [availableFilter, setAvailableFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getAllDepartments().then((res) => {
      if (res.success) setDepartments(res.data);
    });
  }, []);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    const result = await getDoctors({
      search: search || undefined,
      departmentId: departmentFilter !== "all" ? departmentFilter : undefined,
      available: availableFilter !== "all" ? availableFilter : undefined,
      page,
      limit: 10,
    });

    if (result.success) {
      setDoctors(result.data);
      setPagination(result.pagination);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }, [search, departmentFilter, availableFilter, page]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const result = await deleteDoctor(deleteId);
    if (result.success) {
      toast.success(result.message);
      fetchDoctors();
    } else {
      toast.error(result.message);
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Doctor",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials(d.user.firstName, d.user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Dr. {d.user.firstName} {d.user.lastName}</p>
              <p className="text-xs text-muted-foreground">{d.user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "department.name",
      header: "Department",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.department.name}</Badge>
      ),
    },
    {
      accessorKey: "specialization",
      header: "Specialization",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.specialization}</span>
      ),
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: ({ row }) => `${row.original.experience} yrs`,
    },
    {
      accessorKey: "available",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.available ? "default" : "secondary"}>
          {row.original.available ? "Available" : "Unavailable"}
        </Badge>
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
            <DropdownMenuItem onClick={() => router.push(`/doctors/${row.original.id}`)}>
              <Eye className="mr-2 size-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/doctors/${row.original.id}/edit`)}>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteId(row.original.id)} className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Doctors"
        description="Manage hospital doctors and their availability"
        breadcrumbs={[{ label: "Doctors" }]}
      >
        <Link href="/doctors/new">
          <Button>
            <Plus className="mr-2 size-4" />
            Add Doctor
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={departmentFilter} onValueChange={(val) => { setDepartmentFilter(val); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={availableFilter} onValueChange={(val) => { setAvailableFilter(val); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Available</SelectItem>
            <SelectItem value="false">Unavailable</SelectItem>
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
        <DataTable columns={columns} data={doctors} pagination={pagination} onPageChange={setPage} />
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Doctor</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this doctor? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
