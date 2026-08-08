"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAppointmentById, cancelAppointment, completeAppointment } from "@/actions/appointments";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, XCircle, CheckCircle, UserCog, Users, Calendar, FileText } from "lucide-react";

export default function AppointmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointment = async () => {
    const result = await getAppointmentById(params.id);
    if (result.success) {
      setAppointment(result.data);
    } else {
      toast.error(result.message);
      router.push("/appointments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointment();
  }, [params.id]);

  const handleCancel = async () => {
    setActionLoading(true);
    const result = await cancelAppointment(params.id);
    if (result.success) {
      toast.success(result.message);
      fetchAppointment();
    } else {
      toast.error(result.message);
    }
    setActionLoading(false);
  };

  const handleComplete = async () => {
    setActionLoading(true);
    const result = await completeAppointment(params.id);
    if (result.success) {
      toast.success(result.message);
      fetchAppointment();
    } else {
      toast.error(result.message);
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!appointment) return null;

  return (
    <div>
      <PageHeader
        title="Appointment Details"
        description={`Appointment #${appointment.id.slice(0, 8)}`}
        breadcrumbs={[
          { label: "Appointments", href: "/appointments" },
          { label: "Details" },
        ]}
      >
        {appointment.status === "SCHEDULED" && (
          <div className="flex gap-2">
            <Button onClick={handleComplete} disabled={actionLoading}>
              <CheckCircle className="mr-2 size-4" />
              Complete
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={actionLoading}>
              <XCircle className="mr-2 size-4" />
              Cancel
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="size-4" />
              Appointment Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={appointment.status === "SCHEDULED" ? "default" : "secondary"}>
                {appointment.status}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{format(new Date(appointment.appointmentDate), "MMMM dd, yyyy")}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{appointment.appointmentTime}</span>
            </div>
            {appointment.reason && (
              <>
                <Separator />
                <div>
                  <span className="text-muted-foreground">Reason</span>
                  <p className="mt-1">{appointment.reason}</p>
                </div>
              </>
            )}
            {appointment.notes && (
              <>
                <Separator />
                <div>
                  <span className="text-muted-foreground">Notes</span>
                  <p className="mt-1">{appointment.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserCog className="size-4" />
                Doctor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}</p>
              <p className="text-sm text-muted-foreground">
                {appointment.doctor.department.name} &bull; {appointment.doctor.specialization}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="size-4" />
                Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{appointment.patient.firstName} {appointment.patient.lastName}</p>
              <p className="text-sm text-muted-foreground">{appointment.patient.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="size-4" />
                Linked Records
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Medical Record</span>
                <Badge variant={appointment.medicalRecord ? "default" : "secondary"}>
                  {appointment.medicalRecord ? "Created" : "Not yet"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bill</span>
                <Badge variant={appointment.bill ? "default" : "secondary"}>
                  {appointment.bill ? `$${appointment.bill.totalAmount}` : "Not generated"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
