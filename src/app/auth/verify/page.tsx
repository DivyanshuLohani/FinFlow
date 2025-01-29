import { Suspense } from "react";
import EmailVerificationContent from "./components/EmailVerifcationContent";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = await searchParams;

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Email Verification
      </h1>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <EmailVerificationContent token={token} />
      </Suspense>
    </div>
  );
}
