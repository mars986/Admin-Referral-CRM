import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BadgeDollarSign,
  BellRing,
  BriefcaseBusiness,
  ChartPie,
  ClipboardList,
  Coins,
  Files,
  FolderUp,
  LayoutDashboard,
  Mail,
  NotebookPen,
  PackageSearch,
  QrCode,
  ReceiptText,
  Settings2,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
};

const crmItems: AdminNavItem[] = [
  { href: "/admin/crm/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/crm/leads", label: "Leads", shortLabel: "Alerts", icon: BellRing },
  { href: "/admin/crm/contacts", label: "Contacts", shortLabel: "Patients", icon: Users },
  { href: "/admin/crm/pipeline", label: "Pipeline", icon: BriefcaseBusiness },
  { href: "/admin/crm/orders", label: "Orders", icon: PackageSearch },
  { href: "/admin/crm/tasks", label: "Tasks", shortLabel: "Alerts", icon: ClipboardList },
  { href: "/admin/crm/emails", label: "Emails", icon: Mail },
  { href: "/admin/crm/referrals", label: "Referrals", icon: FolderUp },
  { href: "/admin/crm/reports", label: "Reports", icon: ChartPie },
  { href: "/admin/crm/files", label: "Files", icon: Files },
  { href: "/admin/crm/settings", label: "Settings", icon: Settings2 },
];

const referralItems: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/partners", label: "Partners", icon: Users },
  { href: "/admin/referral-codes", label: "Referral Codes", shortLabel: "Referrals", icon: QrCode },
  { href: "/admin/leads", label: "Leads", shortLabel: "Patients", icon: BellRing },
  { href: "/admin/conversions", label: "Conversions", shortLabel: "Orders", icon: BadgeDollarSign },
  { href: "/admin/commissions", label: "Commissions", icon: Coins },
  { href: "/admin/payouts", label: "Payouts", icon: ReceiptText },
  { href: "/admin/fraud", label: "Fraud Review", shortLabel: "Alerts", icon: AlertTriangle },
  { href: "/admin/reports", label: "Reports", icon: ChartPie },
  { href: "/admin/partner-portal", label: "Partner Portal", icon: BriefcaseBusiness },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: NotebookPen },
];

const crmBottomItems: AdminNavItem[] = [
  { href: "/admin/crm/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/crm/contacts", label: "Patients", icon: Users },
  { href: "/admin/crm/referrals", label: "Referrals", icon: FolderUp },
  { href: "/admin/crm/orders", label: "Orders", icon: PackageSearch },
  { href: "/admin/crm/tasks", label: "Alerts", icon: ClipboardList },
];

const referralBottomItems: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Patients", icon: Users },
  { href: "/admin/referral-codes", label: "Referrals", icon: QrCode },
  { href: "/admin/conversions", label: "Orders", icon: BadgeDollarSign },
  { href: "/admin/fraud", label: "Alerts", icon: AlertTriangle },
];

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getAdminNavigation(pathname: string) {
  const portal = pathname.startsWith("/admin/crm") ? "crm" : "referral";
  const items = portal === "crm" ? crmItems : referralItems;
  const bottomItems = portal === "crm" ? crmBottomItems : referralBottomItems;
  const currentItem =
    [...items, ...bottomItems]
      .filter((item) => isActiveRoute(pathname, item.href))
      .sort((left, right) => right.href.length - left.href.length)[0] ?? items[0];

  return {
    portal,
    items,
    bottomItems,
    currentItem,
    portalLabel: portal === "crm" ? "CRM Portal" : "Referral Portal",
  };
}

export function adminRouteActive(pathname: string, href: string) {
  return isActiveRoute(pathname, href);
}
