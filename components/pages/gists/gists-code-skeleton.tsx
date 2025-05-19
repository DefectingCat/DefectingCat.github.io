import clsx from 'clsx';
import { memo } from 'react';
import styles from './gists-code.module.css';

const bodyClass = clsx(
  'rounded-lg',
  'h-4 bg-gray-300',
  'mb-2 last:mb-0 animate-pulse',
  'dark:bg-rua-gray-600',
);
const allLength = [
  500, 400, 300, 200, 332, 402, 105, 399, 501, 285, 378, 123, 325, 456,
];

const GistsCode = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <div className="h-[30px] bg-[#f6f8fa] dark:bg-rua-gray-700 flex">
          <div className="flex items-center h-full mx-3">
            <div
              className={clsx(
                'box-border inline-block',
                'w-[13px] h-[13px] mr-2',
                'rounded-lg bg-[#ce5347]',
              )}
            ></div>
            <div
              className={clsx(
                'box-border inline-block',
                'w-[13px] h-[13px] mr-2',
                'rounded-lg bg-[#d6a243]',
              )}
            ></div>
            <div
              className={clsx(
                'box-border inline-block',
                'w-[13px] h-[13px]',
                'rounded-lg bg-[#58a942]',
              )}
            ></div>
          </div>

          <div
            className={clsx(
              'px-4 bg-white',
              'leading-[30px]',
              'dark:bg-rua-gray-700 dark:border-b dark:border-b-[rgb(128,203,196)]',
              'overflow-hidden whitespace-nowrap text-ellipsis',
              'flex items-center',
            )}
          >
            <span
              className={clsx(
                'bg-gray-300 animate-pulse',
                'w-20 h-4 block rounded-lg',
                'dark:bg-rua-gray-600',
              )}
            ></span>
          </div>
        </div>

        <pre>
          {allLength.map((item, index) => (
            <div
              key={index}
              className={bodyClass}
              style={{ width: item }}
            ></div>
          ))}
        </pre>
      </div>
    </>
  );
};

export default memo(GistsCode);
