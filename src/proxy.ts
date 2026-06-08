import { NextRequest, NextResponse } from "next/server";

const ADMIN_DOMAIN = process.env.NEXT_PUBLIC_ADMIN_DOMAIN ?? "localhost:3000";
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "menuco.bj";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") ?? "";
  const host = hostname.replace("www.", "");

  // Admin domain or localhost → pass through
  if (host === ADMIN_DOMAIN || host === `admin.${ROOT_DOMAIN}` || host.includes("localhost") || host.includes("vercel.app")) {
    return NextResponse.next();
  }

  // *.menuco.bj subdomain → rewrite to /m/[slug]
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const slug = host.replace(`.${ROOT_DOMAIN}`, "");
    url.pathname = `/m/${slug}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Custom domain → resolve tenant by hostname via query param
  if (host !== ROOT_DOMAIN) {
    url.pathname = `/m/__domain__`;
    url.searchParams.set("domain", host);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
