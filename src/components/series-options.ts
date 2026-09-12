import blank from "../assets/img/blank.png";
import cinderellaGray from "../assets/img/cinderella-gray.png";
import oguriCapInsert from "../assets/img/oguri-cap-insert.png";
import prettyDerby from "../assets/img/pretty-derby.png";
import sakuraLaurelInsert from "../assets/img/sakura-laurel-insert.png";
import starBlossom from "../assets/img/star-blossom.png";

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
    width: 270,
    align: "bottom-right",
  },
  {
    image: sakuraLaurelInsert,
    label: "Sakura Laurel",
    width: 225,
    align: "bottom-left",
  },
] as const;

export const seriesOptions = [
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
  {
    label: "None",
    image: blank,
    width: 0,
  },
] as const;
