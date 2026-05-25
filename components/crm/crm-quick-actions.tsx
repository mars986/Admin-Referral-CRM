import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Mail, NotebookPen, PhoneCall, UserRoundPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions: Array<{
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}> = [
  {
    label: "New Lead",
    description: "Review and create new intake-driven lead records.",
    href: "/admin/crm/leads",
    icon: NotebookPen,
  },
  {
    label: "Add Contact",
    description: "Open the customer list and update saved contact profiles.",
    href: "/admin/crm/contacts",
    icon: UserRoundPlus,
  },
  {
    label: "Follow Up",
    description: "Work the current task queue and complete due follow-ups.",
    href: "/admin/crm/tasks",
    icon: PhoneCall,
  },
  {
    label: "Send Email",
    description: "Review templates, logs, and transactional email status.",
    href: "/admin/crm/emails",
    icon: Mail,
  },
];

export function CRMQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <p className="text-sm leading-6 text-zinc-400">Shortcuts tuned for fast action from smaller screens.</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {actions.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex min-h-32 flex-col justify-between rounded-[1.35rem] border border-zinc-800 bg-zinc-900/80 p-4 transition hover:border-sky-400/30 hover:bg-zinc-900"
            >
              <div className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-zinc-800 bg-[rgba(44,70,110,0.22)] text-zinc-100">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">{label}</h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-400 sm:text-sm sm:leading-6">{description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-sky-300">
                <span>Open</span>
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
