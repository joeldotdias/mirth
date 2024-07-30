import { metadata } from "@/app/layout";
import { getUser, updateUserPfp } from "@/server/queries";
import { utapi } from "@/server/uploadthing";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    pfpUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
            additionalProperties: { width: 200, aspectRatio: 1 },
        },
    })
        .middleware(async () => {
            const user = await getUser();
            if (!user) {
                throw new UploadThingError("Unauthorized");
            }

            const currPfpKey = user.pfpUrl?.split("/f/")[1];

            return {
                userId: user.id,
                prevPfpKey: currPfpKey,
            };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log(
                `Upload ${file.url} completed for userId: ${metadata.userId}`,
            );

            try {
                await updateUserPfp(metadata.userId, file.url);
                if (metadata.prevPfpKey) {
                    await utapi.deleteFiles(metadata.prevPfpKey);
                }
            } catch (err) {
                console.error(err);
            }

            return { uploadedBy: metadata.userId };
        }),
    postUploader: f({
        image: {
            maxFileSize: "8MB",
            maxFileCount: 4,
            additionalProperties: { aspectRatio: 0.8, width: 480 },
        },
    })
        .middleware(async () => {
            const user = await getUser();
            if (!user) {
                throw new UploadThingError("Unauthorized");
            }

            return {
                userId: user.id,
            };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log(
                `Upload ${JSON.stringify(file)} completed for userId: ${metadata.userId}`,
            );

            try {
            } catch (err) {
                console.error(err);
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
