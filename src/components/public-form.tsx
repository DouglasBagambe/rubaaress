"use client";

import { useRef, useState, type FormEvent } from "react";
import type { FormKind } from "@/lib/forms";

type PublicFormProps = {
  kind: FormKind;
};

export function PublicForm({ kind }: PublicFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const startedAtRef = useRef<HTMLInputElement | null>(null);

  function markStarted() {
    if (startedAtRef.current && !startedAtRef.current.value) startedAtRef.current.value = String(Date.now());
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/contact", { method: "POST", body: new FormData(form) });
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== "object" || !("ok" in payload) || typeof payload.ok !== "boolean") {
        throw new Error("Malformed response");
      }
      const result = payload as { ok: boolean; errors?: Record<string, string>; mode?: string };
      if (!response.ok || !result.ok) {
        setStatus("error");
        setMessage(Object.values(result.errors ?? {})[0] ?? "Your message could not be sent right now. Please try again or contact the school by phone or email.");
        return;
      }

      setStatus("success");
      setMessage(result.mode === "logged" ? "Your message was checked successfully." : "Your message has been sent.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Your message could not be sent right now. Please try again or contact the school by phone or email.");
    }
  }

  return (
    <form onSubmit={onSubmit} onFocusCapture={markStarted} onPointerDown={markStarted} className="grid gap-4 border border-[var(--school-border)] bg-[var(--school-cream)] p-5" noValidate>
      <input type="hidden" name="kind" value={kind} />
      <input ref={startedAtRef} type="hidden" name="startedAt" />
      <label className="hidden">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[var(--school-blue-dark)]">
        {kind === "admissions" ? "Parent or guardian name" : "Full name"}
        <input required name="fullName" maxLength={90} className="min-h-11 border border-[var(--school-border)] bg-white px-3 font-normal" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[var(--school-blue-dark)]">
        Email
        <input required name="email" type="email" maxLength={120} className="min-h-11 border border-[var(--school-border)] bg-white px-3 font-normal" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[var(--school-blue-dark)]">
        Telephone
        <input name="telephone" type="tel" maxLength={30} className="min-h-11 border border-[var(--school-border)] bg-white px-3 font-normal" />
      </label>
      {kind === "admissions" ? (
        <label className="grid gap-2 text-sm font-semibold text-[var(--school-blue-dark)]">
          Intended level
          <select required name="intendedLevel" className="min-h-11 border border-[var(--school-border)] bg-white px-3 font-normal">
            <option value="">Choose level</option>
            <option value="O-Level">O-Level</option>
            <option value="A-Level">A-Level</option>
          </select>
        </label>
      ) : (
        <label className="grid gap-2 text-sm font-semibold text-[var(--school-blue-dark)]">
          Subject
          <input required name="subject" maxLength={120} className="min-h-11 border border-[var(--school-border)] bg-white px-3 font-normal" />
        </label>
      )}
      <label className="grid gap-2 text-sm font-semibold text-[var(--school-blue-dark)]">
        Message
        <textarea required name="message" minLength={10} maxLength={1200} rows={5} className="border border-[var(--school-border)] bg-white px-3 py-3 font-normal" />
      </label>
      <label className="flex gap-3 text-sm leading-6 text-[var(--school-muted)]">
        <input required name="consent" type="checkbox" className="mt-1 h-4 w-4" />
        <span>I agree that the school may use these details to respond to this enquiry.</span>
      </label>
      <button disabled={status === "loading"} type="submit" className="min-h-12 bg-[var(--school-blue)] px-6 text-sm font-bold text-white disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2">
        {status === "loading" ? "Sending..." : kind === "admissions" ? "Send Admissions Enquiry" : "Send Message"}
      </button>
      {message ? (
        <p aria-live="polite" className={`text-sm font-semibold ${status === "success" ? "text-[var(--school-green)]" : "text-[var(--school-red)]"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
