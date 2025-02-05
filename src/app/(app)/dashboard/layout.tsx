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
import { CategoryProvider } from "@/providers/category-provider";
import { getCategories } from "@/lib/transaction/service";
import { Suspense } from "react";
import DasboardSkeleton from "./components/DasboardSkeleton";

export const metadata: Metadata = {
  title: "Fin Flow",
  description: "Track your expenses and income",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

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
          <Suspense fallback={<DasboardSkeleton />}>
            <CategoryProvider categories={categories}>
              <main className="flex-grow p-6">{children}</main>
            </CategoryProvider>
          </Suspense>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
