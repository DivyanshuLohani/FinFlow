"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import * as React from "react";

export function SessionProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextAuthSessionProvider>) {
  return (
    <NextAuthSessionProvider {...props}>{children}</NextAuthSessionProvider>
  );
}
