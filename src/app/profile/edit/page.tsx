import { getUser } from "@/server/queries";
import { PfpUploader } from "./_components/pfp-card";
import UpdateProfileForm from "./_components/update-profile-form";

export default async function EditProfile() {
    const user = await getUser();

    return (
        <main className="container mx-auto flex min-h-screen flex-col gap-7 pt-6">
            <PfpUploader pfpUrl={user?.pfpUrl ?? user?.image ?? ""} />
            <UpdateProfileForm
                username={user?.username ?? ""}
                bio={user?.bio ?? ""}
                birthdate={user?.birthdate ?? new Date()}
            />
        </main>
    );
}
