import { getUser } from "@/server/queries";

export default async function Home() {
    const user = await getUser();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>{JSON.stringify(user)}</div>
        </main>
    );
}
