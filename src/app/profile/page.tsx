import { getUser } from "@/server/queries";
import Image from "next/image";
import Stats from "./_components/stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Profile() {
    const user = await getUser();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-16">
                <div className="size-[170px] relative flex  shrink-0 overflow-hidden rounded-full">
                    {user?.pfpUrl && (
                        <Image src={user.pfpUrl} alt="img" fill={true} />
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-bold">{user?.name}</div>
                    {/* stats */}
                    <Stats />

                    {user?.bio && <p className="pt-4">{user.bio}</p>}
                </div>
            </div>

            <Tabs defaultValue="posts">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="tagged">Tagged</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                </TabsList>

                <TabsContent value="posts"></TabsContent>
                <TabsContent value="tagged"></TabsContent>
                <TabsContent value="saved"></TabsContent>
            </Tabs>
        </div>
    );
}
