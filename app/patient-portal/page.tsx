import { redirect } from "next/navigation";

export default function PatientPortalRedirectPage() {
  redirect("/login");
}
