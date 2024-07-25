import { getUser } from "@/server/queries";
import { PfpUploader } from "./_components/pfp-card";
import UpdateProfileForm from "./_components/update-profile-form";

export default async function EditProfile() {
    const user = await getUser();

    return (
        <div className="flex flex-col gap-7">
            <PfpUploader pfpUrl={user?.pfpUrl ?? user?.image ?? ""} />
            <UpdateProfileForm
                username={user?.username ?? ""}
                bio={user?.bio ?? ""}
            />
        </div>
    );
}
