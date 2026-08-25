import { Button, Dialog, Text } from "@cloudflare/kumo";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";

interface ImageDialogProps {
  onFinalizeImage: (blobUrl: string) => void;
}

export function ImageDialog(props: ImageDialogProps) {
  // dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogAnimateDone, setIsDialogAnimateDone] = useState(false);

  // image states
  const lastPreviewUrl = useRef("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  // cropper states
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const area = useRef<Area>({ height: 0, width: 0, x: 0, y: 0 });

  const onFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.currentTarget.files?.item(0);

    if (file) {
      URL.revokeObjectURL(lastPreviewUrl.current);
      const nextImage = URL.createObjectURL(file);
      lastPreviewUrl.current = nextImage;
      setPreviewUrl(nextImage);
    }
  };

  // clear last preview url when closing
  useEffect(() => {
    return () => URL.revokeObjectURL(lastPreviewUrl.current);
  }, []);

  const isDialogReadyForCropper = isDialogOpen && isDialogAnimateDone;

  const finalizeCrop = async () => {
    if (!previewUrl) {
      return;
    }

    const initialBlob = await fetch(previewUrl).then((res) => res.blob());
    const bitmap = await createImageBitmap(initialBlob);

    const { width, height, x, y } = area.current;
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d")!;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(bitmap, x, y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await canvas.convertToBlob({ type: "image/png" });
    props.onFinalizeImage(URL.createObjectURL(blob));
    setIsDialogOpen(false);
  };

  return (
    <Dialog.Root
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      disablePointerDismissal
      onOpenChangeComplete={setIsDialogAnimateDone}
    >
      <Dialog.Trigger
        render={(p) => (
          <Button variant="primary" type="button" size="lg" {...p}>
            Change background image
          </Button>
        )}
      />

      <Dialog size="lg">
        <div className="img-dialog">
          <Dialog.Description render={<div />}>
            <div className="img-dialog__cropper">
              {/* cropper needs to wait for dialog animation to finish */}
              {isDialogReadyForCropper && (
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  objectFit="cover"
                  aspect={500 / 460}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_croppedArea, croppedAreaPixels) => {
                    area.current = croppedAreaPixels;
                  }}
                  disableAutomaticStylesInjection
                />
              )}
            </div>

            <div className="img-dialog__help">
              <Text variant="secondary">Scroll/pinch to zoom, drag to reposition</Text>
            </div>
          </Dialog.Description>

          <div className="img-dialog__buttons">
            <Dialog.Close
              render={(p) => (
                <Button variant="secondary-destructive" {...p}>
                  Cancel
                </Button>
              )}
            />

            <Button
              type="button"
              variant="secondary"
              onClick={(evt) => evt.currentTarget.querySelector("input")!.click()}
            >
              {previewUrl ? "Change image" : "Click here to begin"}

              <div hidden>
                <input type="file" accept="image/*" onChange={onFileChange} />
              </div>
            </Button>

            <Button type="button" variant="primary" onClick={finalizeCrop}>
              OK
            </Button>
          </div>
        </div>
      </Dialog>
    </Dialog.Root>
  );
}
