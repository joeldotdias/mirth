"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useUploadThing } from "@/lib/uploadthing";
import { invariant } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Point, Area } from "react-easy-crop";
import { toast } from "sonner";
import type { ExpandedRouteConfig } from "uploadthing/types";
import { generateMimeTypes } from "uploadthing/client";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, XIcon } from "lucide-react";
import Cropper from "react-easy-crop";

type FileWithPreview = File & { preview: string };

export function PfpUploader({ pfpUrl }: { pfpUrl: string }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<FileWithPreview | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [newImageLoading, setNewImageLoading] = useState(false);
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
    const [output, setOutput] = useState<FileWithPreview | null>(null);

    useEffect(() => {
        if (file && croppedArea) {
            void cropAndSclaeImage(file, croppedArea, imageProperties).then(
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
                    if (!e.target.files?.[0]) return;
                    const file = e.target.files[0];
                    const preview = URL.createObjectURL(file);
                    setFile(Object.assign(file, { preview }));
                }}
            />

            <div className="flex justify-between">
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Pfp for your account</CardDescription>
                </CardHeader>

                {!file && (
                    <div className="relative p-6">
                        {newImageLoading && (
                            <div className="absolute inset-6 flex animate-pulse items-center justify-center rounded-2xl bg-black/80" />
                        )}

                        {/*eslint-disable-next-line*/}
                        <img
                            src={output?.preview ?? pfpUrl}
                            alt="pfp"
                            className={
                                "size-32 cursor-pointer rounded-2xl hover:opacity-75"
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

            <CardFooter className="justify-between border-t px-6 py-4">
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

const cropAndSclaeImage = async (
    imageFile: FileWithPreview,
    crop: Area,
    imageSize?: { width?: number; height?: number },
) => {
    const image = new Image();
    image.src = imageFile.preview;
    await new Promise((resolve) => (image.onload = resolve));

    const cropCanvas = document.createElement("canvas");
    const cropCtx = cropCanvas.getContext("2d");
    invariant(cropCtx, "Couldn't get canvas context");

    cropCanvas.width = crop.width;
    cropCanvas.height = crop.height;

    cropCtx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
    );

    if (!imageSize?.height || !imageSize.width) {
        return canvasToPreviewImage(cropCanvas, imageFile);
    }

    const scaledCanvas = document.createElement("canvas");
    const scaledCtx = scaledCanvas.getContext("2d");
    invariant(scaledCtx, "Couldn't get canvas context");

    scaledCanvas.width = imageSize?.width;
    scaledCanvas.height = imageSize?.height;

    scaledCtx.drawImage(
        cropCanvas,
        0,
        0,
        cropCanvas.width,
        cropCanvas.height,
        0,
        0,
        imageSize.width,
        imageSize.height,
    );

    return canvasToPreviewImage(scaledCanvas, imageFile);
};

const canvasToPreviewImage = async (
    canvas: HTMLCanvasElement,
    imageFile: File,
): Promise<FileWithPreview> => {
    console.log("imageFile", imageFile);
    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error("Couldn't convert canvas to blob"));
            }
        }, imageFile.type);
    });

    const name = imageFile.name.replace(/\.svg$/, ".png");

    return Object.assign(new File([blob], name, { type: blob.type }), {
        preview: canvas.toDataURL(imageFile.type),
    });
};

function waitForImageToLoad(src: string) {
    const maxAttempts = 10;
    let attempt = 0;

    return new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve();
        image.onerror = () => {
            console.error("Couldn't load image", src);
            if (attempt++ >= maxAttempts) {
                reject(new Error("Couldn't load image"));
            }
            setTimeout(() => (image.src = src), 250);
        };
    });
}

function expandImageProperties(config: ExpandedRouteConfig | undefined) {
    const imageProperties = config?.image?.additionalProperties;

    if (!imageProperties) {
        return;
    }

    const { width, height, aspectRatio } = imageProperties;

    if (width && height) {
        return { width, height, aspectRatio: width / height };
    }

    if (width && aspectRatio) {
        return { width, height: width / aspectRatio, aspectRatio };
    }

    if (height && aspectRatio) {
        return { width: height * aspectRatio, height, aspectRatio };
    }

    if (aspectRatio) {
        return { width: undefined, height: undefined, aspectRatio };
    }
}
