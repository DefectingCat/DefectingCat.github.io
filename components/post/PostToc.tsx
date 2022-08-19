import { getHeadings } from 'lib/utils';
import Anchor from 'components/mdx/Anchor';
import styles from './PostToc.module.css';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface Props {
  headings: ReturnType<typeof getHeadings>;
}

const PostTOC = ({ headings }: Props) => {
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
          maxHeight: show ? (headings?.length ?? 0) * 50 + 70 : 70,
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

        <ul className="pl-4 border-l-4 border-gray-300 toc">
          {headings?.map((h) => (
            <li key={h.link}>
              <Anchor href={h.link} external={false}>
                {h.text}
              </Anchor>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PostTOC;
