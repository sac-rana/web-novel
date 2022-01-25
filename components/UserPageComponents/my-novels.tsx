import { useContext, useState } from 'react';
import Collapsible from 'react-collapsible';
import { ProfileContext } from '../../pages/user';
import AddChapter from '../add-chapter';

export default function MyNovels() {
  const {
    profile: { novels },
  } = useContext(ProfileContext);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [currentChapterNo, setCurrentChapterNo] = useState<number>(0);
  const [currentNovel, setCurrentNovel] = useState({ id: '', title: '' });

  if (novels.length == 0) return <p>No novels yet. Go to create novel</p>;

  // TODO: Add chapters created by author
  return (
    <div>
      {novels.map(novel => (
        <Collapsible key={novel.title_slug} trigger={novel.title}>
          <button
            className='mt-3 p-1 w-fit text-base bg-primary text-primary-text'
            onClick={() => {
              setShowAddChapter(true);
            }}
          >
            Add Chapter
          </button>
        </Collapsible>
      ))}
      {showAddChapter ? (
        <AddChapter
          chapterNo={currentChapterNo}
          novel={currentNovel}
          close={() => setShowAddChapter(false)}
        />
      ) : null}
    </div>
  );
}
