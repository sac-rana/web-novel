import {
  DocumentSnapshot,
  FieldValue,
  SnapshotOptions,
} from 'firebase/firestore';

export interface ProfileInfo {
  id: string;
  authorName: string;
}

export interface Chapter {
  chapterNo: string;
  chapterContent: string;
}

export class FirebaseNovel {
  constructor(
    public title: string,
    public description: string,
    public imgUrl: string,
    public authorId: string,
    public authorName: string,
    public chapters: Chapter[],
    public createdAt: FieldValue,
    public lastModified: FieldValue,
  ) {}
}

export const firebaseNovelConvertor = {
  toFirestore: (novel: FirebaseNovel) => {
    return {
      title: novel.title,
      description: novel.description,
      imgUrl: novel.imgUrl,
      authorId: novel.authorId,
      authorName: novel.authorName,
      chapters: novel.chapters,
      createdAt: novel.createdAt,
      lastModified: novel.lastModified,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    if (!data) return null;
    return new FirebaseNovel(
      data.title,
      data.description,
      data.imgUrl,
      data.authorId,
      data.authorName,
      data.chapters,
      data.createdAt,
      data.lastModified,
    );
  },
};

export class Novel {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imgUrl: string,
    public authorId: string,
    public authorName: string,
    public chapters: Chapter[],
    public createdAt: { seconds: number; nanoseconds: number },
    public lastModified: { seconds: number; nanoseconds: number },
  ) {}
}
