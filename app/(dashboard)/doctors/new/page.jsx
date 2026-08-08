"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createDoctor } from "@/actions/doctors";
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

const createDoctorSchema = z.object({
  email: z.string().email("Valid email is required"),
  firstName: z.string().min(2, "First name is required").max(50),
  lastName: z.string().min(2, "Last name is required").max(50),
  departmentId: z.string().min(1, "Department is required"),
  specialization: z.string().min(2, "Specialization is required").max(100),
  qualification: z.string().min(2, "Qualification is required").max(200),
  experience: z.coerce.number().min(0).max(70),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
});

export default function NewDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      departmentId: "",
      specialization: "",
      qualification: "",
      experience: 0,
      phone: "",
    },
  });

  useEffect(() => {
    getAllDepartments().then((res) => {
      if (res.success) setDepartments(res.data);
    });
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await createDoctor(data);
    if (result.success) {
      toast.success(result.message);
      router.push("/doctors");
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="Register Doctor"
        description="Add a new doctor to the system"
        breadcrumbs={[
          { label: "Doctors", href: "/doctors" },
          { label: "Register Doctor" },
        ]}
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                <Input id="firstName" placeholder="John" {...register("firstName")} />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                <Input id="lastName" placeholder="Doe" {...register("lastName")} />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" placeholder="doctor@hospital.com" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
            </div>

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
                <Input id="specialization" placeholder="e.g., Cardiologist" {...register("specialization")} />
                {errors.specialization && <p className="text-sm text-destructive">{errors.specialization.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification <span className="text-destructive">*</span></Label>
                <Input id="qualification" placeholder="e.g., MD, MBBS" {...register("qualification")} />
                {errors.qualification && <p className="text-sm text-destructive">{errors.qualification.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input id="experience" type="number" min="0" {...register("experience")} />
                {errors.experience && <p className="text-sm text-destructive">{errors.experience.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
                <Input id="phone" placeholder="Phone number" {...register("phone")} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Register Doctor
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/doctors")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
