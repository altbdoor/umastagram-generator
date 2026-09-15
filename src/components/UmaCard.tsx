import { useEffect, useRef, useState } from "react";
import blankPng from "../assets/img/blank.png";
import iconBunnySvg from "../assets/img/bunny-heart.svg";
import iconCommentSvg from "../assets/img/comment-dots.svg";
import iconCopyrightSvg from "../assets/img/copyright.svg";
import cygamesSvg from "../assets/img/cygames.svg";
import iconEnvelopeSvg from "../assets/img/envelope.svg";
import { insertOptions, seriesOptions } from "./series-options";

const enFormatter = new Intl.NumberFormat("en-US");

const formatLikeText = (likeCount: number, likesLang: string) => {
  let suffix = "likes!";
  if (likesLang === "en-UMA") {
    suffix = "Umazing!";
  } else if (likesLang === "ja") {
    suffix = "ウマいね!";
  }

  if (isNaN(likeCount)) {
    return `0 ${suffix}`;
  }

  if (likesLang !== "ja") {
    return `${enFormatter.format(likeCount)} ${suffix}`;
  }

  if (likeCount < 10000) {
    return `${likeCount} ${suffix}`;
  }

  const man = Math.floor(likeCount / 10000);
  const rem = likeCount % 10000;
  return rem === 0 ? `${man}万 ${suffix}` : `${man}万${rem} ${suffix}`;
};

