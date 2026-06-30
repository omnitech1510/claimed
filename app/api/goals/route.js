import { createClient } from "@/lib/supabase/server";
import { canCreateGoal } from "@/lib/access";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Not signed in." }, { status: 401 });

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ goals: data });
}

export async function POST(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Not signed in." }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!canCreateGoal(profile)) {
    return Response.json(
      { error: "Your trial has ended. Pick a plan to add a new goal." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { title, product_url, image_url, target_amount, currency } = body;

  if (!title || !target_amount || Number(target_amount) <= 0) {
    return Response.json({ error: "A title and a real price are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: user.id,
      title,
      product_url: product_url || null,
      image_url: image_url || null,
      target_amount,
      currency: currency || "USD",
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ goal: data });
}
