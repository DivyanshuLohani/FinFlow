import { authOptions } from "@/lib/auth/authOptions";
import NextAuth from "next-auth";

const nextAuth = NextAuth(authOptions);
export { nextAuth as GET, nextAuth as POST };
