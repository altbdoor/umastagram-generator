import { useEffect, useRef } from "react";
import iconBunnySvg from "../assets/img/bunny-heart.svg";
import iconCommentSvg from "../assets/img/comment-dots.svg";
import cygamesSvg from "../assets/img/cygames.svg";
import iconEnvelopeSvg from "../assets/img/envelope.svg";
import { seriesOptions } from "./series-options";

const intFormatter = new Intl.NumberFormat("en-US");

const serifFont = [
  `system-ui, -apple-system`,
  `'Meiryo', 'Hiragino Kaku Gothic ProN'`,
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

const computeHeight = (img: HTMLImageElement, width: number) => {
  return (width / img.naturalWidth) * img.naturalHeight;
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

      await document.fonts.load('400 italic 54px "indigo_daisy"');
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
      canvas.height = 760 * scale;
      canvas.style.width = "100%";
      canvas.style.height = "auto";

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#f8f8f7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // header title
      ctx.font = '400 italic 54px "indigo_daisy"';
      ctx.fillStyle = "#000";
      ctx.fillText("Umastagram", 8, 50);

      // header border
      ctx.fillStyle = "#bbb";
      ctx.fillRect(0, 70, 540, 2);

      // series logo
      ctx.drawImage(
        seriesImg,
        width - currentSeries.targetWidth,
        2,
        currentSeries.targetWidth - 4,
        computeHeight(seriesImg, currentSeries.targetWidth),
      );

      // profile pic
      const beginProfilePicArc = () => {
        ctx.beginPath();
        ctx.arc(51, 113, 31, 0, Math.PI * 2);
      };

      ctx.save();
      beginProfilePicArc();
      ctx.fillStyle = "#fff";
      ctx.fill();

      beginProfilePicArc();
      ctx.clip();
      ctx.drawImage(profileImg, 20, 82, 62, 62);

      // profile pic border
      beginProfilePicArc();
      ctx.lineWidth = 2;
      ctx.strokeStyle = currentSeries.borderColor;
      ctx.stroke();
      ctx.restore();

      // profile name
      ctx.font = `700 20px ${serifFont}`;
      ctx.fillStyle = "#000";
      ctx.fillText(currentSeries.username, 94, 120);

      // image box container
      const imageBoxX = 20;
      const imageBoxY = 156;
      const imageBoxW = width - 40;
      const imageBoxH = 470;

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

      const insertImgHeight = computeHeight(insertImg, currentSeries.insertTargetWidth);

      ctx.drawImage(
        insertImg,
        currentSeries.insertAlign === "left" ? 20 : width - 20 - currentSeries.insertTargetWidth,
        156 + 470 - insertImgHeight,
        currentSeries.insertTargetWidth,
        insertImgHeight,
      );

      ctx.restore();

      // icons
      ctx.drawImage(iconBunny, 23, 633, 54, 54);
      ctx.drawImage(iconComment, 440, 633, 38, 38);
      ctx.drawImage(iconEnvelope, 488, 633, 36, 36);

      // like count text
      ctx.font = `400 20px ${serifFont}`;
      ctx.fillStyle = "#fd9d9c";
      ctx.fillText(`${intFormatter.format(likeCount)} likes!`, 84, 671);

      // username text again
      ctx.font = `400 16px ${serifFont}`;
      ctx.fillStyle = "#000";
      ctx.fillText(currentSeries.username, 20, 702);

      // tags part
      const usernameWidth = ctx.measureText(currentSeries.username + " ").width;
      ctx.font = `400 16px ${serifFont}`;
      ctx.fillStyle = "#3257B5";
      ctx.fillText(tagLine1, 20 + usernameWidth, 702);
      ctx.fillText(tagLine2, 20, 722);

      // footer text
      ctx.font = `700 12px ${serifFont}`;
      ctx.fillStyle = "#000";
      ctx.fillText("©", 20, 744);

      const copyRightWidth = ctx.measureText("© ").width;
      ctx.drawImage(cygames, 20 + copyRightWidth, 734, 57, computeHeight(cygames, 57));
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
