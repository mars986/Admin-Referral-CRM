"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { FormFieldConfig, FormSectionConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

type FieldValues = Record<string, string | boolean>;

type MockFormProps = {
  fields: readonly FormFieldConfig[];
  sections?: readonly FormSectionConfig[];
  submitLabel: string;
  submittingLabel?: string;
  successMessage: string;
};

export function MockForm({
  fields,
  sections,
  submitLabel,
  submittingLabel = "Submitting...",
  successMessage,
}: MockFormProps) {
  const initialValues = useMemo<FieldValues>(
    () =>
      Object.fromEntries(
        fields.map((field) => [field.name, field.type === "checkbox" ? false : ""]),
      ),
    [fields],
  );
  const [values, setValues] = useState<FieldValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const renderedSections = useMemo(() => {
    if (sections?.length) {
      return sections.map((section) => ({
        ...section,
        fields: fields.filter((field) => section.fields.includes(field.name)),
      }));
    }

    return [
      {
        title: "",
        description: undefined,
        fields,
      },
    ];
  }, [fields, sections]);

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

      if (field.type === "tel" && String(value).trim()) {
        const numbers = String(value).replace(/\D/g, "");
        if (numbers.length < 10) {
          nextErrors[field.name] = "Enter a valid phone number.";
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSubmitting(false);
    setSubmitted(true);
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
                    field.type === "select" && field.name === "productInterest" && "sm:col-span-2",
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
                      <span className="block text-sm font-semibold text-[var(--color-ink)]">
                        {field.label}
                      </span>
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
                          <option value="">Select a product</option>
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
        {submitted ? (
          <p className="text-sm text-[var(--color-success)]">{successMessage}</p>
        ) : null}
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
