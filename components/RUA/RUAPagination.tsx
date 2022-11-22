import dynamic from 'next/dynamic';
import Link from 'next/link';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

const Button = dynamic(() => import('components/RUA/Button'));

type Props = {
  hasPrev: boolean;
  hasNext: boolean;
  prevLink: string;
  nextLink: string;
  current?: number;
  total?: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

const RUAPagination = ({
  hasPrev,
  hasNext,
  prevLink,
  nextLink,
  current,
  total,
  ...rest
}: Props) => {
  return (
    <>
      <nav {...rest}>
        <ul className="flex items-center justify-between -space-x-px">
          <li>
            {hasPrev ? (
              <Link href={prevLink}>
                <Button>Prev</Button>
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
              <Link href={nextLink}>
                <Button>Next</Button>
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
