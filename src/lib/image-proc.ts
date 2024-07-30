import type { Area } from "react-easy-crop";
import { invariant } from "./utils";
import type { ExpandedRouteConfig } from "uploadthing/types";

export type FileWithPreview = File & { preview: string };

export const cropAndScaleImage = async (
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

export function waitForImageToLoad(src: string) {
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

export function expandImageProperties(config: ExpandedRouteConfig | undefined) {
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
