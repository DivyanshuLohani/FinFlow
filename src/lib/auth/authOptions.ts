import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "./utils";
import { prisma } from "../database/prisma";
import {
  EMAIL_VERIFICATION_DISABLED,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../constants";
import { createUser, getUserByEmail, updateUser } from "../user/service";
import { AuthenticationError } from "@/types/errors";
import { verifyToken } from "../jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "Your email address",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password",
        },
      },
      async authorize(credentials) {
        let user;
        try {
          user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });
        } catch (e) {
          console.error(e);
          throw Error("Internal server error. Please try again later");
        }

        if (!user || !credentials) {
          throw new Error("Invalid credentials");
        }
        if (!user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          imageUrl: user.image,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      },
    }),
    CredentialsProvider({
      id: "token",
      name: "Token",
      credentials: {
        token: {
          label: "Verification Token",
          type: "string",
        },
      },
      async authorize(credentials) {
        let user;
        try {
          if (!credentials?.token) {
            throw new Error("Token not found");
          }
          const { id } = await verifyToken(credentials?.token);
          const existingToken = await prisma.verificationToken.findUnique({
            where: {
              identifier: id,
              token: credentials?.token,
            },
          });
          if (!existingToken) {
            throw new Error("Invalid token");
          }

          user = await prisma.user.findUnique({
            where: {
              id: id,
            },
          });
        } catch (e) {
          console.error(e);
          throw new AuthenticationError(
            "Either a user does not match the provided token or the token is invalid"
          );
        }

        if (!user) {
          throw new AuthenticationError(
            "Either a user does not match the provided token or the token is invalid"
          );
        }

        if (user.emailVerified) {
          return user;
          // throw new AuthenticationError("Email already verified");
        }

        // Delete the token
        await prisma.verificationToken.delete({
          where: {
            identifier: user.id,
            token: credentials?.token,
          },
        });

        user = await updateUser(user.id, {
          emailVerified: new Date(),
          image: null,
        });

        return user;
      },
    }),

    // GitHubProvider({
    //   clientId: GITHUB_ID || "",
    //   clientSecret: GITHUB_SECRET || "",
    // }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID || "",
      clientSecret: GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    // AzureAD({
    //   clientId: AZUREAD_CLIENT_ID || "",
    //   clientSecret: AZUREAD_CLIENT_SECRET || "",
    //   tenantId: AZUREAD_TENANT_ID || "",
    // }),
  ],
  callbacks: {
    async jwt({ token }) {
      const existingUser = await getUserByEmail(token?.email as string);

      if (!existingUser) {
        return token;
      }

      return {
        ...token,
        profile: { id: existingUser.id, isAdmin: existingUser.isAdmin },
      };
    },
    async session({ session, token }) {
      // @ts-expect-error
      session.user.id = token?.id;
      // @ts-expect-error
      session.user = token.profile;

      return session;
    },
    async signIn({ user, account }: any) {
      if (account.provider === "credentials" || account.provider === "token") {
        // check if user's email is verified or not
        if (!user.emailVerified && !EMAIL_VERIFICATION_DISABLED) {
          throw new Error("Email Verification is Pending");
        }
        return true;
      }
      if (!user.email || account.type !== "oauth") {
        return false;
      }

      if (account.type == "oauth") {
        // check if user account with this email already exists
        const existingUserWithEmail = await getUserByEmail(user.email);
        console.log(existingUserWithEmail);
        if (existingUserWithEmail) {
          return true;
        }

        // The user does not exists on the server so we create one

        createUser({
          name:
            user.name ||
            user.email
              .split("@")[0]
              .replace(/[^'\p{L}\p{M}\s\d-]+/gu, " ")
              .trim(),
          email: user.email,
          image: user.image,
          password: null,
          emailVerified: new Date(Date.now()),
        });

        return true;
      }

      throw new Error("Invalid account type");
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/login", // Error code passed in query string as ?error=
  },
};
