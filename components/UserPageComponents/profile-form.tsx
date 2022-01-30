import { User } from 'firebase/auth';
import { assert } from 'joi';
import Router from 'next/router';
import { useState, FormEventHandler } from 'react';
import { profileSchema } from '../../lib/utils';

export default function Form({ user }: { user: User }) {
  const [authorName, setAuthorName] = useState('');
  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();
    assert(authorName, profileSchema);
    const idToken = await user.getIdToken();
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + idToken,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        authorName,
      }),
    });
    if (!res.ok) throw new Error('Profile not created: ' + res.statusText);
  };

  return (
    <form onSubmit={handleSubmit} className='p-2'>
      <div>
        Please create a Author Name which will be displayed with your novel.
      </div>
      <section>
        <div className='mb-4 flex flex-col'>
          <label htmlFor='authorName' className='mb-2'>
            Author Name
          </label>
          <input
            type='text'
            name='authorName'
            id='authorName'
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
          />
        </div>
        <div className='flex justify-center'>
          <button className='w-full p-2 my-3 text-2xl bg-primary text-primary-text'>
            Submit
          </button>
        </div>
      </section>
    </form>
  );
}
