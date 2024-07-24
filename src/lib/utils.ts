import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function invariant<T>(
    condition: T,
    msg?: string | (() => string),
): asserts condition {
    if (condition) return;

    const provided = typeof msg === "function" ? msg() : msg;
    const prefix = "Invariant failed";
    const value = provided ? `${prefix}: ${provided}` : prefix;
    throw new Error(value);
}
