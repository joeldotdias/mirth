import { getUser } from "@/server/queries";
import { PfpCard } from "./_components/pfp-card";

export default async function Profile() {
    const user = await getUser();

    return (
        <div>
            <div>
                <PfpCard pfpUrl={user?.pfpUrl ?? user?.image ?? ""} />
            </div>
        </div>
    );
}
