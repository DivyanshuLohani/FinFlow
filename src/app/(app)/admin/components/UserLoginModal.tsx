"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserLoginModalProps {
  token: string;
  userName: string;
}

export default function UserLoginModal({
  token,
  userName,
}: UserLoginModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // This should be replaced with an actual API call to log in as the user
      const success = await signIn("token", {
        token: token,
        redirect: false,
      });
      if (success && success.ok) {
        router.push("/");
        toast.success(`Logged in as ${userName}`);
      } else {
        toast.error("Failed to log in. Please try again.");
      }
      setIsOpen(false);
    } catch {
      toast.error("Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Login as User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login as User</DialogTitle>
          <DialogDescription>
            Are you sure you want to log in as {userName}? This action will be
            logged.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Confirm Login"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
