import { ensureUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Calendar, Shield, IdCard } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  let user = null;

  try {
    user = await ensureUser();
  } catch (e) {
    console.error("Profile load error:", e.message);
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Card><CardContent className="p-8 text-center">
          <p className="text-muted-foreground">You are not signed in.</p>
        </CardContent></Card>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Your account and personal information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="size-20 mb-4">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <Badge className="mt-2" variant="secondary">{user.role}</Badge>
            <Separator className="my-4" />
            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span>{user.email || "—"}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>+91 {user.phone}</span>
                </div>
              )}
              {user.city && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{user.city}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <IdCard className="size-4 text-muted-foreground" />
                <span>{user.employeeId || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {user.patient && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Patient Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="font-medium">{user.patient.gender}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth</span>
                  <span className="font-medium">
                    {new Date(user.patient.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Group</span>
                  <span className="font-medium">{user.patient.bloodGroup || "—"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emergency Contact</span>
                  <span className="font-medium">{user.patient.emergencyContact || "—"}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {user.doctor && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Doctor Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium">{user.doctor.department?.name || "—"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization</span>
                  <span className="font-medium">{user.doctor.specialization || "—"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Qualification</span>
                  <span className="font-medium">{user.doctor.qualification || "—"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{user.doctor.experience || 0} years</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="size-4" /> Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profile Status</span>
                <Badge variant={user.profileComplete ? "default" : "secondary"}>
                  {user.profileComplete ? "Complete" : "Incomplete"}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account ID</span>
                <span className="font-mono text-xs">{user.id.slice(0, 12)}...</span>
              </div>
              {!user.profileComplete && (
                <>
                  <Separator />
                  <Link href="/complete-profile" className="font-medium text-primary hover:underline">
                    Complete your profile →
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
