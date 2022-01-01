import { useState, useRef, FormEventHandler, useContext } from 'react';
import { uploadNovel } from '../lib/upload';
import styles from './styles/create-novel.module.scss';
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
    <form onSubmit={handleSubmit} className={styles.container}>
      <label htmlFor='title'>Name:</label>
      <input
        onChange={e => setTitle(e.target.value)}
        type='text'
        id='title'
        value={title}
      />
      <label htmlFor='img'>Image</label>
      <input
        type='file'
        name='img'
        id='img'
        accept='.jpg, .jpeg, .png, .webp, .avif'
        ref={imgRef}
      />
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
        <button>Create Novel</button>
      </div>
    </form>
  );
}
