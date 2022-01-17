import { FC } from 'react';
import dynamic from 'next/dynamic';

const SearchBox = dynamic(() => import('components/info-bar/SearchBox'));

const InfoBar: FC = () => {
  return (
    <>
      <div>
        <SearchBox />
      </div>
    </>
  );
};

export default InfoBar;
