"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { FormFieldConfig, FormSectionConfig } from "@/lib/types";
import type { LeadSource, PublicFormType } from "@/lib/crm/types";
import { cn } from "@/lib/utils";
import { TurnstileField } from "@/components/forms/turnstile-field";

type FieldValues = Record<string, string | boolean>;

function getInitialStoredReferralCode() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem("apex_referral_code") ?? "";
}

function getInitialSourcePage() {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.pathname}${window.location.search}`;
}

function getInitialUtmData() {
  if (typeof window === "undefined") {
    return {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
    };
  }

  const searchParams = new URLSearchParams(window.location.search);

  return {
    utm_source: searchParams.get("utm_source") ?? "",
    utm_medium: searchParams.get("utm_medium") ?? "",
    utm_campaign: searchParams.get("utm_campaign") ?? "",
  };
}

type CrmPublicFormProps = {
  formType: PublicFormType;
  source?: LeadSource;
  fields: readonly FormFieldConfig[];
  sections?: readonly FormSectionConfig[];
  submitLabel: string;
  submittingLabel?: string;
  successMessage: string;
  turnstileSiteKey: string;
  defaultValues?: Record<string, string | boolean>;
};

export function CrmPublicForm({
  formType,
  source = "Website",
  fields,
  sections,
  submitLabel,
  submittingLabel = "Submitting...",
  successMessage,
  turnstileSiteKey,
  defaultValues,
}: CrmPublicFormProps) {
  const initialValues = useMemo<FieldValues>(
    () =>
      Object.fromEntries(
        fields.map((field) => [
          field.name,
          defaultValues?.[field.name] ?? (field.type === "checkbox" ? false : ""),
        ]),
      ),
    [defaultValues, fields],
  );

  const renderedSections = useMemo(() => {
    if (!sections?.length) {
      return [{ title: "", fields, description: undefined }];
    }

    return sections.map((section) => ({
      ...section,
      fields: fields.filter((field) => section.fields.includes(field.name)),
    }));
  }, [fields, sections]);

  const [values, setValues] = useState<FieldValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [storedReferralCode] = useState(getInitialStoredReferralCode);
  const [sourcePage] = useState(getInitialSourcePage);
  const [utmData] = useState(getInitialUtmData);
  const turnstileEnabled = Boolean(turnstileSiteKey);

  function updateValue(name: string, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) {
        return current;
      }
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    for (const field of fields) {
      const value = values[field.name];

      if (field.required) {
        if (field.type === "checkbox" && value !== true) {
          nextErrors[field.name] = "This field is required.";
          continue;
        }

        if (field.type !== "checkbox" && !String(value).trim()) {
          nextErrors[field.name] = "This field is required.";
          continue;
        }
      }

      if (field.type === "email" && String(value).trim()) {
        const email = String(value).trim();
        if (!email.includes("@") || !email.includes(".")) {
          nextErrors[field.name] = "Enter a valid email address.";
        }
      }
    }

    if (turnstileEnabled && !turnstileToken) {
      nextErrors.turnstile = "Complete the security check before submitting.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function buildPayload() {
    return {
      form_type: formType,
      source,
      first_name: String(values.firstName ?? "").trim(),
      last_name: String(values.lastName ?? "").trim(),
      email: String(values.email ?? "").trim(),
      phone: String(values.phone ?? "").trim(),
      product_interest: String(values.productInterest ?? values.product_interest ?? "General").trim(),
      message: String(values.message ?? "").trim(),
      date_of_birth: String(values.dob ?? "").trim(),
      referral_code: String(values.referralCode ?? storedReferralCode ?? "").trim(),
      consent: Boolean(values.consent ?? true),
      turnstileToken,
      metadata: Object.fromEntries(
        [
          ...Object.entries(values).map(([key, value]) => [key, String(value)]),
          ["sourcePage", sourcePage],
          ["utm_source", utmData.utm_source],
          ["utm_medium", utmData.utm_medium],
          ["utm_campaign", utmData.utm_campaign],
          ["stored_referral_code", storedReferralCode],
        ],
      ),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);
    setServerError("");

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    const response = await fetch("/api/forms/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });

    const payload = (await response.json().catch(() => null)) as
      | { ok: boolean; error?: string }
      | null;

    setSubmitting(false);

    if (!response.ok || !payload?.ok) {
      setServerError(payload?.error ?? "Something went wrong while submitting the form.");
      return;
    }

    setSubmitted(true);
    setValues(initialValues);
    setTurnstileToken("");
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface rounded-[1.75rem] p-6 sm:p-8">
      <div className="space-y-6">
        {renderedSections.map((section, index) => (
          <section
            key={section.title || index}
            className={cn(
              "space-y-5",
              section.title &&
                "rounded-[1.5rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fc_100%)] p-5 sm:p-6",
            )}
          >
            {section.title ? (
              <div className="space-y-2">
                <h3 className="text-base font-semibold tracking-tight text-[var(--color-ink)] sm:text-lg">
                  {section.title}
                </h3>
                {section.description ? (
                  <p className="text-sm leading-6 text-[var(--color-ink-soft)]">{section.description}</p>
                ) : null}
              </div>
            ) : null}
            <div className="grid gap-5 sm:grid-cols-2">
              {section.fields.map((field) => (
                <label
                  key={field.name}
                  className={cn(
                    "space-y-2",
                    field.type === "textarea" && "sm:col-span-2",
                    field.type === "checkbox" && "sm:col-span-2",
                    field.type === "select" && "sm:col-span-2",
                  )}
                >
                  {field.type === "checkbox" ? (
                    <div className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={Boolean(values[field.name])}
                          onChange={(event) => updateValue(field.name, event.target.checked)}
                          className="mt-1 size-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
                        />
                        <div>
                          <span className="text-sm font-semibold text-[var(--color-ink)]">{field.label}</span>
                          {field.helperText ? (
                            <p className="mt-1 text-sm leading-6 text-[var(--color-ink-soft)]">{field.helperText}</p>
                          ) : null}
                        </div>
                      </div>
                      {errors[field.name] ? (
                        <p className="mt-2 text-sm text-[var(--color-danger)]">{errors[field.name]}</p>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <span className="block text-sm font-semibold text-[var(--color-ink)]">{field.label}</span>
                      {field.type === "textarea" ? (
                        <textarea
                          rows={5}
                          value={String(values[field.name] ?? "")}
                          onChange={(event) => updateValue(field.name, event.target.value)}
                          placeholder={field.placeholder}
                          className={fieldClassName(errors[field.name])}
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={String(values[field.name] ?? "")}
                          onChange={(event) => updateValue(field.name, event.target.value)}
                          className={fieldClassName(errors[field.name])}
                        >
                          <option value="">Select an option</option>
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={String(values[field.name] ?? "")}
                          onChange={(event) => updateValue(field.name, event.target.value)}
                          placeholder={field.placeholder}
                          className={fieldClassName(errors[field.name])}
                        />
                      )}
                      {field.helperText ? (
                        <p className="text-sm text-[var(--color-ink-soft)]">{field.helperText}</p>
                      ) : null}
                      {errors[field.name] ? (
                        <p className="text-sm text-[var(--color-danger)]">{errors[field.name]}</p>
                      ) : null}
                    </>
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <TurnstileField
          siteKey={turnstileSiteKey}
          value={turnstileToken}
          onChange={setTurnstileToken}
        />
        {errors.turnstile ? <p className="text-sm text-[var(--color-danger)]">{errors.turnstile}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold shadow-lg shadow-[rgba(0,31,63,0.14)] transition sm:w-auto sm:min-w-44",
            submitting && "cursor-wait opacity-80",
          )}
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
        {serverError ? <p className="text-sm text-[var(--color-danger)]">{serverError}</p> : null}
        {submitted ? <p className="text-sm text-[var(--color-success)]">{successMessage}</p> : null}
      </div>
    </form>
  );
}

function fieldClassName(hasError?: string) {
  return cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)]",
    hasError ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
  );
}
