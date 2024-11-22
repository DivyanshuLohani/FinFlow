"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex justify-between items-center px-3">
      {theme === "dark" || theme === "system" ? (
        <Moon fill="currentColor" />
      ) : (
        <Sun fill="currentColor" />
      )}
      <span>Dark Mode</span>
      <Switch
        checked={theme === "dark" || theme === "system"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </div>
  );
}
