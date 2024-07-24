"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div></div>;
    }

    if (resolvedTheme === "dark") {
        return (
            <Sun
                onClick={() => {
                    setTheme("light");
                }}
            />
        );
    }

    if (resolvedTheme === "light") {
        return (
            <Moon
                onClick={() => {
                    setTheme("dark");
                }}
            />
        );
    }
}
