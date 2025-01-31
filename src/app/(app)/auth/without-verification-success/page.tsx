import { Button } from "@/components/ui/button";
import FormWrapper from "@/components/FormWrapper";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Page = async () => {
  return (
    <FormWrapper>
      <h1 className="leading-2 mb-4 text-center font-bold">
        User Created Successfully
      </h1>
      <p className="text-center text-sm">You can now login to your account.</p>
      <hr className="my-4" />
      <Link href="/auth/login">
        <Button className="w-full" endIcon={<ArrowRight />}>
          Back to Login
        </Button>
      </Link>
    </FormWrapper>
  );
};

export default Page;
