import { getUser } from "@/server/queries";

export default async function Home() {
    const user = await getUser();

    return (
        <div className="4 flex">
            <div>{JSON.stringify(user)}</div>
        </div>
    );
}
