"use client";

import { Boxes, House, Search, User, type LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import React from "react";
import Image from "next/image";

type LucideIcon = ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

type NavLink = {
    label: string;
    link: string;
    icon: LucideIcon;
};

const navLinks: NavLink[] = [
    {
        label: "Home",
        link: "/",
        icon: House,
    },
    {
        label: "Search",
        link: "/search",
        icon: Search,
    },
    {
        label: "Communities",
        link: "/communities",
        icon: Boxes,
    },
];

export default function NavLinks({
    pfpUrl,
}: {
    pfpUrl: string | null | undefined;
}) {
    const currPath = usePathname();

    return (
        <>
            <div className="flex flex-col gap-5">
                {navLinks.map((navLink) => {
                    const isCurrPage = currPath === navLink.link;
                    const NavIcon = navLink.icon;

                    return (
                        <Link
                            href={navLink.link}
                            key={navLink.label}
                            className="flex flex-row items-center justify-center gap-2 lg:justify-normal"
                        >
                            <NavIcon
                                size={32}
                                strokeWidth={isCurrPage ? 3 : 1}
                            />
                            <span
                                className={`${isCurrPage && "font-semibold"} hidden lg:block`}
                            >
                                {navLink.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <Link
                href={"/profile"}
                className="flex w-full items-center gap-2 py-6"
            >
                <div className="size-7 lg:size-5 relative flex  shrink-0 overflow-hidden rounded-full">
                    {pfpUrl ? (
                        <Image src={pfpUrl} alt="img" fill={true} />
                    ) : (
                        <User />
                    )}
                </div>
                <span
                    className={`hidden lg:block ${currPath === "/profile" && "font-semibold"}`}
                >
                    Profile
                </span>
            </Link>
        </>
    );
}
