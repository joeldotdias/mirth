import { createEnv } from "@t3-oss/env-nextjs";
import { z, type ZodError } from "zod";

export const env = createEnv({
    server: {
        POSTGRES_URL: z.string().url(),
        AUTH_GOOGLE_ID: z.string(),
        AUTH_GOOGLE_SECRET: z.string(),
        AUTH_GITHUB_ID: z.string(),
        AUTH_GITHUB_SECRET: z.string(),
    },
    runtimeEnv: {
        POSTGRES_URL: process.env.POSTGRES_URL,
        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
        AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
        AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
        AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    },
    skipValidation: false,
    emptyStringAsUndefined: true,
    onValidationError: (err: ZodError) => {
        console.error(
            "❌ Invalid environment variables:",
            err.flatten().fieldErrors,
        );

        throw new Error("Invalid envitornment variables");
    },
    onInvalidAccess: (variable: string) => {
        throw new Error(
            `❌ Attempted to access ${variable} a server-side environment variable on the client`,
        );
    },
});
