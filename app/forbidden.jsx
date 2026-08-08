import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <ShieldX className="size-10 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold">403</h1>
      <h2 className="text-xl font-semibold">Access Denied</h2>
      <p className="max-w-md text-muted-foreground">
        You do not have permission to access this page. Contact your administrator if you believe this is an error.
      </p>
      <Link href="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
