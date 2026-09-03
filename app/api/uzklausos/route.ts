import { NextResponse } from "next/server";

const DEFAULT_WORDPRESS_URL = "https://orchid-grouse-384861.hostingersite.com";
const ALLOWED_TYPES = new Set(["contact", "supplier", "restaurant", "job"]);
const MAX_REQUEST_BYTES = 6 * 1024 * 1024;

function value(data: FormData, key: string) {
  const entry = data.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

async function anonymousClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const bytes = new TextEncoder().encode(`${forwardedFor}|${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ success: false, message: "Priedas per didelis." }, { status: 413 });
  }

  try {
    const incoming = await request.formData();
    const type = value(incoming, "type");
    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ success: false, message: "Netinkamas užklausos tipas." }, { status: 400 });
    }

    const outgoing = new FormData();
    outgoing.set("type", type);
    outgoing.set("name", value(incoming, "vardas"));
    outgoing.set("email", value(incoming, "el_pastas"));
    outgoing.set("phone", value(incoming, "telefonas"));
    outgoing.set("message", value(incoming, "zinute") || value(incoming, "pasiulymas"));
    outgoing.set("consent", incoming.get("privatumas") ? "1" : "");
    outgoing.set("website", value(incoming, "website"));
    outgoing.set("started_at", value(incoming, "started_at"));
    outgoing.set("client_key", await anonymousClientKey(request));

    for (const key of ["sveciai", "data", "tipas"]) {
      const fieldValue = value(incoming, key);
      if (fieldValue) outgoing.set(key, fieldValue);
    }

    const attachment = incoming.get("priedas");
    if (attachment instanceof File && attachment.size > 0) {
      outgoing.set("attachment", attachment, attachment.name);
    }

    const baseUrl = (process.env.WORDPRESS_API_URL || DEFAULT_WORDPRESS_URL).replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/wp-json/koops/v1/enquiries`, {
      method: "POST",
      body: outgoing,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const result = (await response.json().catch(() => ({}))) as { message?: string; code?: string };

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || "Užklausos išsiųsti nepavyko." },
        { status: response.status >= 500 ? 502 : response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Užklausos išsiųsti nepavyko. Pabandykite dar kartą." },
      { status: 502 },
    );
  }
}
