import { Resend } from "resend";

export type FormKind = "contact" | "admissions";

export type PublicFormInput = {
  kind: FormKind;
  fullName: string;
  email: string;
  telephone?: string;
  subject?: string;
  intendedLevel?: string;
  message: string;
  consent: boolean;
  website?: string;
  startedAt?: string;
};

export type PublicFormValidation = {
  ok: boolean;
  errors: Record<string, string>;
  cleaned?: PublicFormInput;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateMap = new Map<string, { count: number; resetAt: number }>();

type EmailContent = {
  subject: string;
  text: string;
  html: string;
};

function clean(value: FormDataEntryValue | null, maxLength: number): string {
  return String(value ?? "").replace(/[<>]/g, "").trim().slice(0, maxLength);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

function buildEmailContent(input: PublicFormInput): EmailContent {
  const formLabel = input.kind === "admissions" ? "Admissions enquiry" : "Contact enquiry";
  const subject = input.kind === "admissions" ? "New admissions enquiry from the website" : `New website message: ${input.subject}`;
  const rows = [
    ["Type", formLabel],
    ["Full name", input.fullName],
    ["Email", input.email],
    ["Telephone", input.telephone || "Not provided"],
    input.kind === "admissions" ? ["Intended level", input.intendedLevel || "Not provided"] : ["Subject", input.subject || "Not provided"],
    ["Message", input.message],
  ];
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n\n");
  const htmlRows = rows
    .map(([label, value]) => {
      return `<tr><th align="left" style="padding:8px;border-bottom:1px solid #d8e0e7;vertical-align:top;">${escapeHtml(label)}</th><td style="padding:8px;border-bottom:1px solid #d8e0e7;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`;
    })
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;color:#102f4e;"><h1 style="font-size:20px;">${escapeHtml(formLabel)}</h1><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px;">${htmlRows}</table></div>`;

  return { subject, text, html };
}

function missingProviderConfig(provider: string | undefined, to: string | undefined, from: string | undefined, apiKey: string | undefined): boolean {
  if (!provider || !to || !from) return true;
  if (provider === "resend" && !apiKey) return true;
  return false;
}

export function validatePublicForm(formData: FormData): PublicFormValidation {
  const kind = clean(formData.get("kind"), 20) === "admissions" ? "admissions" : "contact";
  const fullName = clean(formData.get("fullName"), 90);
  const email = clean(formData.get("email"), 120).toLowerCase();
  const telephone = clean(formData.get("telephone"), 30);
  const subject = clean(formData.get("subject"), 120);
  const intendedLevel = clean(formData.get("intendedLevel"), 40);
  const message = clean(formData.get("message"), 1200);
  const consent = formData.get("consent") === "on";
  const website = clean(formData.get("website"), 120);
  const startedAt = clean(formData.get("startedAt"), 40);
  const errors: Record<string, string> = {};

  if (website) errors.website = "Submission rejected.";
  if (startedAt && Date.now() - Number(startedAt) < 2500) errors.startedAt = "Please take a little more time before submitting.";
  if (fullName.length < 2) errors.fullName = "Enter your full name.";
  if (!emailPattern.test(email)) errors.email = "Enter a valid email address.";
  if (kind === "contact" && subject.length < 3) errors.subject = "Enter a subject.";
  if (kind === "admissions" && !intendedLevel) errors.intendedLevel = "Choose the intended level.";
  if (message.length < 10) errors.message = "Enter a message of at least 10 characters.";
  if (!consent) errors.consent = "Confirm that the school may use these details to respond.";

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    errors: {},
    cleaned: { kind, fullName, email, telephone, subject, intendedLevel, message, consent, startedAt },
  };
}

export function checkRateLimit(key: string, limit = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const existing = rateMap.get(key);
  if (!existing || existing.resetAt <= now) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= limit) return false;
  existing.count += 1;
  return true;
}

export async function sendPublicForm(input: PublicFormInput): Promise<"logged" | "sent"> {
  const provider = process.env.FORM_EMAIL_PROVIDER?.toLowerCase();
  const to = process.env.FORM_TO_EMAIL;
  const from = process.env.FORM_FROM_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;
  if (missingProviderConfig(provider, to, from, resendApiKey)) {
    if (process.env.NODE_ENV !== "production") {
      console.info("Form submission logged in development mode.", {
        kind: input.kind,
        fullName: input.fullName,
        email: input.email,
        subject: input.subject,
        intendedLevel: input.intendedLevel,
      });
      return "logged";
    }
    throw new Error("Email provider is not configured.");
  }

  if (provider !== "resend") {
    console.error("Unsupported form email provider.", { provider });
    throw new Error("Email provider is not configured.");
  }

  const resendFrom = from;
  const resendTo = to;
  const resendKey = resendApiKey;
  if (!resendFrom || !resendTo || !resendKey) {
    throw new Error("Email provider is not configured.");
  }

  const email = buildEmailContent(input);
  const resend = new Resend(resendKey);
  const result = await resend.emails.send({
    from: resendFrom,
    to: resendTo,
    replyTo: input.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  if (result.error || !result.data?.id) {
    console.error("Resend rejected form email.", {
      name: result.error?.name,
      message: result.error?.message,
    });
    throw new Error("Email provider rejected the message.");
  }

  console.info("Form email accepted by provider.", { provider, messageId: result.data.id });
  return "sent";
}
