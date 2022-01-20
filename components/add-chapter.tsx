import { FormEventHandler, useState } from 'react';

export default function AddChapter({
  chapterNo,
  novel,
  close,
}: {
  chapterNo: number;
  novel: { id: string; title: string };
  close: Function;
}) {
  const [chapterContent, setChapterContent] = useState('');

  const addChapter: FormEventHandler = async e => {
    e.preventDefault();

    document.location.reload();
  };

  return (
    <form onSubmit={addChapter} className='my-4 mx-2'>
      <div className='mb-2 text-lg'>Novel title: {novel.title}</div>
      <div className='flex flex-col mb-4'>
        <p>Chapter no: {chapterNo}</p>
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
          onClick={() => close()}
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
  );
}
