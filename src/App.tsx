import { Button, Input, Link, Radio } from "@cloudflare/kumo";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImageDialog } from "./components/ImageDialog";
import { UmaCard, type UmaCardProps } from "./components/UmaCard";
import { UmaProfileSelect } from "./components/UmaProfileSelect";
import { seriesOptions } from "./components/series-options";
import type { FlatUma } from "./types";

const currentYear = new Date().getFullYear();

function App() {
  const [series, setSeries] = useState<UmaCardProps["series"]>("cinderellagray");
  const [profile, setProfile] = useState<FlatUma | null>(null);
  const [likeCount, setLikeCount] = useState<string>("8192");
  const [tagLine1, setTagLine1] = useState<UmaCardProps["tagLine1"]>(
    `#umamusume #prettyderby #${currentYear}`,
  );
  const [tagLine2, setTagLine2] = useState<UmaCardProps["tagLine2"]>("#umastagramgenerator");

  const lastBgImage = useRef("");
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    return () => URL.revokeObjectURL(lastBgImage.current);
  }, []);

  const updateBgImage = (blobUrl: string) => {
    URL.revokeObjectURL(lastBgImage.current);
    lastBgImage.current = blobUrl;
    setBgImage(blobUrl);
  };

  const canShareFile = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      typeof navigator.share !== "undefined" &&
      !!navigator.canShare?.({ files: [new File([], "test.png", { type: "image/png" })] }),
    [],
  );

  const getCard = (action: "download" | "open" | "share") => {
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

    canvas!.toBlob(async (blob) => {
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
    }, "image/png");
  };

  return (
    <div className="container">
      <UmaCard
        series={series}
        username={profile?.name_en.replace(/\s+/g, "_") || ""}
        profileImg={profile?.image ?? ""}
        profileBorderColor={profile?.color_main ?? ""}
        profileZoomOffsetY={profile?.image.includes("_thumb.png") ? 8 : 0}
        profileZoomAmount={profile?.image.includes("_thumb.png") ? 32 : 10}
        likeCount={parseInt(likeCount, 10)}
        tagLine1={tagLine1}
        tagLine2={tagLine2}
        bgImageUrl={bgImage}
      />

      <div className="container__options">
        <div className="container__options__image">
          <ImageDialog onFinalizeImage={updateBgImage} />
          {canShareFile && (
            <Button type="button" size="lg" onClick={() => getCard("share")}>
              Share
            </Button>
          )}

          <Button type="button" size="lg" onClick={() => getCard("download")}>
            Download
          </Button>
          <Button type="button" size="lg" onClick={() => getCard("open")}>
            Open
          </Button>
        </div>

        <Radio.Group
          legend="Series"
          value={series}
          onValueChange={(val) => setSeries(val ?? "none")}
        >
          {Object.entries(seriesOptions).map(([value, opt]) => (
            <Radio.Item key={value} value={value} label={opt.label} />
          ))}
        </Radio.Group>

        <UmaProfileSelect value={profile} onValueChange={setProfile} defaultUmaName="Oguri Cap" />

        <Input
          label="Like count"
          placeholder="8192"
          value={likeCount}
          onValueChange={(val) => setLikeCount(val ?? "")}
        />

        <Input
          label="Tag line 1"
          placeholder="#umamusume #prettyderby"
          value={tagLine1}
          onValueChange={(val) => setTagLine1(val)}
        />
        <Input
          label="Tag line 2"
          placeholder="#umastagramgenerator"
          value={tagLine2}
          onValueChange={(val) => setTagLine2(val)}
        />
      </div>

      <div className="container__footer">
        <Link href="https://github.com/altbdoor/umastagram-generator">GitHub</Link>
        <Link href="https://umapyoi.net/">umapyoi.net</Link>
        <Link href="https://kumo-ui.com/">Kumo UI</Link>
        <Link href="https://github.com/ValentinH/react-easy-crop">react-easy-crop</Link>
        <Link href="https://fontawesome.com/v6/icons/">FontAwesome</Link>
      </div>
    </div>
  );
}

export default App;
