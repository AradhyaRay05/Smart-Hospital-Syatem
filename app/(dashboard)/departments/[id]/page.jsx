"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getDepartmentById } from "@/actions/departments";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pencil, Loader2, UserCog, Phone } from "lucide-react";
import { toast } from "sonner";

export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartment() {
      const result = await getDepartmentById(params.id);
      if (result.success) {
        setDepartment(result.data);
      } else {
        toast.error(result.message);
        router.push("/departments");
      }
      setLoading(false);
    }
    fetchDepartment();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!department) return null;

  return (
    <div>
      <PageHeader
        title={department.name}
        description={department.description || "No description provided"}
        breadcrumbs={[
          { label: "Departments", href: "/departments" },
          { label: department.name },
        ]}
      >
        <Link href={`/departments/${department.id}/edit`}>
          <Button>
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Department Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={department.status === "ACTIVE" ? "default" : "secondary"}>
                {department.status}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Total Doctors</p>
              <p className="text-2xl font-bold">{department._count.doctors}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm">
                {new Date(department.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Doctors in this Department</CardTitle>
          </CardHeader>
          <CardContent>
            {department.doctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserCog className="mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium">No doctors assigned</p>
                <p className="text-xs text-muted-foreground">
                  Add doctors to this department from the Doctors module.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {department.doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <UserCog className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Dr. {doctor.user.firstName} {doctor.user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doctor.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="size-3" />
                          {doctor.phone}
                        </div>
                      )}
                      <Badge variant={doctor.available ? "default" : "secondary"}>
                        {doctor.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
