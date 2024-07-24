import { getUser } from "@/server/queries";
import Image from "next/image";
import Link from "next/link";

export default async function Avatar() {
    const user = await getUser();
    return (
        <div className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ">
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
