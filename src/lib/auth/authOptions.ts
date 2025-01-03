import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "./utils";
import { prisma } from "../database/prisma";
import { EMAIL_VERIFICATION_DISABLED } from "../constants";
import { getUserByEmail, updateUser } from "../user/service";
import { AuthenticationError } from "@/types/errors";
import { verifyToken } from "../jwt";
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
          throw new AuthenticationError("Email already verified");
        }

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
    // GoogleProvider({
    //   clientId: GOOGLE_CLIENT_ID || "",
    //   clientSecret: GOOGLE_CLIENT_SECRET || "",
    //   allowDangerousEmailAccountLinking: true,
    // }),
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

      // if (account.provider) {
      //   // const provider = account.provider
      //   //   .toLowerCase()
      //   //   .replace("-", "") as AuthProvider;
      //   // check if accounts for this provider / account Id already exists
      //   const existingUserWithAccount = await prisma.user.findFirst({
      //     include: {
      //       accounts: {
      //         where: {
      //           authProvider: account.provider,
      //         },
      //       },
      //     },
      //   });

      //   if (existingUserWithAccount) {
      //     // User with this provider found
      //     // check if email still the same
      //     if (existingUserWithAccount.email === user.email) {
      //       return true;
      //     }

      //     // user seemed to change his email within the provider
      //     // check if user with this email already exist
      //     // if not found just update user with new email address
      //     // if found throw an error (TODO find better solution)
      //     const otherUserWithEmail = await getUserByEmail(user.email);

      //     if (!otherUserWithEmail) {
      //       await updateUser(existingUserWithAccount.id, { email: user.email });
      //       return true;
      //     }
      //     throw new Error(
      //       "Looks like you updated your email somewhere else. A user with this new email exists already."
      //     );
      //   }

      //   // There is no existing account for this identity provider / account id
      //   // check if user account with this email already exists
      //   // if user already exists throw error and request password login
      //   const existingUserWithEmail = await getUserByEmail(user.email);

      //   if (existingUserWithEmail) {
      //     // Sign in the user with the existing account
      //     return true;
      //   }

      //   return true;
      // }

      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/login", // Error code passed in query string as ?error=
  },
};
