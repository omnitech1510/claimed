import { createClient } from "@/lib/supabase/server";

export async function GET(request, { params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Not signed in." }, { status: 401 });

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("*")
    .eq("id", params.id)
    .single();
  if (goalError) return Response.json({ error: goalError.message }, { status: 404 });

  const { data: logs, error: logsError } = await supabase
    .from("savings_logs")
    .select("*")
    .eq("goal_id", params.id)
    .order("created_at", { ascending: false });
  if (logsError) return Response.json({ error: logsError.message }, { status: 500 });

  return Response.json({ goal, logs });
}

export async function PATCH(request, { params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Not signed in." }, { status: 401 });

  const body = await request.json();
  const allowed = {};
  if (body.status) allowed.status = body.status;

  const { data, error } = await supabase
    .from("goals")
    .update(allowed)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ goal: data });
}
