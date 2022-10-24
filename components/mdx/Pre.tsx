import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, lazy, Suspense } from 'react';

const CopyButton = lazy(() => import('components/post/CopyButton'));

type Props = {} & DetailedHTMLProps<
  HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>;

const Pre = ({ ...rest }: Props) => {
  const { children, className, ...props } = rest;

  return (
    <>
      <pre className={classNames(className, 'relative group')} {...props}>
        {children}
        <Suspense fallback>
          <CopyButton />
        </Suspense>
      </pre>
    </>
  );
};

export default Pre;
