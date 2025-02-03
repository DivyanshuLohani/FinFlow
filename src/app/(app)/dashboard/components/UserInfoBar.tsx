"use client";
import ClientLogout from "@/components/ClientLogout";
import ThemeSwitch from "@/components/ThemeSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UserInfoBar() {
  const session = useSession();
  const isMobile = useIsMobile();
  if (!session.data) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center cursor-pointer">
          <Avatar className="">
            <AvatarImage
              src={session.data.user.image}
              alt={session.data.user.name}
            />
            <AvatarFallback>
              {session.data.user.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>

          <div className="ml-4 flex flex-col min-w-0">
            <div className="font-bold text-lg truncate max-w-[150px]">
              {session.data.user.name}
            </div>
            <div className="text-sm opacity-50 truncate max-w-[200px]">
              {session.data.user.email}
            </div>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        sideOffset={4}
        side={isMobile ? "bottom" : "right"}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Account Settings
        </DropdownMenuLabel>
        <div className="py-2">
          <ThemeSwitch />
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
          <ClientLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
