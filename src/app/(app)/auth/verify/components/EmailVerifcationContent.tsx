"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { resendVerificationEmail } from "../actions";

export default function EmailVerificationContent({
  token,
}: {
  token?: string;
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  async function verifyEmail(token: string) {
    const response = await signIn("token", {
      redirect: false,
      token,
    });
    console.log(response);
    if (response && !response.ok) {
      if (response.error === "TokenExpiredError") {
        toast.error("Verification link has expired.");
      }
      toast.error("Verification failed.");
      setIsVerified(false);
      setError("Not Valid Token");
    } else {
      toast.success("Verification successful!. Redirecting to dashboard...");
      router.replace("/");
    }
  }

  useEffect(() => {
    if (token) {
      setIsVerifying(true);
      verifyEmail(token)
        .then(() => {
          setIsVerified(true);
          setIsVerifying(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsVerifying(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (isVerifying) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verifying your email...</p>
        </CardContent>
      </Card>
    );
  }

  //   if (isVerified) {
  //     return (
  //       <Card>
  //         <CardContent className="pt-6 text-center">
  //           <h2 className="text-xl font-semibold mb-2">Email Verified!</h2>
  //           <p>Your email has been successfully verified.</p>
  //         </CardContent>
  //         <CardFooter className="justify-center">
  //           <Button onClick={() => router.push("/dashboard")}>
  //             Go to Dashboard
  //           </Button>
  //         </CardFooter>
  //       </Card>
  //     );
  //   }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            Verification Failed
          </h2>
          <p>{error}</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Resend Verification Email</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resend Verification Email</DialogTitle>
                <DialogDescription>
                  Are you sure you want to resend the verification email?
                </DialogDescription>
              </DialogHeader>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    resendVerificationEmail(email);
                    setOpen(false);
                  }}
                >
                  Resend
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Check Your Email</h2>
        <p>
          {"We've"} sent a verification email to your inbox. Please click the
          link in the email to verify your account.
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          variant="outline"
          onClick={() => {
            resendVerificationEmail(email);
          }}
        >
          Resend Verification Email
        </Button>
      </CardFooter>
    </Card>
  );
}
