import { Chapter } from '../lib/types';
export default function ChapterComponent({
  currentChapterIndex,
  chapter,
  maxChapters,
  setCurrentChapterIndex,
}: {
  currentChapterIndex: number;
  chapter: Chapter;
  maxChapters: number;
  setCurrentChapterIndex: Function;
}) {
  return (
    <div>
      <nav>
        <button onClick={() => setCurrentChapterIndex(undefined)}>
          <h3>Back to novel</h3>
        </button>
      </nav>
      <nav>
        <button
          disabled={currentChapterIndex == 0}
          onClick={() => setCurrentChapterIndex(currentChapterIndex - 1)}
        >
          Prev
        </button>
        {/* TODO: Add this button and its working
       <button>Contents</button> */}
        <button
          disabled={currentChapterIndex == maxChapters - 1}
          onClick={() => setCurrentChapterIndex(currentChapterIndex + 1)}
        >
          Next
        </button>
      </nav>
      <section>
        <p>Chapter: {chapter.chapterNo}</p>
        <pre>{chapter.chapterContent}</pre>
      </section>
    </div>
  );
}
