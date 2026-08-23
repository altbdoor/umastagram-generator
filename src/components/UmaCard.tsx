import { useEffect, useRef } from "react";
import iconBunnySvg from "../assets/img/bunny-heart.svg";
import iconCommentSvg from "../assets/img/comment-dots.svg";
import cygamesSvg from "../assets/img/cygames.svg";
import iconEnvelopeSvg from "../assets/img/envelope.svg";
import { seriesOptions } from "./series-options";

const intFormatter = new Intl.NumberFormat("en-US");

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
    img.src = path;
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
    height: dimension.actualBoundingBoxAscent + dimension.actualBoundingBoxDescent,
  };
};

export interface UmaCardProps {
  series: keyof typeof seriesOptions;
  likeCount: number;
  tagLine1: string;
  tagLine2: string;
  bgImageUrl: string;
}

export function UmaCard({ series, tagLine1, tagLine2, likeCount, bgImageUrl }: UmaCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderCanvas() {
      if (cancelled || !canvasRef.current) {
        return;
      }

      await Promise.all([
        document.fonts.load('400 italic 45px "indigo_daisy"'),
        document.fonts.load('400 20px "Inter Tight"'),
        document.fonts.load('700 20px "Inter Tight"'),
      ]);
      const currentSeries = seriesOptions[series];

      // all images should be preloaded to not disrupt canvas drawing
      const [
        seriesImg,
        profileImg,
        insertImg,
        iconBunny,
        iconComment,
        iconEnvelope,
        cygames,
        bgImg,
      ] = await Promise.all([
        loadImage(currentSeries.image),
        loadImage(currentSeries.profile),
        loadImage(currentSeries.insert),
        loadImage(iconBunnySvg),
        loadImage(iconCommentSvg),
        loadImage(iconEnvelopeSvg),
        loadImage(cygamesSvg),
        bgImageUrl ? loadImage(bgImageUrl) : null,
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
        width - currentSeries.targetWidth,
        2,
        currentSeries.targetWidth - 4,
        computeImgHeight(seriesImg, currentSeries.targetWidth),
      );

      // profile pic
      const profilePicX = 20;
      const profilePicY = 69;
      const profilePicSize = 60;

      const beginProfilePicArc = () => {
        ctx.beginPath();
        ctx.arc(
          profilePicX + profilePicSize / 2,
          profilePicY + profilePicSize / 2,
          profilePicSize / 2,
          0,
          Math.PI * 2,
        );
      };

      ctx.save();
      beginProfilePicArc();
      ctx.fillStyle = "#fff";
      ctx.fill();

      beginProfilePicArc();
      ctx.clip();
      ctx.drawImage(profileImg, profilePicX, profilePicY, profilePicSize, profilePicSize);

      // profile pic border
      beginProfilePicArc();
      ctx.lineWidth = 2;
      ctx.strokeStyle = currentSeries.borderColor;
      ctx.stroke();
      ctx.restore();

      // profile name
      ctx.font = `700 20px ${sansSerifFont}`;
      ctx.fillStyle = "#000";
      const { height: profileNameHeight } = ctxMeasure(ctx, "");
      ctx.fillText(
        currentSeries.username,
        94,
        profilePicY + profilePicSize / 2 - profileNameHeight / 2,
      );

      // image box container
      const imageBoxX = 20;
      const imageBoxY = 137;
      const imageBoxW = width - 40;
      const imageBoxH = 460;

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#fff";
      ctx.fillRect(imageBoxX, imageBoxY, imageBoxW, imageBoxH);
      ctx.restore();

      // image box clip
      ctx.save();
      ctx.beginPath();
      ctx.rect(imageBoxX, imageBoxY, imageBoxW, imageBoxH);
      ctx.clip();

      if (bgImg) {
        const bgImgScale = Math.max(
          imageBoxW / bgImg.naturalWidth,
          imageBoxH / bgImg.naturalHeight,
        );

        const imageWidth = bgImg.naturalWidth * bgImgScale;
        const imageHeight = bgImg.naturalHeight * bgImgScale;

        const imageX = imageBoxX + (imageBoxW - imageWidth) / 2;
        const imageY = imageBoxY + (imageBoxH - imageHeight) / 2;

        ctx.drawImage(bgImg, imageX, imageY, imageWidth, imageHeight);
      }

      const insertImgHeight = computeImgHeight(insertImg, currentSeries.insertTargetWidth);

      ctx.drawImage(
        insertImg,
        currentSeries.insertAlign === "left" ? 20 : width - 20 - currentSeries.insertTargetWidth,
        imageBoxY + imageBoxH - insertImgHeight,
        currentSeries.insertTargetWidth,
        insertImgHeight,
      );

      ctx.restore();

      // icons
      const iconY = 605;
      ctx.drawImage(iconBunny, 23, iconY, 54, 54);
      ctx.drawImage(iconComment, 440, iconY, 38, 38);
      ctx.drawImage(iconEnvelope, 488, iconY, 36, 36);

      // like count text
      ctx.font = `400 20px ${sansSerifFont}`;
      ctx.fillStyle = "#fd9d9c";
      const { height: likeCountHeight } = ctxMeasure(ctx, "");
      ctx.fillText(
        `${intFormatter.format(likeCount)} likes!`,
        78,
        iconY + 54 / 2 - likeCountHeight / 2,
      );

      // username text again
      ctx.font = `400 16px ${sansSerifFont}`;
      ctx.fillStyle = "#000";
      ctx.fillText(currentSeries.username, 20, 660);

      // tags part
      const tagY1 = 660;

      ctx.font = `400 16px ${sansSerifFont}`;
      ctx.fillStyle = "#3257B5";
      const { width: usernameWidth, height: usernameHeight } = ctxMeasure(
        ctx,
        currentSeries.username + " ",
      );

      ctx.fillText(tagLine1, 20 + usernameWidth, tagY1);
      const tagY2 = tagY1 + usernameHeight + 8;
      ctx.fillText(tagLine2, 20, tagY2);

      // cygames logo
      const cygamesHeight = usernameHeight + 2;
      const cygamesWidth = computeImgWidth(cygames, cygamesHeight);

      ctx.font = `700 16px ${sansSerifFont}`;
      ctx.fillStyle = "#000";
      const { width: copyRightWidth } = ctxMeasure(ctx, "© ");
      ctx.fillText("©", width - 20 - copyRightWidth - cygamesWidth, tagY2);

      ctx.drawImage(cygames, width - 20 - cygamesWidth, tagY2, cygamesWidth, cygamesHeight);
    }

    renderCanvas();

    return () => {
      cancelled = true;
    };
  }, [series, tagLine1, tagLine2, likeCount, bgImageUrl]);

  return (
    <div className="uma-card">
      <canvas ref={canvasRef} className="uma-card__canvas" width={540}></canvas>
    </div>
  );
}
