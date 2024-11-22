import type { Metadata } from "next";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import NavLinks from "./components/NavLinks";
import ThemeSwitch from "@/components/ThemeSwitcher";
import ClientLogout from "@/components/ClientLogout";

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
            <NavLinks />
          </SidebarContent>
          <SidebarFooter className="p-4 space-y-4">
            <ThemeSwitch />
            <ClientLogout />
          </SidebarFooter>
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
