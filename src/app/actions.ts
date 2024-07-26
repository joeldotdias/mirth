"use server";

import { updateUserInfo } from "@/server/queries";
import { revalidatePath } from "next/cache";

export async function updateProfile(
    username: string,
    bio: string,
    birthdate: Date,
) {
    try {
        await updateUserInfo(username, bio, birthdate);
        revalidatePath("/profile");
    } catch (err) {
        throw new Error(err as string);
    }
}
