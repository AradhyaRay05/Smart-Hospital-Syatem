"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Loader2, Eye, EyeOff, Phone, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [tab, setTab] = useState("phone");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const startTimer = () => {
    setTimer(30);
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Login successful");
        router.push(data.needsProfile ? "/complete-profile" : redirect);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    }
    setLoading(false);
  };

  const handleSendOtp = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digits }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        startTimer();
        toast.success(data.devCode ? `OTP sent (dev: ${data.devCode})` : "OTP sent successfully");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch {
      toast.error("Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Enter a valid OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ""), otp }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Login successful");
        router.push(data.needsProfile ? "/complete-profile" : redirect);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch {
      toast.error("OTP verification failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <Link href="/" className="flex items-center gap-2">
        <div className="gradient-primary rounded-lg p-1.5">
          <Activity className="size-5 text-white" />
        </div>
        <span className="text-xl font-bold">SHDS</span>
      </Link>

      <Card className="w-full shadow-card">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in with phone OTP or email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setTab("phone")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${tab === "phone" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"}`}
            >
              <Phone className="size-4" /> Phone OTP
            </button>
            <button
              type="button"
              onClick={() => setTab("email")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${tab === "email" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"}`}
            >
              <Mail className="size-4" /> Email
            </button>
          </div>

          {tab === "phone" ? (
            <form onSubmit={otpSent ? handleVerifyOtp : (e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-4">
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <div className="flex overflow-hidden rounded-lg border">
                  <div className="flex items-center gap-1 bg-primary/10 px-3 text-sm font-semibold text-primary">
                    +91
                  </div>
                  <Input
                    className="border-0 rounded-none focus-visible:ring-0"
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    disabled={otpSent}
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <Label>One-Time Password</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                    <Input
                      className="pl-9 tracking-[0.35em] font-semibold text-center text-lg"
                      placeholder="••••••"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>OTP sent to +91 {phone}</span>
                    {timer > 0 ? (
                      <span>Resend in {timer}s</span>
                    ) : (
                      <button type="button" className="font-medium text-primary" onClick={handleSendOtp}>
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {otpSent ? "Verify OTP" : "Send OTP"}
              </Button>

              {otpSent && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setTimer(0);
                  }}
                >
                  Change mobile number
                </Button>
              )}
            </form>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@hospital.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => { window.location.href = "/api/auth/google"; }}>
            <svg className="mr-2 size-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
