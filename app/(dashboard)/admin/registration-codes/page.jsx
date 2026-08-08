"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormSelect } from "@/components/shared/form-select";
import {
  generateRegistrationCode,
  getRegistrationCodes,
  revokeRegistrationCode,
  extendRegistrationCode,
} from "@/actions/registration-codes";
import { getAllDepartments } from "@/actions/departments";
import { Plus, MoreHorizontal, Ban, Clock, Copy, Shield } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function RegistrationCodesPage() {
  const [codes, setCodes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showGenerate, setShowGenerate] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({ role: "DOCTOR", departmentId: "", expiresInDays: 7 });

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    const result = await getRegistrationCodes({ status: statusFilter !== "all" ? statusFilter : undefined, page, limit: 20 });
    if (result.success) { setCodes(result.data); setPagination(result.pagination); }
    else { toast.error(result.message); }
    setLoading(false);
  }, [statusFilter, page]);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  useEffect(() => {
    getAllDepartments().then((res) => {
      if (res.success) setDepartments(res.data);
    });
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    const result = await generateRegistrationCode({
      role: formData.role,
      departmentId: formData.departmentId || null,
      expiresInDays: parseInt(formData.expiresInDays) || 7,
    });
    if (result.success) {
      setGeneratedCode(result.data);
      setShowGenerate(false);
      setShowResult(true);
      fetchCodes();
    } else { toast.error(result.message); }
    setGenerating(false);
  };

  const handleRevoke = async (id) => {
    const result = await revokeRegistrationCode(id);
    if (result.success) { toast.success(result.message); fetchCodes(); }
    else { toast.error(result.message); }
  };

  const handleExtend = async (id) => {
    const result = await extendRegistrationCode(id, 7);
    if (result.success) { toast.success(result.message); fetchCodes(); }
    else { toast.error(result.message); }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const statusVariant = (status) => {
    switch (status) { case "UNUSED": return "default"; case "USED": return "secondary"; case "EXPIRED": return "secondary"; case "REVOKED": return "destructive"; default: return "secondary"; }
  };

  const columns = [
    { accessorKey: "code", header: "Code", cell: ({ row }) => <div className="flex items-center gap-2"><span className="font-mono font-medium">{row.original.code}</span><Button variant="ghost" size="icon-xs" onClick={() => copyCode(row.original.code)}><Copy className="size-3" /></Button></div> },
    { accessorKey: "role", header: "Role", cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge> },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge> },
    { accessorKey: "expiresAt", header: "Expires", cell: ({ row }) => format(new Date(row.original.expiresAt), "MMM dd, yyyy") },
    { accessorKey: "usedBy", header: "Used By", cell: ({ row }) => row.original.usedBy ? `${row.original.usedBy.firstName} ${row.original.usedBy.lastName}` : "—" },
    { accessorKey: "createdAt", header: "Created", cell: ({ row }) => format(new Date(row.original.createdAt), "MMM dd, yyyy") },
    { id: "actions", header: "", cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground"><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => copyCode(row.original.code)}><Copy className="mr-2 size-4" />Copy Code</DropdownMenuItem>
          {row.original.status === "UNUSED" && (<>
            <DropdownMenuItem onClick={() => handleExtend(row.original.id)}><Clock className="mr-2 size-4" />Extend 7 Days</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRevoke(row.original.id)} className="text-destructive"><Ban className="mr-2 size-4" />Revoke</DropdownMenuItem>
          </>)}
        </DropdownMenuContent>
      </DropdownMenu>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Registration Codes" description="Manage employee registration codes" breadcrumbs={[{ label: "Admin" }, { label: "Registration Codes" }]}>
        <Button onClick={() => setShowGenerate(true)}><Plus className="mr-2 size-4" />Generate Code</Button>
      </PageHeader>

      <div className="mb-6 flex gap-4">
        <FormSelect options={[{ value: "all", label: "All Status" }, { value: "UNUSED", label: "Unused" }, { value: "USED", label: "Used" }, { value: "EXPIRED", label: "Expired" }, { value: "REVOKED", label: "Revoked" }]} onValueChange={(val) => { setStatusFilter(val); setPage(1); }} placeholder="Filter by status" />
      </div>

      {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />)}</div> : <DataTable columns={columns} data={codes} pagination={pagination} onPageChange={setPage} />}

      <Dialog open={showGenerate} onOpenChange={setShowGenerate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Generate Registration Code</DialogTitle><DialogDescription>Create a new employee registration code to share with a staff member.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Role <span className="text-destructive">*</span></Label>
              <FormSelect options={[{ value: "DOCTOR", label: "Doctor" }, { value: "RECEPTIONIST", label: "Receptionist" }, { value: "ADMIN", label: "Administrator" }]} onValueChange={(val) => setFormData({ ...formData, role: val })} placeholder="Select role" />
            </div>
            <div className="space-y-2"><Label>Department (optional)</Label>
              <FormSelect options={[{ value: "", label: "None" }, ...departments.map((d) => ({ value: d.id, label: d.name }))]} onValueChange={(val) => setFormData({ ...formData, departmentId: val })} placeholder="Select department" />
            </div>
            <div className="space-y-2"><Label htmlFor="expiresInDays">Expires In (days)</Label><Input id="expiresInDays" type="number" min="1" max="90" value={formData.expiresInDays} onChange={(e) => setFormData({ ...formData, expiresInDays: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowGenerate(false)}>Cancel</Button><Button onClick={handleGenerate} disabled={generating}>{generating ? "Generating..." : "Generate Code"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent>
          <DialogHeader><DialogTitle>Code Generated</DialogTitle><DialogDescription>Share this code securely with the employee. It can only be used once.</DialogDescription></DialogHeader>
          {generatedCode && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted p-4 text-center"><p className="text-2xl font-mono font-bold">{generatedCode.code}</p></div>
              <div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-muted-foreground">Role</p><p className="font-medium">{generatedCode.role}</p></div><div><p className="text-muted-foreground">Expires</p><p className="font-medium">{format(new Date(generatedCode.expiresAt), "MMM dd, yyyy")}</p></div></div>
              <Button className="w-full" onClick={() => { copyCode(generatedCode.code); setShowResult(false); }}><Copy className="mr-2 size-4" />Copy & Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
