import Link from 'next/link';
import { FC } from 'react';

const HeadBar: FC = () => {
  return (
    <>
      <header className="flex justify-between max-w-6xl px-6 py-6 mx-auto">
        <Link href="/">RUARUARUA</Link>

        <div></div>
      </header>
    </>
  );
};

export default HeadBar;
