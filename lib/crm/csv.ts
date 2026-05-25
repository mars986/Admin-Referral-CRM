import type { LeadRecord } from "@/lib/crm/types";

function escapeCell(value: string | number | null | undefined) {
  const stringValue = String(value ?? "");
  const escaped = stringValue.replaceAll('"', '""');
  return `"${escaped}"`;
}

export function leadsToCsv(leads: LeadRecord[]) {
  const headers = [
    "id",
    "first_name",
    "last_name",
    "email",
    "phone",
    "product_interest",
    "source",
    "status",
    "lead_value_estimate",
    "next_follow_up_at",
    "last_contacted_at",
    "created_at",
  ];

  const lines = [
    headers.join(","),
    ...leads.map((lead) =>
      [
        lead.id,
        lead.first_name,
        lead.last_name,
        lead.email,
        lead.phone,
        lead.product_interest,
        lead.source,
        lead.status,
        lead.lead_value_estimate,
        lead.next_follow_up_at,
        lead.last_contacted_at,
        lead.created_at,
      ]
        .map(escapeCell)
        .join(","),
    ),
  ];

  return lines.join("\n");
}
