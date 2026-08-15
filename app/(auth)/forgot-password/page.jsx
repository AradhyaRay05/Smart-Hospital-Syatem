"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth-reset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { KeyRound, ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";
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
      <Card className="w-full max-w-md shadow-2xl border-border/40 bg-card rounded-3xl overflow-hidden">
        <CardContent className="p-8 sm:p-10">
          <div className="mb-6">
            <Link
              href="/sign-in"
              className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-1.5 size-4" /> Back to Sign In
            </Link>
          </div>

          {submitted ? (
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Check your inbox</h2>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                We sent a 5-minute password reset link to{" "}
                <span className="font-bold text-foreground">{email}</span>. Please click the link in the email to reset your password.
              </p>
              <div className="pt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl font-bold"
                  onClick={() => setSubmitted(false)}
                >
                  Resend Email
                </Button>
                <Link href="/sign-in" className="block w-full">
                  <Button className="w-full gradient-primary border-0 h-11 rounded-xl font-bold shadow-md hover:shadow-lg">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 space-y-2 text-center sm:text-left">
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                  <KeyRound className="size-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-sm font-medium text-muted-foreground">
                  Enter your email address below and we&apos;ll send you a single-use password reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-sm">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-xl bg-background/50 border-border/60 focus-visible:ring-primary/30 font-medium"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-primary border-0 h-12 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" /> Sending Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
