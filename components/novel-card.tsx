import styles from './styles/novelCard.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export default function NovelCard({
  key,
  title,
  image,
}: {
  key: string;
  title: string;
  image: string;
}) {
  return (
    <div className={styles.card}>
      <Link href={`/${key}`}>
        <a>
          <Image src={image} alt={title} />
        </a>
      </Link>
      <Link href={`/${key}`}>
        <a>
          <h3>{title}</h3>
        </a>
      </Link>
    </div>
  );
}
