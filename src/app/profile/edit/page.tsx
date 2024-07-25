import { getUser } from "@/server/queries";
import { PfpUploader } from "./_components/pfp-card";

export default async function EditProfile() {
    const user = await getUser();

    return (
        <div>
            <PfpUploader pfpUrl={user?.pfpUrl ?? user?.image ?? ""} />
        </div>
    );
}
