"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorSchema } from "@/lib/validations";
import { getDoctorById, updateDoctor } from "@/actions/doctors";
import { getAllDepartments } from "@/actions/departments";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FormSelect } from "@/components/shared/form-select";

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [departments, setDepartments] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorSchema.omit({ email: true, firstName: true, lastName: true })),
    defaultValues: {
      departmentId: "",
      specialization: "",
      qualification: "",
      experience: 0,
      phone: "",
      available: true,
    },
  });

  useEffect(() => {
    Promise.all([
      getDoctorById(params.id),
      getAllDepartments(),
    ]).then(([docRes, deptRes]) => {
      if (docRes.success) {
        const d = docRes.data;
        reset({
          departmentId: d.departmentId,
          specialization: d.specialization,
          qualification: d.qualification,
          experience: d.experience,
          phone: d.phone,
          available: d.available,
        });
      } else {
        toast.error(docRes.message);
        router.push("/doctors");
      }
      if (deptRes.success) setDepartments(deptRes.data);
      setFetching(false);
    });
  }, [params.id, reset, router]);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await updateDoctor(params.id, data);
    if (result.success) {
      toast.success(result.message);
      router.push("/doctors");
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Doctor"
        description="Update doctor information"
        breadcrumbs={[
          { label: "Doctors", href: "/doctors" },
          { label: "Edit Doctor" },
        ]}
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Department <span className="text-destructive">*</span></Label>
              <FormSelect
                options={departments.map((d) => ({ value: d.id, label: d.name }))}
                onValueChange={(val) => setValue("departmentId", val)}
                placeholder="Select department"
              />
              {errors.departmentId && <p className="text-sm text-destructive">{errors.departmentId.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization <span className="text-destructive">*</span></Label>
                <Input id="specialization" {...register("specialization")} />
                {errors.specialization && <p className="text-sm text-destructive">{errors.specialization.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification <span className="text-destructive">*</span></Label>
                <Input id="qualification" {...register("qualification")} />
                {errors.qualification && <p className="text-sm text-destructive">{errors.qualification.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input id="experience" type="number" min="0" {...register("experience")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Update Doctor
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/doctors")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
