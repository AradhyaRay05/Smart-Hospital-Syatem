"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormSelect } from "@/components/shared/form-select";
import { UserRound, Loader2, MapPin, CalendarDays } from "lucide-react";
import { toast } from "sonner";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    city: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    bloodGroup: "",
    emergencyContact: "",
  });
  const [errors, setErrors] = useState({});

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Enter full first name";
    if (!form.gender) next.gender = "Select gender";
    if (!form.dateOfBirth) next.dateOfBirth = "Enter date of birth";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) {
      next.phone = "Enter valid 10-digit phone";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please complete required details");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile completed");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Failed to save profile");
      }
    } catch {
      toast.error("Failed to save profile");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-xl">
      <Card className="shadow-card overflow-hidden">
        <div className="gradient-primary px-6 py-8 text-white">
          <div className="mb-4 inline-flex rounded-2xl bg-white/15 p-3">
            <UserRound className="size-7" />
          </div>
          <h1 className="text-2xl font-bold">Complete your profile</h1>
          <p className="mt-1 text-sm text-blue-100">
            Tell us a few details so we can personalize your healthcare experience.
          </p>
        </div>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} placeholder="Enter first name" />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} placeholder="Enter last name" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Gender *</Label>
                <FormSelect
                  options={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ]}
                  value={form.gender}
                  onValueChange={(v) => setField("gender", v)}
                  placeholder="Select gender"
                />
                {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><CalendarDays className="size-3.5" /> Date of Birth *</Label>
                <Input type="date" value={form.dateOfBirth} onChange={(e) => setField("dateOfBirth", e.target.value)} />
                {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><MapPin className="size-3.5" /> City</Label>
                <Input value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="e.g. Mumbai" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <FormSelect
                  options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => ({ value: g, label: g }))}
                  value={form.bloodGroup}
                  onValueChange={(v) => setField("bloodGroup", v)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <Input value={form.emergencyContact} onChange={(e) => setField("emergencyContact", e.target.value)} placeholder="Optional" />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save & Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
