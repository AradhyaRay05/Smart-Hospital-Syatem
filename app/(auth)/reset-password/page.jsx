"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordWithToken } from "@/actions/auth-reset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Missing or invalid password reset token.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await resetPasswordWithToken({ token, newPassword: password });
    setLoading(false);

    if (result.success) {
      setCompleted(true);
      toast.success(result.message);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } else {
      toast.error(result.message);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          <AlertCircle className="size-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">Invalid Reset Link</h2>
        <p className="text-sm font-medium text-muted-foreground">
          This password reset link is invalid or missing token parameters.
        </p>
        <div className="pt-2">
          <Link href="/forgot-password">
            <Button className="gradient-primary border-0 h-11 rounded-xl font-bold px-6">
              Request New Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">Password Reset Complete</h2>
        <p className="text-sm font-medium text-muted-foreground">
          Your password has been updated successfully. Redirecting you to sign in...
        </p>
        <div className="pt-2">
          <Link href="/sign-in">
            <Button className="gradient-primary border-0 h-11 rounded-xl font-bold px-8">
              Sign In Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 space-y-2 text-center sm:text-left">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
          <Lock className="size-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password" className="font-bold text-sm">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 h-12 rounded-xl bg-background/50 border-border/60 focus-visible:ring-primary/30 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="font-bold text-sm">
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              <Loader2 className="mr-2 size-5 animate-spin" /> Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
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

          <Suspense fallback={
            <div className="flex justify-center py-10">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
