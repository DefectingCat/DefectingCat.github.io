'use client';

import clsx from 'clsx';
import Button from 'components/rua/button';

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  console.error(error);

  return (
    <html>
      <body
        className={clsx('w-full h-dvh flex', 'justify-center items-center')}
      >
        <div>
          <h2 className="text-xl mb-1">Something went wrong! ノ( OωOノ)</h2>
          <Button onClick={() => reset()} className="cursor-pointer">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
