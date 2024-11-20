import FormWrapper from "@/components/FormWrapper";
import SignupForm from "./components/SignupFrom";
import {
  GOOGLE_AUTH_ENABLED,
  GITHUB_AUTH_ENABLED,
  EMAIL_VERIFICATION_DISABLED,
} from "@/lib/constants";

export default function LoginPage() {
  return (
    <FormWrapper>
      <SignupForm
        googleEnabled={GOOGLE_AUTH_ENABLED}
        githubEnabled={GITHUB_AUTH_ENABLED}
        emailVerificationEnabled={!EMAIL_VERIFICATION_DISABLED}
      />
    </FormWrapper>
  );
}
