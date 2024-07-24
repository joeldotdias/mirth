import { getUser } from "@/server/queries";
import Image from "next/image";
import Link from "next/link";

export default async function Avatar() {
    const user = await getUser();

    return (
        <div className="size-7 lg:size-5 relative flex  shrink-0 overflow-hidden rounded-full ">
            <Link href={"/profile"}>
                {user?.pfpUrl ? (
                    <Image src={user.pfpUrl} alt="img" fill={true} />
                ) : (
                    <div></div>
                )}
            </Link>
        </div>
    );
}
