import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Chapter() {
  const router = useRouter();
  const { titleSlug, chapterNo } = router.query;
  const [content, setContent] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/chapter?id=${titleSlug}&chapterNo=${chapterNo}`,
        {
          method: 'GET',
        },
      );
      const chapterContent = await res.text();
      setContent(chapterContent);
    };
    fetchData();
  }, [titleSlug, chapterNo]);
  return (
    <div>
      <nav>
        <Link href={`/${titleSlug}`}>
          <a className='block'>Back to novel</a>
        </Link>
      </nav>
      <nav>
        <Link href={`/${titleSlug}/${parseInt(chapterNo as string) - 1}`}>
          <a>Prev</a>
        </Link>
        {/* TODO: Add this button and its working
       <button>Contents</button> */}
        <Link href={`/${titleSlug}/${parseInt(chapterNo as string) + 1}`}>
          <a>Next</a>
        </Link>
      </nav>
      <section>
        <p>Chapter: {chapterNo}</p>
        <pre>{content}</pre>
      </section>
      <nav>
        <Link href={`/${titleSlug}/${parseInt(chapterNo as string) - 1}`}>
          <a>Prev</a>
        </Link>
        {/* TODO: Add this button and its working
       <button>Contents</button> */}
        <Link href={`/${titleSlug}/${parseInt(chapterNo as string) + 1}`}>
          <a>Next</a>
        </Link>
      </nav>
    </div>
  );
}
