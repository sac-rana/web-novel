export interface Novel {
  title: string;
  titleSlug: string;
  imgUrl: string;
}

export interface MyProfile {
  author_name: string;
  novels: { title_slug: string; title: string; no_of_chapters: number }[];
}
