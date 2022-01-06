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
import { Collection } from '../lib/utils';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import Collapsible from 'react-collapsible';

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
    <div>
      {novels.map(novel => (
        <Collapsible key={novel.id} trigger={novel.title}>
          {novel.chapters.map((chapter: any) => (
            <p key={chapter.chapterNo}>Chapter: {chapter.chapterNo}</p>
          ))}
          <button
            className='mt-3 p-1 w-fit text-base bg-primary text-primary-text'
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
        <form onSubmit={addChapter} className='my-4 mx-2'>
          <div className='mb-2 text-lg'>Novel title: {novelTitle}</div>
          <div className='flex flex-col mb-4'>
            <label className='mb-2 text-lg' htmlFor='chapterNo'>
              Chapter no:
            </label>
            <input
              className='p-1'
              type='text'
              name='chapterNo'
              id='chapterNo'
              value={chapterNo}
              onChange={e => setChapterNo(e.target.value)}
            />
          </div>
          <div className='flex flex-col mb-4'>
            <label className='mb-2 text-lg' htmlFor='chapterContent'>
              Chapter Content:
            </label>
            <textarea
              className='p-1'
              name='chapterContent'
              id='chapterContent'
              onChange={e => setChapterContent(e.target.value)}
              rows={10}
            ></textarea>
          </div>
          <div className='flex justify-around'>
            <button
              className='p-1 w-20 text-lg bg-primary text-primary-text'
              type='reset'
              onClick={() => setShowAddChapter(false)}
            >
              Close
            </button>
            <button
              className='p-1 w-20 text-lg bg-primary text-primary-text'
              type='submit'
            >
              Add
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
