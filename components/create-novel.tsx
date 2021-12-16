import { useState, useRef, FormEventHandler, useEffect } from 'react';
import { uploadNovel } from '../lib/uploadNovel';
import styles from './styles/create-novel.module.scss';
import slugify from 'slugify';

export default function CreateNovel() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const imgRef = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler = async e => {
    //TODO: Add data validation
    e.preventDefault();
    const imgFile = imgRef.current?.files?.item(0);
    if (!imgFile) return;
    const slugifiedTitle = slugify(title);
    if (slugifiedTitle.trim() === '') return;
    await uploadNovel(slugifiedTitle, {
      description,
      title,
      image: imgFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <label htmlFor='title'>Name:</label>
      <input
        onChange={e => setTitle(e.target.value)}
        type='text'
        id='title'
        value={title}
      />
      <label htmlFor='img'>Image</label>
      <input type='file' name='img' id='img' accept='image/*' ref={imgRef} />
      <label htmlFor='description'>Description:</label>
      <textarea
        onChange={e => setDescription(e.target.value)}
        name='des'
        id='des'
        value={description}
      ></textarea>
      {/*TODO: Add genres to novels */}
      {/* <label htmlFor='genres'>Genres:</label>
                <select name='genres' id='genres' multiple>
                <option value='Adventure'>Adventure</option>
                <option value='Isekai'>Isekai</option>
                <option value='Romance'>Romance</option>
                <option value='Action'>Action</option>
                <option value='Fantasy'>Fantasy</option>
              </select> */}
      <div className={styles.button}>
        <button type='submit'>Create Novel</button>
      </div>
    </form>
  );
}
