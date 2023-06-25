'use client';

import clsx from 'clsx';
import Anchor from 'components/mdx/anchor';
import { SingleToc } from 'lib/utils';
import { Fragment, memo, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styles from './post-toc.module.css';

interface Props {
  toc: SingleToc[];
  tocLength: number;
}

const TocItem = ({ item }: { item: SingleToc }) => {
  return (
    <li key={item.head} className="mb-4">
      <Anchor href={item.link} external={false}>
        {item.head}
      </Anchor>
    </li>
  );
};

const PostToc = ({ toc, tocLength }: Props) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow((show) => !show);

  return (
    <>
      <div
        className={clsx(
          styles.head,
          'bg-white pt-4 px-6',
          'rounded-lg border border-gray-200',
          'dark:bg-rua-gray-800 dark:border-rua-gray-600',
          'select-none cursor-pointer',
          'rounded-lg transition-all',
          'duration-500 overflow-hidden',
          'my-4 text-2xl'
        )}
        style={{
          maxHeight: show ? (tocLength ?? 0) * 50 + 70 : 70,
        }}
      >
        <div
          className={clsx('flex justify-between items-center')}
          onClick={handleClick}
        >
          <span className="text-gray-500">TABLE OF CONTENTS</span>

          <FiChevronDown
            className={clsx(
              show && 'rotate-180',
              'transition-all duration-500'
            )}
          />
        </div>

        <div className="toc text-lg">
          <ul className="!pl-[unset]">
            {toc?.map((h) => (
              <Fragment key={h.link}>
                <TocItem item={h} />
                {h.children.map((child) => (
                  <ul className="!pl-4" key={child.link}>
                    <TocItem item={child} />
                  </ul>
                ))}
              </Fragment>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default memo(PostToc);
