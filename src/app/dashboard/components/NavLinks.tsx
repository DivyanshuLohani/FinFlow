"use client";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Home, PieChart, List, Settings, LayoutGrid } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: List, label: "Transactions", href: "/dashboard/transactions" },
  { icon: PieChart, label: "Reports", href: "/dashboard/reports" },
  { icon: LayoutGrid, label: "Categories", href: "/dashboard/categories" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function NavLinks() {
  const pathName = usePathname();
  return (
    <SidebarMenu className="px-4 py-2">
      {links.map((link) => (
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
      ))}
    </SidebarMenu>
  );
}
