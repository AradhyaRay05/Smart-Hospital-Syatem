"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { verifyRegistrationCode } from "@/actions/registration-codes";
import { Activity, Loader2, Eye, EyeOff, Users, Stethoscope, Shield, CheckCircle, XCircle, ChevronLeft, ArrowRight, Building2 } from "lucide-react";
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
      <div className="flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="gradient-primary rounded-xl p-2 shadow-md"><Activity className="size-6 text-white" /></div>
          <span className="text-2xl font-bold tracking-tight text-foreground">SHDS</span>
        </Link>

        <Card className="w-full shadow-soft border-border/40 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center relative pb-6 border-b border-border/20 bg-muted/20">
            <Button variant="ghost" size="icon" className="absolute left-4 top-4 rounded-full" onClick={() => setMode(null)}>
              <ChevronLeft className="size-5" />
            </Button>
            <div className="mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center">
              <Users className="size-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight">Patient Account</CardTitle>
            <CardDescription className="font-medium text-sm">Register to access your healthcare portal</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-foreground/80">First Name <span className="text-destructive">*</span></Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-11 rounded-xl bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-foreground/80">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-11 rounded-xl bg-background/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">Email Address <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl bg-background/50" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl bg-background/50 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-foreground/80">Phone Number</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl bg-background/50" />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl gradient-primary border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mt-2" disabled={loading}>
                {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : <Users className="mr-2 size-5" />}
                Create Patient Account
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
              <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider">
                <span className="bg-card px-4 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-11 rounded-xl border-border/50 bg-background/50 hover:bg-muted font-semibold transition-all" onClick={handleGoogleLogin}>
              <svg className="mr-2 size-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Sign up with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "staff") {
    if (staffStep === "select") {
      return (
        <div className="flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="gradient-primary rounded-xl p-2 shadow-md"><Activity className="size-6 text-white" /></div>
            <span className="text-2xl font-bold tracking-tight text-foreground">SHDS</span>
          </Link>
          
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-0 font-bold px-3 py-1 text-xs">Staff Portal</Badge>
            <h1 className="text-3xl font-extrabold tracking-tight">Select Your Role</h1>
            <p className="text-muted-foreground font-medium text-sm">Choose your designation to proceed</p>
          </div>

          <div className="grid w-full gap-4">
            {[
              { role: "DOCTOR", icon: Stethoscope, label: "Doctor", desc: "Clinical staff managing patient care", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", border: "hover:border-blue-300 dark:hover:border-blue-700" },
              { role: "RECEPTIONIST", icon: Users, label: "Receptionist", desc: "Front-desk operations and scheduling", color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20", border: "hover:border-teal-300 dark:hover:border-teal-700" }, 
              { role: "ADMIN", icon: Shield, label: "Administrator", desc: "Hospital management and administration", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20", border: "hover:border-indigo-300 dark:hover:border-indigo-700" }
            ].map((opt, i) => (
              <button 
                key={opt.role} 
                onClick={() => { setStaffRole(opt.role); setStaffStep("verify"); }}
                className={`group flex items-center gap-5 rounded-2xl border bg-card p-5 text-left transition-all duration-300 hover:shadow-hover hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 ${opt.border}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`rounded-xl p-3.5 transition-transform duration-300 group-hover:scale-110 ${opt.bg}`}>
                  <opt.icon className={`size-7 ${opt.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold">{opt.label}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">{opt.desc}</p>
                </div>
                <ChevronRightIcon className="size-5 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </button>
            ))}
          </div>
          <Button variant="ghost" className="mt-4 text-muted-foreground rounded-full hover:bg-muted font-semibold" onClick={() => setMode(null)}>
            <ChevronLeft className="mr-2 size-4" /> Back to options
          </Button>
        </div>
      );
    }

    if (staffStep === "verify") {
      return (
        <div className="flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-500">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="gradient-primary rounded-xl p-2 shadow-md"><Activity className="size-6 text-white" /></div>
            <span className="text-2xl font-bold tracking-tight text-foreground">SHDS</span>
          </Link>
          
          <Card className="w-full shadow-soft border-border/40 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center relative pb-6 border-b border-border/20 bg-muted/20">
              <Button variant="ghost" size="icon" className="absolute left-4 top-4 rounded-full" onClick={() => { setStaffStep("select"); setVerificationResult(null); }}>
                <ChevronLeft className="size-5" />
              </Button>
              <div className="mx-auto mb-3">
                <Badge className="bg-primary hover:bg-primary/90 px-3 py-1 font-bold tracking-wider">{staffRole}</Badge>
              </div>
              <CardTitle className="text-2xl font-extrabold tracking-tight">Security Check</CardTitle>
              <CardDescription className="font-medium text-sm">Enter your assigned registration code</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {!verificationResult?.valid && (
                <div className="space-y-3 animate-in fade-in">
                  <Label htmlFor="regCode" className="text-sm font-semibold text-foreground/80">Registration Code</Label>
                  <Input 
                    id="regCode" 
                    placeholder="e.g., DOC-84KM-PX21" 
                    value={regCode} 
                    onChange={(e) => setRegCode(e.target.value.toUpperCase())} 
                    className="font-mono text-xl text-center h-14 rounded-xl tracking-widest bg-background/50 border-2 focus-visible:border-primary transition-colors uppercase placeholder:text-muted-foreground/40" 
                  />
                  <Button className="w-full h-12 text-base font-bold rounded-xl gradient-primary border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mt-4" onClick={handleVerifyCode} disabled={verifying || !regCode}>
                    {verifying ? <Loader2 className="mr-2 size-5 animate-spin" /> : <Shield className="mr-2 size-5" />}
                    Verify Code
                  </Button>
                </div>
              )}

              {verificationResult && (
                <div className={`flex items-center gap-3 rounded-xl p-4 text-sm font-semibold animate-in zoom-in-95 duration-300 ${verificationResult.valid ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800" : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800"}`}>
                  {verificationResult.valid ? <CheckCircle className="size-6 shrink-0" /> : <XCircle className="size-6 shrink-0" />}
                  <span className="text-base">{verificationResult.valid ? "Code verified securely!" : verificationResult.error}</span>
                </div>
              )}

              {verificationResult?.valid && (
                <form onSubmit={handleStaffRegister} className="space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-500 pt-2">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label className="text-sm font-semibold">First Name <span className="text-destructive">*</span></Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-11 rounded-xl bg-background/50" /></div>
                    <div className="space-y-2"><Label className="text-sm font-semibold">Last Name</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-11 rounded-xl bg-background/50" /></div>
                  </div>
                  <div className="space-y-2"><Label className="text-sm font-semibold">Email Address <span className="text-destructive">*</span></Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl bg-background/50" /></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label className="text-sm font-semibold">Password <span className="text-destructive">*</span></Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl bg-background/50" /></div>
                    <div className="space-y-2"><Label className="text-sm font-semibold">Phone Number</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl bg-background/50" /></div>
                  </div>
                  <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl gradient-accent border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mt-2" disabled={loading}>
                    {loading && <Loader2 className="mr-2 size-5 animate-spin" />} Complete Staff Profile
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Base state: Choose mode
  return (
    <div className="flex flex-col items-center gap-8 w-full animate-in fade-in zoom-in-95 duration-500">
      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <div className="gradient-primary rounded-xl p-2 shadow-md"><Activity className="size-6 text-white" /></div>
        <span className="text-2xl font-bold tracking-tight text-foreground">SHDS</span>
      </Link>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Create an Account</h1>
        <p className="text-muted-foreground font-medium">Choose how you want to register in the system</p>
      </div>

      <div className="grid w-full gap-5">
        <button 
          onClick={() => setMode("patient")} 
          className="group flex flex-col sm:flex-row items-center sm:items-start gap-5 rounded-3xl border border-border/60 bg-card p-6 sm:p-8 text-center sm:text-left transition-all duration-300 hover:shadow-hover hover:border-primary/40 hover:-translate-y-1.5"
        >
          <div className="rounded-2xl bg-sky-50 dark:bg-sky-900/20 p-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
            <Users className="size-8 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-center sm:justify-between">
              <p className="text-xl font-bold text-foreground">Patient Registration</p>
              <ArrowRight className="hidden sm:block size-5 text-muted-foreground opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Register as a patient to book appointments securely, view prescriptions, and access your electronic medical records.
            </p>
          </div>
        </button>

        <button 
          onClick={() => setMode("staff")} 
          className="group flex flex-col sm:flex-row items-center sm:items-start gap-5 rounded-3xl border border-border/60 bg-card p-6 sm:p-8 text-center sm:text-left transition-all duration-300 hover:shadow-hover hover:border-teal-500/40 hover:-translate-y-1.5"
        >
          <div className="rounded-2xl bg-teal-50 dark:bg-teal-900/20 p-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-inner">
            <Building2 className="size-8 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-center sm:justify-between">
              <p className="text-xl font-bold text-foreground">Healthcare Staff</p>
              <ArrowRight className="hidden sm:block size-5 text-muted-foreground opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-teal-600" />
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Doctors, administrators, and receptionists. Requires an Employee Registration Code provided by your hospital admin.
            </p>
          </div>
        </button>
      </div>

      <p className="text-center text-sm font-medium text-muted-foreground bg-background/50 py-2 px-6 rounded-full backdrop-blur-sm mt-4">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-bold text-primary hover:text-primary/80 transition-colors">Sign in here</Link>
      </p>
    </div>
  );
}

// Small helper icon component for the role list
function ChevronRightIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}