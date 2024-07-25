"use server";

import { updateUserInfo } from "@/server/queries";
import { revalidatePath } from "next/cache";

export async function updateProfile(username: string, bio: string) {
    try {
        await updateUserInfo(username, bio);
        revalidatePath("/profile");
    } catch (err) {
        throw new Error(err as string);
    }
}
