import blank from "../assets/img/blank.png";
import cinderellaGray from "../assets/img/cinderella-gray.png";
import oguriCapInsert from "../assets/img/oguri-cap-insert.png";
import prettyDerby from "../assets/img/pretty-derby.png";
import sakuraLaurelInsert from "../assets/img/sakura-laurel-insert.png";
import starBlossom from "../assets/img/star-blossom.png";
import stampsList from "./stamps.json";

export const seriesOptions = [
  {
    label: "None",
    image: blank,
    width: 0,
  },
  {
    label: "Cinderella Gray",
    image: cinderellaGray,
    width: 230,
  },
  {
    label: "Star Blossom",
    image: starBlossom,
    width: 260,
  },
  {
    label: "Pretty Derby",
    image: prettyDerby,
    width: 180,
  },
] as const;

const withWsrv = (url: string) => {
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
};

const getUmaWikiStamp = (id: string, label: string, hasGlobal: boolean) => {
  const jpStamp = {
    image: withWsrv(`https://umamusu.wiki/w/thumb.php?f=${id}.png&width=240`),
    label,
    width: 200,
    align: "bottom-right",
  };

  if (!hasGlobal) {
    return [jpStamp];
  }

  const globalStamp = { ...jpStamp };
  globalStamp.image = globalStamp.image.replace(".png", "GL.png");
  return [jpStamp, globalStamp];
};

const processedStampsList = stampsList.flatMap((item, idx) => {
  if (!Array.isArray(item)) {
    return [];
  }

  return getUmaWikiStamp(String(100001 + idx), String(item.at(0)), Boolean(item[1]));
});

export const insertOptions = [
  {
    image: blank,
    label: "Empty",
    width: 1,
    align: "bottom-center",
  },
  {
    image: oguriCapInsert,
    label: "Oguri Cap",
    width: 250,
    align: "bottom-right",
  },
  {
    image: sakuraLaurelInsert,
    label: "Sakura Laurel",
    width: 205,
    align: "bottom-left",
  },

  ...processedStampsList,
] as const;
