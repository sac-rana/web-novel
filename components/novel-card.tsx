import Link from 'next/link';

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
          <img src={imgUrl} alt={title} />
          <h3>{title}</h3>
        </a>
      </Link>
    </div>
  );
}
