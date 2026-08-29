export const getCard = async (action: "download" | "open" | "share") => {
  const canvas = document.querySelector<HTMLCanvasElement>(".container canvas");
  if (!canvas) {
    alert("Unable to find canvas!");
    return;
  }

  let win: Window | null = null;
  if (action === "open") {
    win = window.open("about:blank", "_blank");

    if (!win) {
      alert("Unable to open image in new tab. Please try downloading instead.");
      return;
    }
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));

  if (!blob) {
    alert("Unable to create blob from canvas!");
    return;
  }

  if (action === "download") {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "umastagram.png";
    link.hidden = true;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } else if (action === "open") {
    const blobUrl = URL.createObjectURL(blob);
    win!.location.href = blobUrl;
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
  } else {
    const file = new File([blob], "umastagram.png", { type: "image/png" });

    try {
      await navigator.share({ files: [file] });
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        return;
      }

      alert("Unable to share image!");
      console.error(err);
    }
  }
};
