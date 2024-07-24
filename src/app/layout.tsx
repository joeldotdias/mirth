import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import SideNav from "./_components/sidenav";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Mirth",
    description: "Social media for your merriness",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${GeistSans.variable}`}
            suppressHydrationWarning
        >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <body>
                <Providers>
                    <div className="flex w-screen flex-row">
                        <SideNav />
                        <main className="w-full">{children}</main>
                    </div>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
