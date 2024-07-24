import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import SideNav from "./_components/sidenav";
import { Providers } from "./providers";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: "Mirth",
    description: "Social media for your merriness",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    {
        /* <main className="container mx-auto min-h-screen"> */
    }
    {
        /*     <div className="flex gap-6"> */
    }
    {
        /*         <SideNav /> */
    }
    {
        /*         <div className="w-full">{children}</div> */
    }
    {
        /*     </div> */
    }
    {
        /* </main> */
    }

    return (
        <html
            lang="en"
            className={`${GeistSans.variable}`}
            suppressHydrationWarning
        >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <body>
                <Providers>
                    <div className="flex flex-row">
                        <SideNav />
                        <main>{children}</main>
                    </div>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
