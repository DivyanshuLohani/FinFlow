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
import AppLogo from "@/components/AppLogo";
import UserInfoBar from "./components/UserInfoBar";

export const metadata: Metadata = {
  title: "Fin Flow",
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
            <h2 className="text-xl font-bold p-4">Fin Flow</h2>
          </SidebarHeader>
          <SidebarContent>
            <NavLinks />
          </SidebarContent>
          <SidebarFooter className="p-4 space-y-4">
            <UserInfoBar />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-grow overflow-auto">
          <header className="sticky top-0 z-10 bg-background border-b p-4 flex justify-between items-center">
            <AppLogo />
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
