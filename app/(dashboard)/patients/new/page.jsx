"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema } from "@/lib/validations";
import { createPatient } from "@/actions/patients";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/shared/form-select";
import { toast } from "sonner";
import {
  HeartPulse,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  CalendarDays,
} from "lucide-react";

const required = <span className="text-destructive">*</span>;

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      phone: "",
      emergencyContact: "",
      address: "",
    },
  });

  const gender = watch("gender");
  const bloodGroup = watch("bloodGroup");

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await createPatient(data);
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
      router.push("/patients");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Register Patient"
        description="Capture patient demographics and contact details"
        breadcrumbs={[
          { label: "Patients", href: "/patients" },
          { label: "Register" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="shadow-card overflow-hidden">
          <div className="gradient-primary px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-2.5">
                <UserRound className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Patient Information</h2>
                <p className="text-sm text-blue-100">Basic identity and medical basics</p>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <UserRound className="size-4" /> Personal Details
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name {required}</Label>
                    <Input placeholder="Enter first name" {...register("firstName")} />
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name {required}</Label>
                    <Input placeholder="Enter last name" {...register("lastName")} />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Gender {required}</Label>
                    <FormSelect
                      options={[
                        { value: "MALE", label: "Male" },
                        { value: "FEMALE", label: "Female" },
                        { value: "OTHER", label: "Other" },
                      ]}
                      value={gender}
                      onValueChange={(v) => setValue("gender", v, { shouldValidate: true })}
                      placeholder="Select gender"
                    />
                    {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <CalendarDays className="size-3.5" /> Date of Birth {required}
                    </Label>
                    <Input type="date" {...register("dateOfBirth")} />
                    {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <FormSelect
                      options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => ({ value: g, label: g }))}
                      value={bloodGroup}
                      onValueChange={(v) => setValue("bloodGroup", v)}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Mail className="size-3.5" /> Email
                    </Label>
                    <Input type="email" placeholder="patient@email.com" {...register("email")} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
              </section>

              <section className="space-y-4 border-t pt-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Phone className="size-4" /> Contact Details
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Phone {required}</Label>
                    <div className="flex overflow-hidden rounded-lg border">
                      <div className="flex items-center bg-primary/10 px-3 text-sm font-semibold text-primary">+91</div>
                      <Input
                        className="border-0 rounded-none focus-visible:ring-0"
                        placeholder="10-digit mobile"
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact</Label>
                    <Input placeholder="Optional emergency number" {...register("emergencyContact")} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="flex items-center gap-1">
                      <MapPin className="size-3.5" /> Address / City
                    </Label>
                    <Textarea rows={3} placeholder="House no, street, city" {...register("address")} />
                  </div>
                </div>
              </section>

              <div className="flex flex-wrap gap-3 border-t pt-6">
                <Button type="submit" className="gradient-primary border-0" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                  Register Patient
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/patients")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-card">
            <CardContent className="space-y-3 p-5">
              <div className="inline-flex rounded-xl bg-blue-50 p-2.5 text-primary">
                <HeartPulse className="size-5" />
              </div>
              <h3 className="font-semibold">Quick tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use the patient&apos;s legal name as on ID documents.</li>
                <li>• Phone number is used for appointment reminders.</li>
                <li>• Emergency contact helps reception during critical care.</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="space-y-3 p-5">
              <div className="inline-flex rounded-xl bg-green-50 p-2.5 text-green-600">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="font-semibold">Data privacy</h3>
              <p className="text-sm text-muted-foreground">
                Patient records are role-protected. Only authorized hospital staff can view or update this information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
