"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

export default function AppLogo() {
  const { theme } = useTheme();
  return (
    <div className="flex gap-5 items-center">
      <Image
        src={theme === "dark" ? "/images/logo.png" : "/images/logo-dark.png"}
        width={50}
        height={50}
        alt="logo"
        suppressHydrationWarning
      />
      <span className="text-xl font-bold">Fin Flow</span>
    </div>
  );
}