const sansSerifFont = [
  `"Inter Tight", system-ui, -apple-system`,
  `'Hiragino Sans', 'Meiryo', 'Hiragino Kaku Gothic ProN'`,
  `sans-serif`,
  `"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
].join(", ");

const loadImage = async (path: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = path || blankPng;
  });
};

const computeImgWidth = (img: HTMLImageElement, height: number) => {
  return (height / img.naturalHeight) * img.naturalWidth;
};

const computeImgHeight = (img: HTMLImageElement, width: number) => {
  return (width / img.naturalWidth) * img.naturalHeight;
};

const ctxMeasure = (ctx: CanvasRenderingContext2D, text: string) => {
  const dimension = ctx.measureText(text || "hello");
  return {
    width: dimension.width,
    height: dimension.fontBoundingBoxAscent + dimension.fontBoundingBoxDescent,
  };
};

const parseTextAsTags = (ctx: CanvasRenderingContext2D, val: string, initialX: number) => {
  let sumX = initialX;

  return (val ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((item) => {
      const itemIsHash = /^[#＃]/.test(item);
      const textWidth = ctxMeasure(ctx, item + " ").width;

      const returnObj = {
        hash: itemIsHash,
        text: item,
        posX: sumX,
        color: itemIsHash ? "#3257B5" : "#000",
      };

      sumX += textWidth;
      return returnObj;
    });
};

export interface UmaCardProps {
  seriesIndex: number;
  username: string;
  profileImg: string;
  profileBorderColor: string;
  profileZoomOffsetY: number;
  profileZoomAmount: number;
  likeCount: number;
  tagLine1: string;
  tagLine2: string;
  bgImgUrl: string;
  insertIndex: number;
  likesLang: string;
}

export function UmaCard({
  seriesIndex,
  username,
  profileImg,
  profileBorderColor,
  profileZoomOffsetY,
  profileZoomAmount,
  tagLine1,
  tagLine2,
  likeCount,
  bgImgUrl,
  insertIndex,
  likesLang,
}: UmaCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function renderCanvas() {
      if (cancelled || !canvasRef.current) {
        return;
      }

      await Promise.all([
        document.fonts.load('400 italic 45px "indigo_daisy"'),
        document.fonts.load('400 20px "Inter Tight"'),
        document.fonts.load('500 20px "Inter Tight"'),
        document.fonts.load('700 20px "Inter Tight"'),
      ]);
      const currentSeries = seriesOptions.at(seriesIndex)!;
      const currentInsert = insertOptions.at(insertIndex)!;

      // all images should be preloaded to not disrupt canvas drawing
      const [
        seriesImg,
        profileImgElem,
        insertImg,
        iconBunny,
        iconComment,
        iconEnvelope,
        iconCopyright,
        cygames,
        bgImg,
      ] = await Promise.all([
        loadImage(currentSeries.image),
        loadImage(profileImg),
        loadImage(currentInsert.image),
        loadImage(iconBunnySvg),
        loadImage(iconCommentSvg),
        loadImage(iconEnvelopeSvg),
        loadImage(iconCopyrightSvg),
        loadImage(cygamesSvg),
        bgImgUrl ? loadImage(bgImgUrl) : null,
      ]);

      if (cancelled) {
        return;
      }

      const canvas = canvasRef.current!;
      const ctx = canvasRef.current.getContext("2d")!;
      const scale = 2;
      const width = 540;

      canvas.width = width * scale;
      canvas.height = 720 * scale;
      canvas.style.width = "100%";
      canvas.style.height = "auto";

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.textBaseline = "top";

      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#f8f8f7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // header title
      ctx.font = '400 italic 45px "indigo_daisy"';
      ctx.fillStyle = "#000";
      ctx.fillText("Umastagram", 8, 10);

      // header border
      ctx.fillStyle = "#bbb";
      ctx.fillRect(0, 60, width, 2);

      // series logo
      ctx.drawImage(
        seriesImg,
        width - currentSeries.width,
        2,
        currentSeries.width - 4,
        computeImgHeight(seriesImg, currentSeries.width),
      );

      // profile pic
      const profilePicX = 20;
      const profilePicY = 69;
      const profilePicFrameSize = 60;
      const profilePicRenderSize = profilePicFrameSize + profileZoomAmount;

      const beginProfilePicArc = () => {
        ctx.beginPath();
        ctx.arc(
          profilePicX + profilePicFrameSize / 2,
          profilePicY + profilePicFrameSize / 2,
          profilePicFrameSize / 2,
          0,
          Math.PI * 2,
        );
      };

      ctx.save();
      beginProfilePicArc();
      ctx.fillStyle = "#fff";
      ctx.fill();

      const profileOffsetY =
        profilePicFrameSize / 2 - profilePicRenderSize / 2 + profileZoomOffsetY;

      beginProfilePicArc();
      ctx.clip();
      ctx.drawImage(
        profileImgElem,
        profilePicX + profilePicFrameSize / 2 - profilePicRenderSize / 2,
        profilePicY + profileOffsetY,
        profilePicRenderSize,
        profilePicRenderSize,
      );

      // profile pic border
      beginProfilePicArc();
      ctx.lineWidth = 3;
      ctx.strokeStyle = profileBorderColor;
      ctx.stroke();
      ctx.restore();

      // profile name
      ctx.font = `700 20px ${sansSerifFont}`;
      ctx.fillStyle = "#000";
      const { height: profileNameHeight } = ctxMeasure(ctx, "");
      ctx.fillText(username, 94, profilePicY + profilePicFrameSize / 2 - profileNameHeight / 2);

      // image box container
      const imgBoxX = 20;
      const imgBoxY = 137;
      const imgBoxW = width - 40;
      const imgBoxH = 460;

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#fff";
      ctx.fillRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH);
      ctx.restore();

      // image box clip
      ctx.save();
      ctx.beginPath();
      ctx.rect(imgBoxX, imgBoxY, imgBoxW, imgBoxH);
      ctx.clip();

      if (bgImg) {
        const bgImgScale = Math.max(imgBoxW / bgImg.naturalWidth, imgBoxH / bgImg.naturalHeight);

        const imgWidth = bgImg.naturalWidth * bgImgScale;
        const imgHeight = bgImg.naturalHeight * bgImgScale;

        const imgX = imgBoxX + (imgBoxW - imgWidth) / 2;
        const imgY = imgBoxY + (imgBoxH - imgHeight) / 2;

        ctx.drawImage(bgImg, imgX, imgY, imgWidth, imgHeight);
      }

      const insertImgWidth = currentInsert.width;
      const insertImgHeight = computeImgHeight(insertImg, insertImgWidth);
      let insertImgX = 20;
      if (currentInsert.align === "bottom-center") {
        insertImgX = (width - insertImgWidth) / 2;
      } else if (currentInsert.align === "bottom-right") {
        insertImgX = width - 20 - insertImgWidth;
      }

      ctx.drawImage(
        insertImg,
        insertImgX,
        imgBoxY + imgBoxH - insertImgHeight,
        insertImgWidth,
        insertImgHeight,
      );

      ctx.restore();

      // icons
      const iconY = 605;
      ctx.drawImage(iconBunny, 23, iconY, 54, 54);
      ctx.drawImage(iconComment, 436, iconY, 38, 38);
      ctx.drawImage(iconEnvelope, 484, iconY, 36, 36);

      // like count text
      ctx.font = `400 20px ${sansSerifFont}`;
      ctx.fillStyle = "#fd9d9c";
      const { height: likeCountHeight } = ctxMeasure(ctx, "");
      ctx.fillText(formatLikeText(likeCount, likesLang), 78, iconY + 54 / 2 - likeCountHeight / 2);

      // username text again
      ctx.font = `500 16px ${sansSerifFont}`;
      ctx.fillStyle = "#000";
      ctx.fillText(username, 20, 660);

      // tags part
      const tagY1 = 660;

      const { width: usernameWidth, height: usernameHeight } = ctxMeasure(ctx, username + " ");
      ctx.font = `400 16px ${sansSerifFont}`;

      const tagLine1Parts = parseTextAsTags(ctx, tagLine1, 20 + usernameWidth);
      tagLine1Parts.forEach((part) => {
        ctx.fillStyle = part.color;
        ctx.fillText(part.text, part.posX, tagY1);
      });

      const tagY2 = tagY1 + usernameHeight + 4;
      const tagLine2Parts = parseTextAsTags(ctx, tagLine2, 20);
      tagLine2Parts.forEach((part) => {
        ctx.fillStyle = part.color;
        ctx.fillText(part.text, part.posX, tagY2);
      });

      // cygames logo
      const cygamesHeight = usernameHeight;
      const cygamesWidth = computeImgWidth(cygames, cygamesHeight);

      ctx.drawImage(
        iconCopyright,
        width - 20 - cygamesWidth - cygamesHeight,
        tagY2,
        cygamesHeight - 4,
        cygamesHeight - 4,
      );
      ctx.drawImage(cygames, width - 20 - cygamesWidth, tagY2, cygamesWidth, cygamesHeight);
    }

    async function runRenderCanvas() {
      try {
        setIsLoading(true);
        await renderCanvas();
      } finally {
        setIsLoading(false);
      }
    }

    runRenderCanvas();

    return () => {
      cancelled = true;
    };
  }, [
    seriesIndex,
    username,
    profileImg,
    profileBorderColor,
    profileZoomOffsetY,
    profileZoomAmount,
    tagLine1,
    tagLine2,
    likeCount,
    bgImgUrl,
    insertIndex,
    likesLang,
  ]);

  return (
    <div className="uma-card">
      <canvas ref={canvasRef} width={540} height={720}></canvas>
      <div className={`uma-card__loading ${isLoading ? "uma-card__loading--active" : ""}`}>
        <div className="uma-card__loading__spinner"></div>
      </div>
    </div>
  );
}
