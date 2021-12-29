import { FormEventHandler, useContext, useState } from 'react';
import { firestore } from '../lib/firebase';
import { UserContext } from '../pages/_app';
import {
  arrayUnion,
  collection,
  doc,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Collection } from '../lib/constants';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import Collapsible from 'react-collapsible';
import styles from './styles/my-novels.module.scss';

export default function MyNovels() {
  const { profileInfo } = useContext(UserContext);
  const q = query(
    collection(firestore, Collection.NOVELS),
    where('authorId', '==', profileInfo!.id),
  );

  const [novels, loading, error] = useCollectionDataOnce(q, { idField: 'id' });
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [novelTitle, setNovelTitle] = useState('');
  const [chapterNo, setChapterNo] = useState('0');
  const [novelId, setNovelId] = useState('');
  const [chapterContent, setChapterContent] = useState('');

  if (loading) return <h2>Loading...</h2>;
  if (!novels) return <h2>Error</h2>;
  if (novels.length == 0) return <p>No novels yet. Go to create novel</p>;

  const addChapter: FormEventHandler = async e => {
    e.preventDefault();
    await updateDoc(doc(firestore, Collection.NOVELS, novelId), {
      lastModified: serverTimestamp(),
      chapters: arrayUnion({ chapterNo, chapterContent }),
    });
    document.location.reload();
  };

  return (
    <div className={styles.novelList}>
      {novels.map(novel => (
        <Collapsible key={novel.id} trigger={novel.title}>
          {novel.chapters.map((chapter: any) => (
            <p key={chapter.chapterNo}>Chapter: {chapter.chapterNo}</p>
          ))}
          <button
            onClick={() => {
              setNovelId(novel.id);
              setShowAddChapter(true);
              setNovelTitle(novel.title);
              setChapterNo(
                novel.chapters.length == 0
                  ? '1'
                  : String(
                      Math.floor(Number(novel.chapters.at(-1).chapterNo)) + 1,
                    ),
              );
            }}
          >
            Add Chapter
          </button>
        </Collapsible>
      ))}
      {showAddChapter ? (
        <form className={styles.formAddChapter} onSubmit={addChapter}>
          <p>
            <button onClick={() => setShowAddChapter(false)}>Close</button>
          </p>
          <p>Novel title:</p>
          <p> {novelTitle}</p>
          <label htmlFor='chapterNo'>Chapter no: </label>
          <input
            type='text'
            name='chapterNo'
            id='chapterNo'
            value={chapterNo}
            onChange={e => setChapterNo(e.target.value)}
          />
          <label htmlFor='chapterContent'>Chapter Content: </label>
          <textarea
            name='chapterContent'
            id='chapterContent'
            onChange={e => setChapterContent(e.target.value)}
          ></textarea>
          <button type='submit'>Add</button>
        </form>
      ) : null}
    </div>
  );
}
