"use client";

import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function PfpCard({ pfpUrl }: { pfpUrl: string }) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative h-44 w-32 rounded-full">
                <Image
                    src={pfpUrl}
                    alt="pfp"
                    height={240}
                    width={240}
                    className="aspect-square rounded-full object-cover"
                />
            </div>
            <UploadButton
                endpoint="pfpUploader"
                onClientUploadComplete={() => {
                    router.refresh();
                }}
            />
        </div>
    );
}
