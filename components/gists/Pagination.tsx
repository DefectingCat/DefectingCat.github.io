import { pageSize } from 'lib/fetcher';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Button = dynamic(() => import('components/RUA/Button'));

type Props = {
  pageSize: pageSize;
};

const Pagination = ({ pageSize }: Props) => {
  const prev = Number(pageSize.prev);
  const next = Number(pageSize.next);

  return (
    <>
      <nav>
        <ul className="flex justify-between -space-x-px">
          <li>
            {!!prev ? (
              <Link href={prev === 1 ? `/gists/` : `/gists/${prev}`} passHref>
                <a>
                  <Button>Prev</Button>
                </a>
              </Link>
            ) : (
              <Button disabled>Prev</Button>
            )}
          </li>

          <li>
            {!!next ? (
              <Link href={`/gists/${next}`} passHref>
                <a>
                  <Button>Next</Button>
                </a>
              </Link>
            ) : (
              <Button disabled>Next</Button>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Pagination;
