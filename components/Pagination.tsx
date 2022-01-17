import Link from 'next/link';
import { FC } from 'react';
import cn from 'classnames';
import dynamic from 'next/dynamic';

const Button = dynamic(() => import('components/RUA/RUAButton'));

interface Props {
  allPages: number;
  num?: string;
}

const Pagination: FC<Props> = ({ allPages, num }) => {
  const startIndex = Number(num);
  const nextPage = startIndex != allPages ? `/page/${startIndex + 1}` : '/';
  const prevPage = startIndex > 2 ? `/page/${startIndex - 1}` : '/';

  return (
    <>
      <div className="flex items-center text-gray-600 justify-between text-lg font-semibold">
        {startIndex > 1 && (
          <Link href={prevPage} passHref>
            <a>
              <Button>上一页</Button>
            </a>
          </Link>
        )}

        <span>
          {num} / {allPages}
        </span>

        {startIndex !== allPages && (
          <Link href={nextPage} passHref>
            <a>
              <Button>下一页</Button>
            </a>
          </Link>
        )}
      </div>
    </>
  );
};

export default Pagination;
