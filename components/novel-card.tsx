import Link from 'next/link';
import Image from 'next/image';
import { ImageDimensions } from '../lib/utils';
import { Novel } from '../lib/types';

export default function NovelCard({ novel }: { novel: Novel }) {
  const { title, titleSlug, imgUrl } = novel;
  return (
    <Link href={`/${titleSlug}`}>
      <a>
        <figure>
          <Image
            src={imgUrl}
            alt={title}
            layout='responsive'
            width={ImageDimensions.WIDTH}
            height={ImageDimensions.HEIGHT}
          />
          <figcaption>
            <h3 className='text-center'>{title}</h3>
          </figcaption>
        </figure>
      </a>
    </Link>
  );
}
