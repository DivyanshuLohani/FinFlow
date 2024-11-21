"use client";
import React, { useRef } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Github } from "lucide-react";
import GoogleButton from "../../components/GoogleButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SignupFormProps {
  googleEnabled: boolean;
  githubEnabled: boolean;
}

export default function SignInForm({
  googleEnabled,
  githubEnabled,
}: SignupFormProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [submitting, setSubmiting] = useState(false);
  const [error, setError] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: any) => {
    e.preventDefault();
    setSubmiting(true);

    try {
      await signIn("credentials", {
        email: e.target.elements.email.value,
        password: e.target.elements.password.value,
        redirect: false,
      });
      //TODO: error handling

      router.push("/");
    } catch (e: any) {
      if (e.message) {
        setError(e.message);
      }
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-foreground">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please sign in to your account
        </p>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      <div className=" space-y-4">
        {showEmailForm && (
          <form className="mt-8 " onSubmit={handleEmailLogin} ref={formRef}>
            <div className="rounded-md shadow-sm space-y-6">
              <div>
                <Label htmlFor="email-address" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="rounded-t-md"
                  placeholder="Email address"
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="rounded-b-md"
                  placeholder="Password"
                  disabled={submitting}
                />
              </div>
            </div>
          </form>
        )}
        <Button
          className="w-full"
          variant="outline"
          loading={submitting}
          onClick={() =>
            showEmailForm
              ? formRef.current?.requestSubmit()
              : setShowEmailForm(true)
          }
          startIcon={<Mail className="mr-2 h-4 w-4" />}
        >
          Continue with Email
        </Button>
        {googleEnabled && (
          <GoogleButton loading={submitting} setLoading={setSubmiting} />
        )}

        {githubEnabled && (
          <Button
            className="w-full"
            variant="outline"
            loading={submitting}
            startIcon={<Github className="h-4 w-4" />}
          >
            Continue with GitHub
          </Button>
        )}
      </div>

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          {"Don't"} have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}