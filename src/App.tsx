import { Button, Input, Link, Radio } from "@cloudflare/kumo";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageDialog } from "./components/ImageDialog";
import { UmaCard, type UmaCardProps } from "./components/UmaCard";
import { UmaInsertSelect } from "./components/UmaInsertSelect";
import { UmaPreset, type UmaPresetOptions } from "./components/UmaPreset";
import { UmaProfileSelect } from "./components/UmaProfileSelect";
import { seriesOptions } from "./components/series-options";
import type { FlatUma } from "./types";
import { getCard } from "./util/get-card";

const currentYear = new Date().getFullYear();

const canShareFile =
  typeof navigator !== "undefined" &&
  typeof navigator.share !== "undefined" &&
  !!navigator.canShare?.({ files: [new File([], "test.png", { type: "image/png" })] });

function App() {
  const [seriesIndex, setSeriesIndex] = useState("1");

  const cachedProfileRef = useRef<FlatUma[]>([]);
  const [profile, setProfile] = useState<FlatUma | null>(null);
  const [likeCount, setLikeCount] = useState<string>("8192");
  const [tagLine1, setTagLine1] = useState<UmaCardProps["tagLine1"]>(
    `#umamusume #prettyderby #${currentYear}`,
  );
  const [tagLine2, setTagLine2] = useState<UmaCardProps["tagLine2"]>("#umastagramgenerator");

  const lastBgImage = useRef("");
  const [bgImage, setBgImage] = useState("");

  const [insertIndex, setInsertIndex] = useState(1);

  useEffect(() => {
    return () => URL.revokeObjectURL(lastBgImage.current);
  }, []);

  const updateBgImage = (blobUrl: string) => {
    URL.revokeObjectURL(lastBgImage.current);
    lastBgImage.current = blobUrl;
    setBgImage(blobUrl);
  };

  const onProfileSelectReady = useCallback((items: FlatUma[]) => {
    const defaultOguri = items.find((uma) => uma.name_en === "Oguri Cap")!;
    cachedProfileRef.current.push(defaultOguri);
    setProfile(defaultOguri);
    cachedProfileRef.current.push(items.find((uma) => uma.name_en === "Sakura Laurel")!);
    // note: in dev mode, 2x useEffect will still call this function twice. but
    // caching the profiles twice is not a negative anyways.
  }, []);

  const handlePreset = (val: UmaPresetOptions) => {
    if (val === "oguri1") {
      setSeriesIndex("1");
      setInsertIndex(1);
      setProfile(cachedProfileRef.current.at(0)!);
    } else if (val === "sakura1") {
      setSeriesIndex("2");
      setInsertIndex(2);
      setProfile(cachedProfileRef.current.at(1)!);
    }
  };

  return (
    <div className="container">
      <UmaCard
        seriesIndex={parseInt(seriesIndex, 10)}
        username={profile?.name_en.replace(/\s+/g, "_") || ""}
        profileImg={profile?.image ?? ""}
        profileBorderColor={profile?.color_main ?? ""}
        profileZoomOffsetY={profile?.image.includes("_thumb.png") ? 8 : 0}
        profileZoomAmount={profile?.image.includes("_thumb.png") ? 32 : 10}
        likeCount={parseInt(likeCount, 10)}
        tagLine1={tagLine1}
        tagLine2={tagLine2}
        bgImgUrl={bgImage}
        insertIndex={insertIndex}
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

        <UmaPreset onPresetSelect={handlePreset} />

        <Radio.Group
          legend="Series"
          value={seriesIndex}
          onValueChange={(val) => setSeriesIndex(val ?? "0")}
        >
          {seriesOptions.map((opt, idx) => (
            <Radio.Item key={opt.label} value={String(idx)} label={opt.label} />
          ))}
        </Radio.Group>

        <UmaProfileSelect
          value={profile}
          onValueChange={setProfile}
          onReady={onProfileSelectReady}
        />

        <UmaInsertSelect value={insertIndex} onValueChange={setInsertIndex} />

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
        <Link href="https://umamusu.wiki/">umamusu.wiki</Link>
        <Link href="https://kumo-ui.com/">Kumo UI</Link>
        <Link href="https://github.com/ValentinH/react-easy-crop">react-easy-crop</Link>
        <Link href="https://fontawesome.com/v6/icons/">FontAwesome</Link>
      </div>
    </div>
  );
}

export default App;
