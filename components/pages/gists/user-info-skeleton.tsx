import clsx from 'clsx';
import { FiLink, FiMail, FiTwitter } from 'react-icons/fi';

const UserInfoLoading = () => {
  return (
    <>
      <div
        className={clsx(
          'flex md:items-center flex-1',
          'max-w-[280px] md:block',
          'mb-4 flex-col md:flex-row',
        )}
      >
        <div className="flex md:flex-col">
          <div
            className={clsx(
              'w-16 h-16 mr-4 overflow-hidden',
              'md:w-72 md:h-72 bg-gray-200 rounded-lg-full',
              'animate-pulse dark:bg-rua-gray-800',
            )}
          ></div>

          <div>
            <h1
              className={clsx(
                'text-xl font-bold font-Barlow md:text-2xl w-44',
                'animate-pulse h-6 rounded-lg',
                'bg-gray-200 dark:bg-rua-gray-800',
                'my-2',
              )}
            ></h1>

            <h2
              className={clsx(
                'text-xl text-gray-400 font-Barlow md:text-2xl',
                'animate-pulse h-5 rounded-lg w-32',
                'bg-gray-200 dark:bg-rua-gray-800',
              )}
            ></h2>
          </div>
        </div>

        <div
          className={clsx(
            'my-4 w-44 h-4 rounded-lg animate-pulse',
            'bg-gray-200 dark:bg-rua-gray-800',
          )}
        ></div>

        <div>
          <div className="flex items-center mb-1 animate-pulse">
            <FiMail className="mr-2" />
            <div className="w-40 h-4 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex items-center mb-1 animate-pulse">
            <FiLink className="mr-2" />
            <div className="w-40 h-4 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex items-center mb-1 animate-pulse">
            <FiTwitter className="mr-2" />
            <div className="w-40 h-4 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfoLoading;
