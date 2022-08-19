import { getHeadings, SingleToc } from 'lib/utils';
import Anchor from 'components/mdx/Anchor';
import styles from './PostToc.module.css';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

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
  const handleClick = useCallback(() => setShow((show) => !show), []);

  return (
    <>
      <div
        className={classNames(
          'rounded-lg transition-all',
          'duration-500 overflow-hidden',
          'my-4'
        )}
        style={{
          maxHeight: show ? (tocLength ?? 0) * 50 + 70 : 70,
        }}
      >
        <h2
          className={classNames(
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
            className={classNames(
              show && 'rotate-180',
              'transition-all duration-500'
            )}
          />
        </h2>

        <div className="pl-4 border-l-4 border-gray-300 toc">
          <ul className="!pl-[unset]">
            {toc?.map((h) => (
              <>
                <TocItem item={h} key={h.link} />
                {h.children.map((child) => (
                  <ul className="!pl-4" key={child.link}>
                    <TocItem item={child} />
                  </ul>
                ))}
              </>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PostToc;
