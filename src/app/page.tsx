import { getUser } from "@/server/queries";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await getUser();

    if (!user) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="container">
            <div>{JSON.stringify(user)}</div>
        </div>
    );
}
