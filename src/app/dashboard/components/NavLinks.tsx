"use client";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Home,
  PieChart,
  List,
  Settings,
  LayoutGrid,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const links = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: List, label: "Transactions", href: "/dashboard/transactions" },
  { icon: PieChart, label: "Reports", href: "/dashboard/reports" },
  { icon: LayoutGrid, label: "Categories", href: "/dashboard/categories" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: UserRound, label: "Admin", href: "/admin", hidden: true },
];

export default function NavLinks() {
  const pathName = usePathname();
  const session = useSession();
  const userIsAdmin = !!session.data?.user.isAdmin;
  return (
    <SidebarMenu className="px-4 py-2">
      {links.map((link) => {
        if (link.hidden && !userIsAdmin) return null;
        return (
          <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
              asChild
              className={pathName === link.href ? "bg-muted" : ""}
            >
              <Link href={link.href}>
                <link.icon className="mr-2 h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
