"use client";
import React, { useRef } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Github } from "lucide-react";
import GoogleButton from "../../components/GoogleButton";
import { IsPasswordValid } from "./IsPasswordValid";
import { createUser } from "@/lib/utils/user";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SignupFormProps {
  googleEnabled: boolean;
  githubEnabled: boolean;
  emailVerificationEnabled: boolean;
}

export default function SignupForm({
  googleEnabled,
  githubEnabled,
  emailVerificationEnabled,
}: SignupFormProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [submitting, setSubmiting] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: any) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmiting(true);

    try {
      await createUser(
        e.target.elements.name.value,
        e.target.elements.email.value,
        e.target.elements.password.value
      );

      if (emailVerificationEnabled) {
        router.push("/auth/verify/");
      } else {
        router.push("/auth/without-verification-success/");
      }
    } catch (e: any) {
      setSubmiting(false);
      setError(e.message);
    }
  };

  const checkValidity = () => {
    if (formRef.current) {
      setIsValid(formRef.current.checkValidity());
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-foreground">
          Welcome to Fin Flow
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create an account to get started.
        </p>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      <div className=" space-y-4">
        {showEmailForm && (
          <form
            className="mt-8"
            onSubmit={handleEmailLogin}
            onChange={checkValidity}
            ref={formRef}
          >
            <div className="rounded-md shadow-sm space-y-6">
              <div>
                <Label htmlFor="name" className="sr-only">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="rounded-t-md"
                  placeholder="Name"
                  disabled={submitting}
                />
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <IsPasswordValid password={password} setIsValid={setIsValid} />
          </form>
        )}
        <Button
          className="w-full"
          variant="outline"
          loading={submitting}
          disabled={showEmailForm && !isValid ? true : false}
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
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
