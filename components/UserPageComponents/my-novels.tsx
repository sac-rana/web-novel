import { useContext, useState } from 'react';
import Collapsible from 'react-collapsible';
import { ProfileContext } from '../../pages/user';
import AddChapter from './add-chapter';

export default function MyNovels() {
  const {
    profile: { novels },
  } = useContext(ProfileContext);
  const [chapter, setChapter] = useState<{
    id: string;
    title: string;
    chapterNo: number;
  } | null>(null);

  if (novels.length == 0) return <p>No novels yet. Go to create novel</p>;

  // TODO: Add chapters created by author
  return (
    <div>
      {novels.map(novel => (
        <Collapsible key={novel.id} trigger={novel.title}>
          <p>Total no of chapters: {novel.noOfChapters}</p>
          <button
            className='mt-3 p-1 w-fit text-base bg-primary text-primary-text'
            onClick={() => {
              setChapter({
                id: novel.id,
                title: novel.title,
                chapterNo: novel.noOfChapters + 1,
              });
            }}
          >
            Add Chapter
          </button>
        </Collapsible>
      ))}
      {chapter && (
        <div>
          <button
            className='bg-secondary text-primary-text p-2 my-5'
            onClick={() => setChapter(null)}
          >
            Close
          </button>
          <AddChapter novel={chapter} />
        </div>
      )}
    </div>
  );
}
