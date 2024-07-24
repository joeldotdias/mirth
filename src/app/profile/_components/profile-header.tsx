import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfileHeader() {
    return (
        <div className="flex flex-row-reverse gap-2">
            <form
                action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                }}
            >
                <Button variant="destructive" type="submit">
                    Sign out
                </Button>
            </form>
            <Link href={"/profile/edit"}>
                <Button variant="secondary">Edit profile</Button>
            </Link>
        </div>
    );
}
