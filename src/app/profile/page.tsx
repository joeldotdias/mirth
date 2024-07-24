import { getUser } from "@/server/queries";

export default async function Profile() {
    // const user = await getUser();

    return (
        <div>
            {/* <PfpUploader pfpUrl={user?.pfpUrl ?? user?.image ?? ""} /> */}
        </div>
    );
}
