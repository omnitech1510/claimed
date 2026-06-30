import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAccessStatus, daysLeftInTrial } from "@/lib/access";
import SignOutButton from "./SignOutButton";
import NotifyButton from "./NotifyButton";

export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const status = getAccessStatus(profile);
  const daysLeft = daysLeftInTrial(profile);

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 border-b border-ink-soft/20">
        <Link href="/dashboard" className="font-mono text-lg">
          claimed.
        </Link>
        <div className="flex items-center gap-4">
          <StatusBadge status={status} daysLeft={daysLeft} />
          <NotifyButton />
          <SignOutButton />
        </div>
      </header>
      <main className="px-6 py-10 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}

function StatusBadge({ status, daysLeft }) {
  if (status === "active") {
    return (
      <span className="font-mono text-xs px-3 py-1 bg-claim text-paper rounded-sm">
        plan active
      </span>
    );
  }
  if (status === "trial") {
    return (
      <Link
        href="/billing"
        className="font-mono text-xs px-3 py-1 border border-ink-soft/40 rounded-sm hover:border-stamp"
      >
        {daysLeft} day{daysLeft === 1 ? "" : "s"} left in trial
      </Link>
    );
  }
  return (
    <Link
      href="/billing"
      className="font-mono text-xs px-3 py-1 bg-stamp text-paper rounded-sm"
    >
      trial ended — pick a plan
    </Link>
  );
}
