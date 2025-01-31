"use client";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";

export default function GoogleButton({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleGoogleSignIn = () => {
    setLoading(true);
    try {
      signIn("google", { redirect: false });
    } catch {
      setLoading(false);
    }
  };
  return (
    <Button
      loading={loading}
      className="w-full"
      variant="outline"
      onClick={handleGoogleSignIn}
      startIcon={<GoogleIcon className="h-4 w-4" />}
    >
      Continue with Google
    </Button>
  );
}
