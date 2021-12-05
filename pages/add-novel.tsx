import styles from '../styles/CreateNovel.module.scss';
import Header from '../components/header';
import type { NextPage } from 'next';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { uploadNovel } from '../lib/uploadNovel';

const AddNovel: NextPage = () => {
  //TODO: add genres to novel
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const imgRef = useRef<HTMLInputElement>(null);
  const [myNovels, setMyNovels] = useState(false);
  const [createNovel, setCreateNovel] = useState(true);

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();
    const imgFile = imgRef.current?.files?.item(0);
    if (!imgFile) return;
    await uploadNovel({
      authorName: 'Sachin',
      description,
      title,
      image: imgFile,
    });
  };
  return (
    <div className={styles.container}>
      <Header />
      <main>
        <div className={styles.nav}>
          <div
            onClick={() => {
              setMyNovels(true);
              setCreateNovel(false);
            }}
            className={styles[myNovels + 'cl']}
          >
            My Novels
          </div>
          <div
            onClick={() => {
              setMyNovels(false);
              setCreateNovel(true);
            }}
            className={styles[createNovel + 'cl']}
          >
            Create Novel
          </div>
        </div>
        <div className={styles.navContent}>
          {createNovel ? (
            <form onSubmit={handleSubmit}>
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
                accept='image/*'
                ref={imgRef}
              />
              <label htmlFor='description'>Description:</label>
              <textarea
                onChange={e => setDescription(e.target.value)}
                name='des'
                id='des'
                value={description}
              ></textarea>
              {/* <label htmlFor='genres'>Genres:</label>
                <select name='genres' id='genres' multiple>
                <option value='Adventure'>Adventure</option>
                <option value='Isekai'>Isekai</option>
                <option value='Romance'>Romance</option>
                <option value='Action'>Action</option>
                <option value='Fantasy'>Fantasy</option>
              </select> */}
              <button type='submit'>Create Novel</button>
            </form>
          ) : myNovels ? (
            <div>My NOvELS</div>
          ) : null}
        </div>
      </main>
    </div>
  );
};
export default AddNovel;
