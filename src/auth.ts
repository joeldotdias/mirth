import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db";
import { env } from "@/env";

const providerAuthConfig = {
    params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
    },
};

export const authConfig = {
    adapter: DrizzleAdapter(db),
    providers: [
        GoogleProvider({
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
            authorization: providerAuthConfig,
        }),
        GitHubProvider({
            clientId: env.AUTH_GITHUB_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
            authorization: providerAuthConfig,
        }),
    ],
    callbacks: {
        session({ session, user }) {
            session.user.id = user.id;
            return session;
        },

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const unProtectedPages = ["/code-of-conduct"];
            const isUnprotectedPage = unProtectedPages.some((pagePath) =>
                nextUrl.pathname.startsWith(pagePath),
            );
            const isProtectedPage = !isUnprotectedPage;

            if (isProtectedPage && !isLoggedIn) {
                const redirectUrl = new URL("api/auth/sigin", nextUrl.origin);
                redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
                return Response.redirect(redirectUrl);
            }

            return true;
        },
    },
} satisfies NextAuthConfig;

export const {
    handlers: { GET, POST },
    signIn,
    signOut,
    auth,
} = NextAuth(authConfig);
