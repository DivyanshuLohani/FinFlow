import type { Metadata } from "next";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Home, PieChart, List, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your expenses and income",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-xl font-bold p-4">Expense Tracker</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-4 py-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/transactions">
                    <List className="mr-2 h-4 w-4" />
                    <span>Transactions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/reports">
                    <PieChart className="mr-2 h-4 w-4" />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-grow overflow-auto">
          <header className="sticky top-0 z-10 bg-background border-b p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Expense Tracker</h1>
            <div className="md-hidden">
              <SidebarTrigger />
            </div>
          </header>
          <main className="flex-grow p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
