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

function clean(value: FormDataEntryValue | null, maxLength: number): string {
  return String(value ?? "").replace(/[<>]/g, "").trim().slice(0, maxLength);
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
  const provider = process.env.FORM_EMAIL_PROVIDER;
  const to = process.env.FORM_TO_EMAIL;
  if (!provider || !to) {
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

  throw new Error(`Email provider "${provider}" is not implemented yet.`);
}
