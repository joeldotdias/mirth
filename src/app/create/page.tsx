"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    type FileWithPreview,
    cropAndScaleImage,
    expandImageProperties,
} from "@/lib/image-proc";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Point, Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { toast } from "sonner";
import { generateMimeTypes } from "uploadthing/client";

// prettier-ignore
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
    const [isEditing, setIsEditing] = useState(-1);

    const { isUploading, startUpload, routeConfig } = useUploadThing(
        "postUploader",
        {
            skipPolling: true,
            onClientUploadComplete: async(uploadedFiles) => {
                // uploadedFiles.forEach(callbackfn)
            },
            onUploadError: () => {
                toast.error("Couldn't upload your posts");
            },
        },
    );

    const imageProperties = expandImageProperties(routeConfig);

    useEffect(() => {
        if (files && croppedAreas) {
            if(isEditing === -1) {
                return;
            }

            void cropAndScaleImage(
                files[isEditing],
                croppedAreas[isEditing],
                imageProperties,
            ).then((outImage) => {
                setOutputs((oldOutputs) => {
                    if(!oldOutputs) {
                        const newThangs = Array.from({length: files.length});
                        newThangs[isEditing] = outImage;
                        return newThangs;
                    }

                    const newOutputs = oldOutputs.map((oOp, idx) => {
                        if(idx === isEditing) {
                            return outImage;
                        } else {
                            return oOp;
                        }
                    })
                    return newOutputs;
                })
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files, croppedAreas]);

    const uploadCroppedImages = async() => {
        if(!files) {
            return
        }
        const toUpload = files.map((f, idx) => {
            if(outputs?.[idx]) {
                return outputs[idx]
            } else {
                return f;
            }
        })
        await startUpload(toUpload)
    }

    return (
        <main className="container mx-auto flex min-h-screen flex-col items-center gap-7 pt-6">
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
                <Carousel
                    className="w-full max-w-xl"
                    opts={{ watchDrag: false }}
                >
                    <CarouselContent>
                        {Array.from({ length: files.length }).map(
                            (_, crsIdx) => (
                                <CarouselItem key={crsIdx}>
                                    <div className="p-1">
                                        <div className="flex justify-center">
                                            {files && !shouldEdit && (
                                                <div className="relative p-2">
                                                    <img
                                                        src={outputs?.[crsIdx]?.preview
                                                            ?? files[crsIdx].preview
                                                        }
                                                        alt="pfp"
                                                        className="h-[600px] w-[480px] cursor-pointer"
                                                        onClick={() => {
                                                            setShouldEdit(true)
                                                            setIsEditing(crsIdx)
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {files && shouldEdit && (
                                            <>
                                                <div className="relative h-full min-h-[400px] w-full">
                                                    <Cropper
                                                        image={files[crsIdx].preview}
                                                        aspect={imageProperties?.aspectRatio}
                                                        maxZoom={5}
                                                        crop={crops[crsIdx]}
                                                        zoom={zooms[crsIdx]}
                                                        onCropChange={(location,) => {
                                                            setCrops((prevCrops) => {
                                                                const newCrops = prevCrops.map((pCrop, idx) => {
                                                                    if (idx === crsIdx) {
                                                                        return location;
                                                                    } else {
                                                                        return pCrop;
                                                                    }
                                                                });

                                                                return newCrops;
                                                            });
                                                        }}
                                                        onZoomChange={(newZoom) => {
                                                            setZooms((oldZooms) => {
                                                                const newZooms =oldZooms.map((oZoom, idx) => {
                                                                    if (idx ===crsIdx) {
                                                                        return newZoom;
                                                                    } else {
                                                                        return oZoom;
                                                                    }
                                                                });

                                                                return newZooms;
                                                            });
                                                        }}
                                                        onCropComplete={(_, area) => {
                                                            setCroppedAreas((prevCroppedAreas) => {
                                                                if (!prevCroppedAreas) {
                                                                    const atf: Area[] = Array.from({ length: files.length });
                                                                    atf[0] = area;
                                                                    return atf;
                                                                }

                                                                const newCroppedArea = prevCroppedAreas.map((pCA, idx) => {
                                                                    if (idx === crsIdx) {
                                                                        return area;
                                                                    } else {
                                                                        return pCA;
                                                                    }
                                                                });

                                                                return newCroppedArea;
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>setShouldEdit(false)}
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
            <button type="button" onClick={uploadCroppedImages}>Post</button>
        </main>
    );
}
