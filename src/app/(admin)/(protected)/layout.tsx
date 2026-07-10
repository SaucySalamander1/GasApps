import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminShell from "@/components/admin/layout/AdminShell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}