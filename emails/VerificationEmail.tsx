import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const EmailVerification = ({
  token,
  name,
}: {
  token: string;
  name: string;
}) => {
  const baseUrl = `https://finflow.divyanshulohani.xyz`;
  const verificationUrl = `${baseUrl}/auth/verify?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>Verify Your Email</Text>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
              Thanks for signing up! Please verify your email address by
              clicking the button below:
            </Text>
            <Button style={button} href={verificationUrl}>
              Verify Email
            </Button>
            <Text style={paragraph}>
              If the button above {"doesn't"} work, you can also click on this
              link:
            </Text>
            <Link href={verificationUrl} style={link}>
              {verificationUrl}
            </Link>
            <Hr style={hr} />
            <Text style={footer}>
              If you {"didn't"} create an account, you can safely ignore this
              email. This link will expire in 24 hours.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailVerification;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

const link = {
  color: "#5469d4",
  textDecoration: "none",
  fontSize: "14px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
