import "server-only";

import { db } from "./db";
import { auth } from "@/auth";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getUser() {
    const session = await auth();
    if (!session?.user) {
        return;
    }

    const user = await db.query.users.findFirst({
        where: (model, { eq }) => eq(model.id, session.user.id),
    });

    return user;
}

export async function updateUserPfp(userId: string, pfpUrl: string) {
    try {
        await db
            .update(users)
            .set({ pfpUrl: pfpUrl })
            .where(eq(users.id, userId));
    } catch (err) {
        console.error(err);
    }
}

export async function updateUserInfo(
    username: string,
    bio: string,
    birthdate: Date,
) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        await db
            .update(users)
            .set({ username: username, bio: bio, birthdate: birthdate })
            .where(eq(users.id, user.id));
    } catch (err) {
        console.error(err);
    }
}
