import Link from 'next/link';
import Image from 'next/image';
import { ImageDimensions } from '../lib/utils';

export default function NovelCard({
  title,
  titleSlug,
  imgUrl,
}: {
  title: string;
  titleSlug: string;
  imgUrl: string;
}) {
  return (
    <div>
      <Link href={`/${titleSlug}`}>
        <a className='block'>
          <Image
            src={imgUrl}
            alt={title}
            layout='responsive'
            width={ImageDimensions.WIDTH}
            height={ImageDimensions.HEIGHT}
          />
          <h3 className='text-center'>{title}</h3>
        </a>
      </Link>
    </div>
  );
}
