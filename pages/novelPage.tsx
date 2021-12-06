import type { NextPage } from "next";
import styles from "../styles/NovelPage.module.scss";
import Header from "../components/header";
import { useState } from "react";
import { useRouter } from "next/router";

const NovelPage: NextPage = () => {
  const router = useRouter();
  const [chapList, setChapList] = useState(true);
  const [lastChapList, setLastChapList] = useState(false);
  const [authorNovelList, setAuthorNovelList] = useState(false);
  return (
    <div className={styles.container}>
      <Header />
      <main>
        <div>
          <div className={styles.novelTitle}>
            l dfdkfdkfdk d dkf dfd fdd d fdf dlkfd flkdfjdk f
          </div>
          <div className={styles.novelImg}>
            <img src='img1.jpg' alt='kdsf' />
          </div>
          <div className={styles.infoCard}>
            <div>
              <b> Name: </b>dl fjdklf d
            </div>
            <div>
              <b>Rating:</b> 5
            </div>
            <div>
              <b>author: </b>sdfds kf dkf
            </div>
            <div>
              <b> description:</b> Lorem ipsum dolor sit, amet consectetur
              adipisicing elit. Quisquam nemo voluptatibus velit aliquid, fugit
              magni perspiciatis eaque dolore inventore ab dolorem nulla
              laboriosam, eligendi, voluptates veritatis officiis dolor culpa
              corporis.
            </div>
          </div>
        </div>
        <div className={styles.chapterNav}>
          <div
            onClick={() => {
              setChapList(true);
              setLastChapList(false);
              setAuthorNovelList(false);
            }}
            className={styles[chapList + "cl"]}
          >
            Chapter List
          </div>
          <div
            onClick={() => {
              setChapList(false);
              setLastChapList(true);
              setAuthorNovelList(false);
            }}
            className={styles[lastChapList + "cl"]}
          >
            Latest Chapter
          </div>
          <div
            onClick={() => {
              setChapList(false);
              setLastChapList(false);
              setAuthorNovelList(true);
            }}
            className={styles[authorNovelList + "cl"]}
          >
            Authors other Novels
          </div>
        </div>
        <div className={styles.chapterNavContent}>
          {chapList ? (
            <ul>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
            </ul>
          ) : lastChapList ? (
            <ul>
              <li>chapter 1202</li>
              <li>chapter 1202</li>
              <li>chapter 1202</li>
              <li>chapter 1202</li>
              <li>chapter 1202</li>
            </ul>
          ) : (
            <ul>
              <li>NOvel names</li>
              <li>NOvel names</li>
              <li>NOvel names</li>
            </ul>
          )}
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default NovelPage;
