import { FC } from 'react';
import cn from 'classnames';
import { FiSearch } from 'react-icons/fi';

const SearchBox: FC = () => {
  return (
    <>
      <div className="relative">
        <FiSearch
          className={cn(
            'absolute z-10 w-[22px] h-[22px] text-gray-700',
            'left-4 top-[50%] transform-gpu translate-y-[-50%]'
          )}
        />
        <input
          type="text"
          placeholder="Search"
          className={cn(
            'w-full rounded-lg outline-none relative',
            'py-5 px-12 placeholder:font-semibold',
            'focus:px-5 focus:shadow-md focus:placeholder:font-normal',
            'duration-300 transition-all focus:z-20'
          )}
        />
        <div
          className={cn(
            'absolute z-10 border flex px-1 rounded',
            'text-gray-700 font-semibold',
            'right-4 top-[50%] transform-gpu translate-y-[-50%]'
          )}
        >
          <code>/</code>
        </div>
      </div>
    </>
  );
};

export default SearchBox;
