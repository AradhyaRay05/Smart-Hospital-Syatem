"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormSelect } from "@/components/shared/form-select";
import { verifyRegistrationCode } from "@/actions/registration-codes";
import { Activity, Loader2, Eye, EyeOff, Users, Stethoscope, Shield, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [staffRole, setStaffRole] = useState("");
  const [staffStep, setStaffStep] = useState("select");
  const [regCode, setRegCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!firstName || !email || !password) { toast.error("Please fill in all required fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, phone, role: "PATIENT" }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Registration successful");
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!regCode.trim()) { toast.error("Please enter a registration code"); return; }
    setVerifying(true);
    const result = await verifyRegistrationCode(regCode.trim(), staffRole);
    setVerificationResult(result);
    setVerifying(false);
    if (result.valid) { toast.success("Code verified! Complete your registration below."); }
  };

  const handleStaffRegister = async (e) => {
    e.preventDefault();
    if (!firstName || !email || !password) { toast.error("Please fill in all required fields"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, phone, role: staffRole, registrationCodeId: verificationResult?.codeId }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Registration successful");
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  if (mode === "patient") {
    return (
      <div className="flex flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="gradient-primary rounded-lg p-1.5"><Activity className="size-5 text-white" /></div>
          <span className="text-xl font-bold">SHDS</span>
        </Link>

        <Card className="w-full shadow-card">
          <CardHeader className="text-center">
            <Badge variant="secondary" className="mb-2 w-fit mx-auto">Patient</Badge>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Register to access your healthcare portal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="firstName">First Name *</Label><Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}Create Account
              </Button>
            </form>

            <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div></div>

            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              <svg className="mr-2 size-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Sign up with Google
            </Button>

            <Button variant="ghost" size="sm" className="w-full" onClick={() => setMode(null)}>Back to options</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "staff") {
    if (staffStep === "select") {
      return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <Link href="/" className="flex items-center gap-2">
            <div className="gradient-primary rounded-lg p-1.5"><Activity className="size-5 text-white" /></div>
            <span className="text-xl font-bold">SHDS</span>
          </Link>
          <Badge variant="secondary">Staff Registration</Badge>
          <h1 className="text-2xl font-bold">Select Your Role</h1>
          <div className="grid w-full gap-3">
            {[{ role: "DOCTOR", icon: Stethoscope, label: "Doctor", desc: "Clinical staff managing patient care" }, { role: "RECEPTIONIST", icon: Users, label: "Receptionist", desc: "Front-desk operations and scheduling" }, { role: "ADMIN", icon: Shield, label: "Administrator", desc: "Hospital management and administration" }].map((opt) => (
              <button key={opt.role} onClick={() => { setStaffRole(opt.role); setStaffStep("verify"); }}
                className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50 ${staffRole === opt.role ? "border-primary bg-primary/5" : ""}`}>
                <div className="rounded-lg bg-primary/10 p-2"><opt.icon className="size-5 text-primary" /></div>
                <div><p className="font-medium">{opt.label}</p><p className="text-sm text-muted-foreground">{opt.desc}</p></div>
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setMode(null)}>Back to options</Button>
        </div>
      );
    }

    if (staffStep === "verify") {
      return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <Link href="/" className="flex items-center gap-2">
            <div className="gradient-primary rounded-lg p-1.5"><Activity className="size-5 text-white" /></div>
            <span className="text-xl font-bold">SHDS</span>
          </Link>
          <Badge variant="secondary">{staffRole}</Badge>
          <h1 className="text-2xl font-bold">Enter Registration Code</h1>
          <Card className="w-full"><CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="regCode">Employee Registration Code</Label>
              <Input id="regCode" placeholder="e.g., DOC-84KM-PX21" value={regCode} onChange={(e) => setRegCode(e.target.value.toUpperCase())} className="font-mono text-lg text-center" />
            </div>
            {verificationResult && (
              <div className={`flex items-center gap-2 rounded-lg p-3 text-sm ${verificationResult.valid ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {verificationResult.valid ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                {verificationResult.valid ? "Code verified successfully!" : verificationResult.error}
              </div>
            )}
            {!verificationResult?.valid ? (
              <Button className="w-full" onClick={handleVerifyCode} disabled={verifying}>{verifying && <Loader2 className="mr-2 size-4 animate-spin" />}Verify Code</Button>
            ) : (
              <form onSubmit={handleStaffRegister} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>First Name *</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Last Name</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
                </div>
                <div className="space-y-2"><Label>Email *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="space-y-2"><Label>Password *</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>{loading && <Loader2 className="mr-2 size-4 animate-spin" />}Complete Registration</Button>
              </form>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setStaffStep("select"); setVerificationResult(null); setRegCode(""); }}>Change Role</Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setMode(null); setStaffStep("select"); setVerificationResult(null); setRegCode(""); }}>Back</Button>
            </div>
          </CardContent></Card>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <Link href="/" className="flex items-center gap-2">
        <div className="gradient-primary rounded-lg p-1.5"><Activity className="size-5 text-white" /></div>
        <span className="text-xl font-bold">SHDS</span>
      </Link>
      <div className="text-center"><h1 className="text-2xl font-bold">Create Account</h1><p className="text-sm text-muted-foreground">Choose how you want to register</p></div>
      <div className="grid w-full gap-4">
        <button onClick={() => setMode("patient")} className="flex items-center gap-4 rounded-xl border p-6 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-card-hover">
          <div className="rounded-xl bg-blue-50 p-3"><Users className="size-6 text-blue-600" /></div>
          <div><p className="text-lg font-semibold">Patient Registration</p><p className="text-sm text-muted-foreground">Register as a patient to book appointments and access your medical records</p></div>
        </button>
        <button onClick={() => setMode("staff")} className="flex items-center gap-4 rounded-xl border p-6 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-card-hover">
          <div className="rounded-xl bg-green-50 p-3"><Stethoscope className="size-6 text-green-600" /></div>
          <div><p className="text-lg font-semibold">Healthcare Staff</p><p className="text-sm text-muted-foreground">Register using an Employee Registration Code from your administrator</p></div>
        </button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
