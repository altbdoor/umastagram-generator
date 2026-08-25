// uma interface for umapyoi character list data
export interface Uma {
  id: number;
  name_en: string;
  name_jp: string;
  color_main: string;
  images: string[];
}

export interface FlatUma {
  id: number;
  name_en: string;
  name_jp: string;
  color_main: string;
  image: string;
}
