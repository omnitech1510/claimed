import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const needsLogin = ["/dashboard", "/goal", "/billing"].some((p) => path.startsWith(p));
  if (needsLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // The control room has its own, separate password — not tied to Supabase auth.
  const isAdminPage = path.startsWith("/admin") && !path.startsWith("/admin/login");
  const isAdminApi = path.startsWith("/api/admin") && !path.startsWith("/api/admin/login");

  if (isAdminPage || isAdminApi) {
    const adminCookie = request.cookies.get("admin_session")?.value;
    if (adminCookie !== process.env.ADMIN_PASSWORD) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Not authorized." }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/goal/:path*",
    "/billing/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
