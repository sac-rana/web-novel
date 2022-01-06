import { useState, useRef, FormEventHandler, useContext } from 'react';
import { uploadNovel } from '../lib/upload';
import { UserContext } from '../pages/_app';

export default function CreateNovel() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const imgRef = useRef<HTMLInputElement>(null);

  const { user, profileInfo } = useContext(UserContext);

  const handleSubmit: FormEventHandler = async e => {
    //TODO: Add data validation
    e.preventDefault();
    const imgFile = imgRef.current?.files?.item(0);
    if (!imgFile) return;
    await uploadNovel({
      title,
      description,
      image: imgFile,
      authorId: user!.uid,
      authorName: profileInfo!.authorName,
    });
    document.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className='p-2'>
      <div className='mb-4 flex flex-col'>
        <label htmlFor='title' className='mb-2'>
          Name
        </label>
        <input
          className='mb-2'
          onChange={e => setTitle(e.target.value)}
          type='text'
          name='title'
          id='title'
          value={title}
        />
      </div>
      <div className='mb-4 flex flex-col'>
        <label htmlFor='imgFile' className='mb-2'>
          Image
        </label>
        <input
          className='col-span-7'
          type='file'
          name='imgFile'
          id='imgFile'
          accept='.jpg, .jpeg, .png, .webp, .avif'
          ref={imgRef}
        />
      </div>
      <div className='mb-4 flex flex-col'>
        <label htmlFor='description' className='mb-2'>
          Description
        </label>
        <textarea
          className='col-span-10'
          onChange={e => setDescription(e.target.value)}
          name='description'
          id='description'
          value={description}
          rows={10}
        ></textarea>
      </div>
      {/*TODO: Add genres to novels */}
      {/* <label htmlFor='genres'>Genres:</label>
                <select name='genres' id='genres' multiple>
                <option value='Adventure'>Adventure</option>
                <option value='Isekai'>Isekai</option>
                <option value='Romance'>Romance</option>
                <option value='Action'>Action</option>
                <option value='Fantasy'>Fantasy</option>
              </select> */}
      <div className='flex justify-center'>
        <button className='w-full p-2 my-3 text-2xl bg-primary text-primary-text'>
          Create Novel
        </button>
      </div>
    </form>
  );
}
