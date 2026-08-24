import cinderellaGray from "../assets/img/cinderella-gray.png";
import starBlossom from "../assets/img/star-blossom.png";
import prettyDerby from "../assets/img/pretty-derby.png";
import oguriCap from "../assets/img/oguri-cap.jpg";
import sakuraLaurel from "../assets/img/sakura-laurel.jpg";
import specialWeek from "../assets/img/special-week.jpg";
import oguriCapInsert from "../assets/img/oguri-cap-insert.png";
import sakuraLaurelInsert from "../assets/img/sakura-laurel-insert.png";

export const seriesOptions = {
  cinderellagray: {
    label: "Cinderella Gray",
    image: cinderellaGray,
    targetWidth: 230,
    username: "Oguri_Cap",
    borderColor: "#3A7AD2",
    profile: oguriCap,
    insert: oguriCapInsert,
    insertTargetWidth: 270,
    insertAlign: "right",
  },
  starblossom: {
    label: "Star Blossom",
    image: starBlossom,
    targetWidth: 260,
    username: "Sakura_Laurel",
    borderColor: "#f0638a",
    profile: sakuraLaurel,
    insert: sakuraLaurelInsert,
    insertTargetWidth: 225,
    insertAlign: "left",
  },
  prettyderby: {
    label: "Pretty Derby",
    image: prettyDerby,
    targetWidth: 180,
    username: "Special_Week",
    borderColor: "#EE6DCB",
    profile: specialWeek,
    insert: "https://gametora.com/images/umamusume/characters/chara_stand_1001_100101.png",
    insertTargetWidth: 270,
    insertAlign: "right",
  },
} as const;
