import Link from 'next/link';
import Image from 'next/image';

export default function NovelCard({
  id,
  title,
  imgUrl,
}: {
  id: string;
  title: string;
  imgUrl: string;
}) {
  return (
    <div>
      <Link href={`/${id}`}>
        <a>
          <Image src={imgUrl} alt={title} layout='fill' />
          <h3>{title}</h3>
        </a>
      </Link>
    </div>
  );
}
