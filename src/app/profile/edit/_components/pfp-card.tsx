"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Point, Area } from "react-easy-crop";
import { toast } from "sonner";
import { generateMimeTypes } from "uploadthing/client";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, XIcon } from "lucide-react";
import Cropper from "react-easy-crop";
import {
    type FileWithPreview,
    cropAndScaleImage,
    expandImageProperties,
    waitForImageToLoad,
} from "@/lib/image-proc";

export function PfpUploader({ pfpUrl }: { pfpUrl: string }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<FileWithPreview | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [newImageLoading, setNewImageLoading] = useState(false);
    const [output, setOutput] = useState<FileWithPreview | null>(null);
    const router = useRouter();

    const { isUploading, startUpload, routeConfig } = useUploadThing(
        "pfpUploader",
        {
            skipPolling: true,
            onClientUploadComplete: async ([uploadedFile]) => {
                if (file) {
                    URL.revokeObjectURL(file.preview);
                }
                setFile(null);

                setNewImageLoading(true);
                await waitForImageToLoad(uploadedFile.url).catch(toast.error);
                setNewImageLoading(false);

                if (output) {
                    URL.revokeObjectURL(output.preview);
                }
                setOutput(null);
                router.refresh();
            },
            onUploadError: () => {
                toast.error("Couldn't upload pfp");
            },
        },
    );

    const imageProperties = expandImageProperties(routeConfig);

    useEffect(() => {
        if (file && croppedArea) {
            void cropAndScaleImage(file, croppedArea, imageProperties).then(
                (image) => {
                    setOutput(image);
                },
            );
        }
    }, [file, croppedArea]); //eslint-disable-line

    const uploadCroppedImage = async () => {
        if (!croppedArea || !output) {
            return;
        }
        await startUpload([output]);
    };

    return (
        <Card>
            <input
                type="file"
                ref={inputRef}
                accept={generateMimeTypes(routeConfig ?? {}).join(",")}
                className="hidden"
                onChange={(e) => {
                    if (!e.target.files?.[0]) {
                        return;
                    }
                    alert(JSON.stringify(e.target.files));
                    const file = e.target.files[0];
                    const preview = URL.createObjectURL(file);
                    setFile(Object.assign(file, { preview }));
                }}
            />

            <div className="flex justify-center">
                {!file && (
                    <div className="relative p-2">
                        {newImageLoading && (
                            <div className="absolute inset-6 flex animate-pulse items-center justify-center rounded-full bg-black/80" />
                        )}

                        <img
                            src={output?.preview ?? pfpUrl}
                            alt="pfp"
                            className={
                                "size-24 cursor-pointer rounded-full hover:opacity-75"
                            }
                            onClick={() => inputRef.current?.click()}
                        />
                    </div>
                )}
            </div>

            {file && (
                <CardContent>
                    <div className="relative h-full min-h-[400px] w-full">
                        <Cropper
                            image={file?.preview}
                            cropShape="round"
                            aspect={imageProperties?.aspectRatio}
                            maxZoom={5}
                            crop={crop}
                            zoom={zoom}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(_, area) => setCroppedArea(area)}
                        />
                    </div>
                </CardContent>
            )}

            <CardFooter className="justify-center border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">
                    {file
                        ? "Zoom and drag to crop the image"
                        : pfpUrl
                          ? "Click on the pfp to upload a new one"
                          : "You haven't set a pfp yet. Click here to upload"}
                </p>
                <div className="flex items-center gap-2">
                    {file && !isUploading && (
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => inputRef.current?.click()}
                        >
                            <ImageIcon className="size-5" />
                        </Button>
                    )}

                    {file && (
                        <>
                            <Button
                                size="icon"
                                variant="destructive"
                                className="z-100 absolute right-2 top-2"
                                onClick={() => {
                                    setFile(null);
                                    if (inputRef.current) {
                                        inputRef.current.value = "";
                                    }
                                    setOutput(null);
                                }}
                            >
                                <XIcon className="size-5" />
                            </Button>
                            <Button
                                size="sm"
                                onClick={uploadCroppedImage}
                                disabled={isUploading}
                            >
                                {isUploading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save
                            </Button>
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
