import { createClient } from "@/lib/supabase/server";
import { getAccessStatus, daysLeftInTrial } from "@/lib/access";
import PayButton from "./PayButton";

export default async function BillingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const status = getAccessStatus(profile);
  const daysLeft = daysLeftInTrial(profile);

  if (status === "active") {
    return (
      <div className="max-w-md">
        <div className="ticket px-8 py-8 text-center">
          <p className="font-mono text-xs text-ink-soft mb-2">YOUR PLAN</p>
          <p className="text-2xl font-extrabold mb-2 capitalize">{profile.plan}</p>
          <span className="stamp-claimed inline-block px-4 py-1 text-sm font-semibold uppercase rounded-sm">
            active
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-sm text-ink-soft mb-1">
        {status === "trial"
          ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in your free trial`
          : "Your trial has ended"}
      </p>
      <h1 className="text-3xl font-extrabold mb-10">Pick a plan</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="ticket px-8 py-8">
          <p className="font-mono text-xs text-ink-soft mb-2">ONE TIME</p>
          <p className="text-3xl font-extrabold mb-1">$29.99</p>
          <p className="text-ink-soft mb-6">Pay once. Use claimed. for every goal, forever.</p>
          <PayButton plan="lifetime" label="pay once →" />
        </div>
        <div className="ticket px-8 py-8">
          <p className="font-mono text-xs text-ink-soft mb-2">MONTHLY</p>
          <p className="text-3xl font-extrabold mb-1">
            $2.99<span className="text-base font-normal text-ink-soft">/mo</span>
          </p>
          <p className="text-ink-soft mb-6">Lower commitment. Cancel any time.</p>
          <PayButton plan="monthly" label="start monthly →" />
        </div>
      </div>
    </div>
  );
}
