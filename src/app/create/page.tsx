"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cropAndScaleImage, expandImageProperties } from "@/lib/image-proc";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Point, Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { toast } from "sonner";
import { generateMimeTypes } from "uploadthing/client";

export default function CreatePost() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileWithPreview[] | null>(null);
    const [crops, setCrops] = useState<Point[]>(
        Array.from({ length: 4 }).map((_) => ({ x: 0, y: 0 })),
    );
    const [zooms, setZooms] = useState([1, 1, 1, 1]);
    const [croppedAreas, setCroppedAreas] = useState<Area[] | null>(null);
    const [newImageLoading, setNewImageLoading] = useState(false);

    const [outputs, setOutputs] = useState<FileWithPreview[] | null>(null);
    const router = useRouter();
    const [shouldEdit, setShouldEdit] = useState(false);

    const { isUploading, startUpload, routeConfig } = useUploadThing(
        "postUploader",
        {
            skipPolling: true,
            onUploadError: () => {
                toast.error("Couldn't upload your posts");
            },
        },
    );

    const imageProperties = expandImageProperties(routeConfig);

    useEffect(() => {
        if (files && croppedAreas) {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < croppedAreas.length; i++) {
                void cropAndScaleImage(
                    // files[0],
                    files[i],
                    // croppedAreas[0],
                    croppedAreas[i],
                    imageProperties,
                ).then((image) => {
                    setOutputs((oldOutputs) => {
                        if (!oldOutputs) {
                            const newThangs = [image];
                            return newThangs;
                        }
                        const newOutputs = oldOutputs?.map((oOp, idx) => {
                            /* need to change this to current image being edited*/
                            if (idx === 1) {
                                return image;
                            } else {
                                return oOp;
                            }
                        });

                        return newOutputs;
                    });
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files, croppedAreas]);

    return (
        <main className="container mx-auto flex min-h-screen flex-col gap-7 pt-6">
            <input
                type="file"
                ref={inputRef}
                accept={generateMimeTypes(routeConfig ?? {}).join(",")}
                className="hidden"
                multiple
                onChange={(e) => {
                    if (!e.target.files?.[0]) {
                        return;
                    }

                    const selected: FileWithPreview[] = [];
                    // eslint-disable-next-line @typescript-eslint/prefer-for-of
                    for (let i = 0; i < e.target.files.length; i++) {
                        // const file = e.target.files[0];
                        const file = e.target.files[i];
                        const preview = URL.createObjectURL(file);
                        selected.push(Object.assign(file, { preview }));
                    }
                    setFiles(selected);
                }}
            />
            <button type="button" onClick={() => inputRef.current?.click()}>
                Upload
            </button>

            {files && (
                <Carousel className="w-full max-w-xl">
                    <CarouselContent>
                        {Array.from({ length: files.length }).map(
                            (_, crsIdx) => (
                                <CarouselItem key={crsIdx}>
                                    <div className="p-1">
                                        <div className="flex justify-center">
                                            {files && !shouldEdit && (
                                                <div className="relative p-2">
                                                    <img
                                                        src={
                                                            outputs?.[crsIdx]
                                                                ?.preview ??
                                                            files[crsIdx]
                                                                .preview
                                                        }
                                                        alt="pfp"
                                                        className="h-[600px] w-[480px] cursor-pointer"
                                                        onClick={() =>
                                                            setShouldEdit(true)
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {files && shouldEdit && (
                                            <>
                                                <div className="relative h-full min-h-[400px] w-full">
                                                    <Cropper
                                                        image={
                                                            files[crsIdx]
                                                                .preview
                                                        }
                                                        aspect={
                                                            imageProperties?.aspectRatio
                                                        }
                                                        maxZoom={5}
                                                        crop={crops[crsIdx]}
                                                        zoom={zooms[crsIdx]}
                                                        onCropChange={(
                                                            location,
                                                        ) => {
                                                            setCrops(
                                                                (prevCrops) => {
                                                                    const newCrops =
                                                                        prevCrops.map(
                                                                            (
                                                                                pCrop,
                                                                                idx,
                                                                            ) => {
                                                                                if (
                                                                                    idx ===
                                                                                    crsIdx
                                                                                ) {
                                                                                    return location;
                                                                                } else {
                                                                                    return pCrop;
                                                                                }
                                                                            },
                                                                        );
                                                                    return newCrops;
                                                                },
                                                            );
                                                        }}
                                                        onZoomChange={(
                                                            newZoom,
                                                        ) => {
                                                            setZooms(
                                                                (oldZooms) => {
                                                                    const newZooms =
                                                                        oldZooms.map(
                                                                            (
                                                                                oZoom,
                                                                                idx,
                                                                            ) => {
                                                                                if (
                                                                                    idx ===
                                                                                    crsIdx
                                                                                ) {
                                                                                    return newZoom;
                                                                                } else {
                                                                                    return oZoom;
                                                                                }
                                                                            },
                                                                        );
                                                                    return newZooms;
                                                                },
                                                            );
                                                        }}
                                                        onCropComplete={(
                                                            _,
                                                            area,
                                                        ) => {
                                                            setCroppedAreas(
                                                                (
                                                                    prevCroppedAreas,
                                                                ) => {
                                                                    if (
                                                                        !prevCroppedAreas
                                                                    ) {
                                                                        const ntb =
                                                                            [
                                                                                area,
                                                                            ];
                                                                        return ntb;
                                                                    }
                                                                    const newCroppedArea =
                                                                        prevCroppedAreas.map(
                                                                            (
                                                                                pCA,
                                                                                idx,
                                                                            ) => {
                                                                                if (
                                                                                    idx ===
                                                                                    crsIdx
                                                                                ) {
                                                                                    return area;
                                                                                } else {
                                                                                    return pCA;
                                                                                }
                                                                            },
                                                                        );
                                                                    return newCroppedArea;
                                                                },
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShouldEdit(false)
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </CarouselItem>
                            ),
                        )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            )}
        </main>
    );
}
