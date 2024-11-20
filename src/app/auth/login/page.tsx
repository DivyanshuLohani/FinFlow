import FormWrapper from "@/components/FormWrapper";
import SigninForm from "./components/SigninForm";
import { GOOGLE_AUTH_ENABLED, GITHUB_AUTH_ENABLED } from "@/lib/constants";

export default function LoginPage() {
  return (
    <FormWrapper>
      <SigninForm
        googleEnabled={GOOGLE_AUTH_ENABLED}
        githubEnabled={GITHUB_AUTH_ENABLED}
      />
    </FormWrapper>
  );
}
