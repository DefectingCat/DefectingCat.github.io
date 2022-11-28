import clsx from 'clsx';
import Button from 'components/RUA/Button';
import { FiChevronUp } from 'react-icons/fi';

const BackToTop = () => {
  const handleBack = () => {
    const target = document.documentElement || document.body;
    target.scrollTo({
      top: 0,
    });
  };

  return (
    <>
      <Button
        onClick={handleBack}
        className={clsx(
          '!px-3 fixed',
          'right-4 bottom-4',
          'lg:right-8 lg:bottom-8'
        )}
      >
        <FiChevronUp className="w-6 h-6" />
      </Button>
    </>
  );
};

export default BackToTop;