import clsx from 'clsx';
import { memo } from 'react';
import { FiGithub } from 'react-icons/fi';

const nowDay = new Date().getFullYear();

const Footer = () => {
  return (
    <>
      <footer className="w-full max-w-6xl px-4 mx-auto xl:px-0">
        <div className="h-[2px] bg-slate-500"></div>

        <div
          className={clsx(
            'flex items-center flex-col',
            'justify-between py-4',
            'lg:flex-row',
          )}
        >
          <div className="mb-1">&copy; {nowDay} Powered by Next.js 💙 xfy</div>
          <div className="mb-1">
            <a
              href="https://github.com/DefectingCat"
              target="_blank"
              rel="noreferrer"
            >
              <FiGithub />
            </a>
          </div>
          <div>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer"
            >
              皖ICP备17017808号-2
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default memo(Footer);
