import { FormEventHandler, useState } from 'react';
import Router from 'next/router';

export default function AddChapter({
  novel: { titleSlug, title, chapterNo },
}: {
  novel: { titleSlug: string; title: string; chapterNo: number };
}) {
  const [chapterContent, setChapterContent] = useState('');

  const addChapter: FormEventHandler = async e => {
    e.preventDefault();
    await fetch('/api/add-chapter', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        titleSlug,
        chapterContent,
      }),
    });
    Router.reload();
  };

  return (
    <form onSubmit={addChapter} className='my-4 mx-2'>
      <div className='mb-2 text-lg'>Novel title: {title}</div>
      <div className='flex flex-col mb-4'>Chapter no: {chapterNo}</div>
      <div className='flex flex-col mb-4'>
        <label className='mb-2 text-lg' htmlFor='chapterContent'>
          Chapter Content:
        </label>
        <textarea
          className='p-1'
          id='chapterContent'
          onChange={e => setChapterContent(e.target.value)}
          rows={10}
        ></textarea>
      </div>
      <div className='flex justify-around'>
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
