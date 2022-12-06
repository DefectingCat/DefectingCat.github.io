import clsx from 'clsx';
import { memo, useState } from 'react';
import styles from './CopytButton.module.css';

export type CopyButtonProps = {
  onCopy?: () => void;
};

const CopyButton = ({ onCopy: onClick }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    onClick?.();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <>
      <button
        className={clsx(
          'flex items-center justify-center',
          'border rounded-md absolute',
          'top-4 right-4 p-[6px] opacity-0',
          'group-hover:opacity-100',
          'transition-opacity dark:border-gray-700',
          'duration-300',
          styles.btn
        )}
        onClick={handleClick}
      >
        <span
          className={clsx(
            'relative w-5 h-5 text-gray-400 child',
            'transition-all duration-300',
            styles.child
          )}
        >
          <svg
            className={clsx(
              'absolute top-0 left-0 fill-current',
              'opacity-100 transition-all duration-300',
              copied && styles['on_copy']
            )}
            viewBox="0 0 24 24"
          >
            <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path>
          </svg>
          <svg
            className={clsx(
              'absolute top-0 left-0 fill-green-400',
              'scale-[0.33] transition-all duration-300',
              'opacity-0',
              copied && styles['on_ok']
            )}
            viewBox="0 0 24 24"
          >
            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
          </svg>
        </span>
      </button>
    </>
  );
};

export default memo(CopyButton);