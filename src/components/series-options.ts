import blank from "../assets/img/blank.png";
import cinderellaGray from "../assets/img/cinderella-gray.png";
import oguriCapInsert from "../assets/img/oguri-cap-insert.png";
import prettyDerby from "../assets/img/pretty-derby.png";
import sakuraLaurelInsert from "../assets/img/sakura-laurel-insert.png";
import starBlossom from "../assets/img/star-blossom.png";

export const seriesOptions = {
  cinderellagray: {
    label: "Cinderella Gray",
    image: cinderellaGray,
    targetWidth: 230,
    insert: oguriCapInsert,
    insertTargetWidth: 270,
    insertAlign: "right",
  },
  starblossom: {
    label: "Star Blossom",
    image: starBlossom,
    targetWidth: 260,
    insert: sakuraLaurelInsert,
    insertTargetWidth: 225,
    insertAlign: "left",
  },
  prettyderby: {
    label: "Pretty Derby",
    image: prettyDerby,
    targetWidth: 180,
    insert: "https://gametora.com/images/umamusume/characters/chara_stand_1001_100101.png",
    insertTargetWidth: 270,
    insertAlign: "right",
  },
  none: {
    label: "None",
    image: blank,
    targetWidth: 0,
    insert: blank,
    insertTargetWidth: 0,
    insertAlign: "right",
  },
} as const;
