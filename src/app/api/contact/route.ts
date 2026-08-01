import { NextResponse } from "next/server";
import { checkRateLimit, sendPublicForm, validatePublicForm } from "@/lib/forms";

export async function POST(request: Request) {
  const formData = await request.formData();
  const rateKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (!checkRateLimit(rateKey)) {
    return NextResponse.json({ ok: false, errors: { form: "Too many submissions. Please try again later." } }, { status: 429 });
  }

  const validation = validatePublicForm(formData);
  if (!validation.ok || !validation.cleaned) {
    return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  try {
    const mode = await sendPublicForm(validation.cleaned);
    return NextResponse.json({ ok: true, mode });
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "The message could not be sent because email delivery is not configured." } }, { status: 503 });
  }
}
