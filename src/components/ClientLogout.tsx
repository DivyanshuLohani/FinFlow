"use client";
import { LogOut } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ClientLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    router.push("/auth/login");
  };
  return (
    <Button
      className="flex items-center rounded "
      variant="destructive"
      disabled={loading}
      onClick={handleLogout}
    >
      <LogOut className="w-5 h-5 mr-2" />
      Logout
    </Button>
  );
}
