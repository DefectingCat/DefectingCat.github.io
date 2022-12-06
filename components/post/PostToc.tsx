import clsx from 'clsx';
import Anchor from 'components/mdx/Anchor';
import { SingleToc } from 'lib/utils';
import { Fragment, memo, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styles from './PostToc.module.css';

interface Props {
  toc: SingleToc[];
  tocLength: number;
}

const TocItem = ({ item }: { item: SingleToc }) => {
  return (
    <li key={item.head}>
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
          'rounded-lg transition-all',
          'duration-500 overflow-hidden',
          'my-4'
        )}
        style={{
          maxHeight: show ? (tocLength ?? 0) * 50 + 70 : 70,
        }}
      >
        <h2
          className={clsx(
            styles.head,
            'bg-white !m-[unset] p-4',
            'rounded-lg border border-gray-300',
            'dark:bg-rua-gray-800 dark:border-rua-gray-600',
            'select-none cursor-pointer',
            'flex justify-between items-center',
            '!text-2xl'
          )}
          onClick={handleClick}
        >
          <span>What&apos;s inside?</span>

          <FiChevronDown
            className={clsx(
              show && 'rotate-180',
              'transition-all duration-500'
            )}
          />
        </h2>

        <div className="pl-4 border-l-4 border-gray-300 toc">
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