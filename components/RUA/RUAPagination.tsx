import dynamic from 'next/dynamic';
import Link from 'next/link';

const Button = dynamic(() => import('components/RUA/Button'));

type Props = {
  hasPrev: boolean;
  hasNext: boolean;
  prevLink: string;
  nextLink: string;
  current?: number;
  total?: number;
};

const RUAPagination = ({
  hasPrev,
  hasNext,
  prevLink,
  nextLink,
  current,
  total,
}: Props) => {
  return (
    <>
      <nav>
        <ul className="flex items-center justify-between -space-x-px">
          <li>
            {hasPrev ? (
              <Link href={prevLink} passHref>
                <a>
                  <Button>Prev</Button>
                </a>
              </Link>
            ) : (
              <Button disabled>Prev</Button>
            )}
          </li>

          {current != null && total != null && (
            <li className="text-xl">
              <span>{current}</span>
              <span>/</span>
              <span>{total}</span>
            </li>
          )}

          <li>
            {hasNext ? (
              <Link href={nextLink} passHref>
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

export default RUAPagination;
