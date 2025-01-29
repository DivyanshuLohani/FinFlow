"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function DynamicFavicon() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const changeFavicon = (isDark: boolean) => {
      const favicon = document.querySelector(
        'link[rel="icon"]'
      ) as HTMLLinkElement;
      if (favicon) {
        favicon.href = isDark
          ? "/images/favicon-dark.ico"
          : "/images/favicon.ico";
      }
    };

    const currentTheme = theme === "system" ? systemTheme : theme;
    changeFavicon(currentTheme === "dark");
  }, [theme, systemTheme]);

  return null;
}
