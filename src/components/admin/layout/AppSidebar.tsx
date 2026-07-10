"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Wrench,
  Factory,
  FolderKanban,
  Newspaper,
  ShieldCheck,
  Download,
  Briefcase,
  HelpCircle,
  Settings,
  Mail,
  Bot,
  LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Pages not built yet render as disabled with a "Soon" badge instead of a dead link. */
  soon?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { title: "Inquiries", href: "/inquiries", icon: Mail },
      { title: "Products", href: "/dashboard/products", icon: Package, soon: true },
      { title: "Services", href: "/dashboard/services", icon: Wrench, soon: true },
      { title: "Industries", href: "/dashboard/industries", icon: Factory, soon: true },
      { title: "Projects", href: "/dashboard/projects", icon: FolderKanban, soon: true },
      { title: "Blog", href: "/dashboard/blog", icon: Newspaper, soon: true },
      { title: "Certifications", href: "/dashboard/certifications", icon: ShieldCheck, soon: true },
      { title: "Resources", href: "/dashboard/resources", icon: Download, soon: true },
      { title: "Jobs", href: "/dashboard/jobs", icon: Briefcase, soon: true },
      { title: "FAQs", href: "/dashboard/faqs", icon: HelpCircle, soon: true },
    ],
  },
  {
    title: "System",
    items: [
      { title: "AI Assistant", href: "/ai", icon: Bot },
      { title: "Settings", href: "/dashboard/settings", icon: Settings, soon: true },
    ],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-18 flex h-[calc(100vh-4.5rem)] w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface">
      <nav className="flex-1 space-y-6 p-4">
        {navigation.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-2 text-xs font-semibold tracking-[0.15em] text-text-secondary uppercase">
              {group.title}
            </p>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                if (item.soon) {
                  return (
                    <div
                      key={item.href}
                      className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-2 text-sm text-text-secondary/50"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {item.title}
                      </span>
                      <Badge className="text-[10px]">Soon</Badge>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-text-secondary hover:bg-background hover:text-text-primary"
                    }`}
                  >
                    {active && (
                      <span className="absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-r-full bg-accent" />
                    )}
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <p className="font-display text-sm font-semibold text-text-primary">Administrator</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="text-xs text-text-secondary">Online</span>
        </div>
      </div>
    </aside>
  );
}