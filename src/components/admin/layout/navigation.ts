import {
  LayoutDashboard,
  BarChart3,
  Package,
  Users,
  FolderKanban,
  Newspaper,
  Download,
  Mail,
  Megaphone,
  Search,
  Share2,
  MailPlus,
  Bot,
  Settings,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export const navigation: NavigationGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "Business",
    items: [
      {
        title: "Products",
        href: "/products",
        icon: Package,
      },
      {
        title: "Clients",
        href: "/clients",
        icon: Users,
      },
      {
        title: "Projects",
        href: "/projects",
        icon: FolderKanban,
      },
    ],
  },

  {
    title: "Content",
    items: [
      {
        title: "Blog",
        href: "/blog",
        icon: Newspaper,
      },
      {
        title: "Downloads",
        href: "/downloads",
        icon: Download,
      },
      {
        title: "Inquiries",
        href: "/inquiries",
        icon: Mail,
      },
    ],
  },

  {
    title: "Marketing",
    items: [
      {
        title: "Marketing",
        icon: Megaphone,
        children: [
          {
            title: "SEO",
            href: "/marketing/seo",
            icon: Search,
          },
          {
            title: "Social Media",
            href: "/marketing/social",
            icon: Share2,
          },
          {
            title: "Newsletter",
            href: "/marketing/newsletter",
            icon: MailPlus,
          },
          {
            title: "Campaigns",
            href: "/marketing/campaigns",
            icon: ChevronRight,
          },
        ],
      },
    ],
  },

  {
    title: "System",
    items: [
      {
        title: "AI Assistant",
        href: "/ai",
        icon: Bot,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];