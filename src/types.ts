// uma interface for umapyoi character list data
// https://umapyoi.net/docs/character.html
export interface Uma {
  birth_day?: number | null;
  birth_month?: number | null;
  category_label: string;
  category_label_en: string;
  category_value: string;
  color_main: string;
  color_sub: string;
  date_gmt: string;
  detail_img_pc?: string | null;
  detail_img_sp?: string | null;
  ears_fact?: string | null;
  family_fact?: string | null;
  game_id?: number | null;
  grade?: string | null;
  height?: number | null;
  id: number;
  link: string;
  modified_gmt: string;
  name_en: string;
  name_en_internal: string;
  name_jp: string;
  preferred_url: string;
  profile?: string | null;
  residence?: string | null;
  row_number: number;
  shoe_size?: string | null;
  site_idx: number;
  size_b?: number | null;
  size_h?: number | null;
  size_w?: number | null;
  slogan?: string | null;
  sns_header: string;
  sns_icon: string;
  strengths?: string | null;
  tail_fact?: string | null;
  thumb_img: string;
  voice?: string | null;
  weaknesses?: string | null;
  weight?: string | null;
}
