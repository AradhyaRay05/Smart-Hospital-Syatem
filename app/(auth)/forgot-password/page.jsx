"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth-reset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Mail, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result.success) {
      setSubmitted(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="gradient-primary rounded-xl p-2 shadow-md">
            <Activity className="size-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Smart Hospital Digitalization System
          </span>
        </div>

        <Card className="w-full shadow-soft border-border/40 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 sm:p-10">
            {submitted ? (
              <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Check your inbox</h2>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                  We sent a 5-minute password reset link to{" "}
                  <span className="font-bold text-foreground">{email}</span>. Please click the link in the email to reset your password.
                </p>
                <div className="pt-4 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl font-bold border-border/60"
                    onClick={() => setSubmitted(false)}
                  >
                    Resend Email
                  </Button>
                  <Link href="/sign-in" className="block w-full">
                    <Button className="w-full h-11 rounded-xl font-bold gradient-primary border-0 text-white shadow-md hover:shadow-lg">
                      Return to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-1.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight whitespace-nowrap">
                    Reset your password
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground">
                    Enter your email and we will send a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 rounded-xl bg-background/50 border-border/60 focus-visible:ring-primary/30 font-medium"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl gradient-primary border-0 font-bold text-base text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" /> Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <div className="pt-2 text-center">
                    <Link
                      href="/sign-in"
                      className="inline-flex items-center text-xs font-semibold text-primary hover:underline transition-colors"
                    >
                      <ArrowLeft className="mr-1.5 size-3.5" /> Back to sign in
                    </Link>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
