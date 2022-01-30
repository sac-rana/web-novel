export interface Novel {
  id: string;
  title: string;
  imgUrl: string;
}

export interface MyProfile {
  authorName: string;
  novels: { id: string; title: string; noOfChapters: number }[];
}

export interface Chapter {
  number: number;
  content: string;
}
